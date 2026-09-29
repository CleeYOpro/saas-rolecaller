import { NextResponse } from 'next/server';
import type { Pool, PoolClient } from 'pg';
import pool from '../../../lib/db';
import { verifyDirectorAccess } from '../../../lib/rbac';
import { GRADE_LADDER, gradeIndex, isTeacherClass } from '../../../lib/grades';

/**
 * Yearly grade promotion for one school.
 *
 * GET  /api/promotions?schoolId=...  -> preview of what would move
 * POST /api/promotions { schoolId, year } -> runs the promotion in one transaction
 *
 * Every student moves up one class along GRADE_LADDER; students in the last class are
 * moved into graduated_students with the current year as their graduation year.
 * Attendance rows are never touched: each keeps the class_id it was taken in, so past
 * school years still show who was in which class. The teachers class is ignored.
 */

const LAST = GRADE_LADDER.length - 1;

type Plan = {
  classIds: (string | null)[]; // class id per GRADE_LADDER entry, null if the school doesn't have it yet
  counts: number[]; // students per GRADE_LADDER entry
  duplicates: string[]; // grades that match more than one class
  untouched: { name: string; count: number }[]; // non-grade classes with students (teachers excluded)
};

async function loadPlan(db: Pool | PoolClient, schoolId: string): Promise<Plan> {
  const result = await db.query(
    `SELECT c.id, c.name, count(s.id)::int AS count
     FROM classes c
     LEFT JOIN students s ON s.class_id = c.id
     WHERE c.school_id = $1
     GROUP BY c.id, c.name`,
    [schoolId]
  );

  const plan: Plan = {
    classIds: GRADE_LADDER.map(() => null),
    counts: GRADE_LADDER.map(() => 0),
    duplicates: [],
    untouched: [],
  };

  for (const row of result.rows) {
    const i = gradeIndex(row.name);
    if (i === -1) {
      if (!isTeacherClass(row.name) && row.count > 0) plan.untouched.push({ name: row.name, count: row.count });
      continue;
    }
    if (plan.classIds[i]) plan.duplicates.push(GRADE_LADDER[i].className);
    plan.classIds[i] = row.id;
    plan.counts[i] += row.count;
  }

  return plan;
}

function summarize(plan: Plan, year: number) {
  return {
    steps: GRADE_LADDER.map((g, i) => ({
      from: g.className,
      to: i < LAST ? GRADE_LADDER[i + 1].className : String(year),
      count: plan.counts[i],
      graduating: i === LAST,
    })),
    promotedCount: plan.counts.slice(0, LAST).reduce((sum, n) => sum + n, 0),
    graduatingCount: plan.counts[LAST],
    // Target classes the school doesn't have yet but will need
    newClasses: GRADE_LADDER.slice(1)
      .filter((_, i) => plan.counts[i] > 0 && !plan.classIds[i + 1])
      .map((g) => g.className),
    duplicates: plan.duplicates,
    untouched: plan.untouched,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const schoolId = searchParams.get('schoolId');

    if (!schoolId) {
      return NextResponse.json({ error: 'School ID is required' }, { status: 400 });
    }

    const accessError = await verifyDirectorAccess(schoolId);
    if (accessError) return accessError;

    const year = new Date().getFullYear();
    const [plan, previous] = await Promise.all([
      loadPlan(pool, schoolId),
      pool.query(
        `SELECT promoted_count as "promotedCount", graduated_count as "graduatedCount", created_at as "createdAt"
         FROM school_promotions WHERE school_id = $1 AND year = $2`,
        [schoolId, year]
      ),
    ]);

    return NextResponse.json({ year, alreadyPromoted: previous.rows[0] ?? null, ...summarize(plan, year) });
  } catch (error) {
    console.error('Error previewing promotion:', error);
    return NextResponse.json({ error: 'Failed to load promotion preview' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let client: PoolClient | null = null;

  try {
    const { schoolId, year } = await request.json();

    if (!schoolId || !Number.isInteger(year)) {
      return NextResponse.json({ error: 'School ID and year are required' }, { status: 400 });
    }

    const accessError = await verifyDirectorAccess(schoolId);
    if (accessError) return accessError;

    const currentYear = new Date().getFullYear();
    if (year !== currentYear) {
      return NextResponse.json(
        { error: `This preview was for ${year}, but it is now ${currentYear}. Reopen the preview and try again.` },
        { status: 409 }
      );
    }

    client = await pool.connect();
    await client.query('BEGIN');

    const fail = async (status: number, error: string) => {
      await client!.query('ROLLBACK');
      return NextResponse.json({ error }, { status });
    };

    // Lock the school so a double click or a second admin can't run a promotion at the same time
    const school = await client.query('SELECT id FROM schools WHERE id = $1 FOR UPDATE', [schoolId]);
    if (school.rowCount === 0) return await fail(404, 'School not found');

    const previous = await client.query('SELECT 1 FROM school_promotions WHERE school_id = $1 AND year = $2', [schoolId, year]);
    if (previous.rowCount) return await fail(409, `This school has already been promoted for ${year}.`);

    const plan = await loadPlan(client, schoolId);
    if (plan.duplicates.length > 0) {
      return await fail(409, `This school has more than one ${plan.duplicates.join(', ')} class. Merge them before promoting.`);
    }

    // Graduate the last class first. Copy before deleting: the delete trigger only lets a
    // student with attendance leave `students` once they exist in graduated_students.
    let graduatedCount = 0;
    if (plan.classIds[LAST] && plan.counts[LAST] > 0) {
      const graduated = await client.query(
        `INSERT INTO graduated_students (id, school_id, name, grade, number, graduation_year, created_at)
         SELECT id, school_id, name, grade, number, $2, created_at FROM students WHERE class_id = $1`,
        [plan.classIds[LAST], year]
      );
      await client.query('DELETE FROM students WHERE class_id = $1', [plan.classIds[LAST]]);
      graduatedCount = graduated.rowCount ?? 0;
    }

    // Move each class up, top-down so nobody moves twice. students.grade follows along
    // only where it held the old grade value; anything else in that column is left alone.
    let promotedCount = 0;
    const createdClasses: string[] = [];
    for (let i = LAST - 1; i >= 0; i--) {
      if (!plan.classIds[i] || plan.counts[i] === 0) continue;

      let targetId = plan.classIds[i + 1];
      if (!targetId) {
        const created = await client.query(
          'INSERT INTO classes (name, school_id) VALUES ($1, $2) RETURNING id',
          [GRADE_LADDER[i + 1].className, schoolId]
        );
        targetId = created.rows[0].id as string;
        createdClasses.push(GRADE_LADDER[i + 1].className);
      }

      const moved = await client.query(
        `UPDATE students
         SET class_id = $2, grade = CASE WHEN grade = $3 THEN $4 ELSE grade END
         WHERE class_id = $1`,
        [plan.classIds[i], targetId, GRADE_LADDER[i].grade, GRADE_LADDER[i + 1].grade]
      );
      promotedCount += moved.rowCount ?? 0;
    }

    await client.query(
      'INSERT INTO school_promotions (school_id, year, promoted_count, graduated_count) VALUES ($1, $2, $3, $4)',
      [schoolId, year, promotedCount, graduatedCount]
    );
    await client.query('COMMIT');

    return NextResponse.json({ year, promotedCount, graduatedCount, createdClasses });
  } catch (error) {
    if (client) await client.query('ROLLBACK').catch(() => {});
    console.error('Error promoting students:', error);
    return NextResponse.json({ error: 'Failed to promote students. Nothing was changed.' }, { status: 500 });
  } finally {
    client?.release();
  }
}
