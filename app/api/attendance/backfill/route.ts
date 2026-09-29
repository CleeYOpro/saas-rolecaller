import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

/**
 * POST /api/attendance/backfill
 *
 * Scans every (class_id, date) pair that already has at least one attendance
 * record in the database, then inserts a 'present' record for every student
 * in that class who is missing a record for that date.
 *
 * This is safe to call multiple times — the NOT EXISTS guard prevents
 * duplicate inserts. It never fills dates before the school's last yearly
 * promotion, or before a student was in another class, because the class had
 * different students then — past school years must not gain the newer ones.
 */
export async function POST() {
  try {
    // Find all distinct (class_id, date) pairs that have been attended
    const activeDayRows = await pool.query(
      `SELECT DISTINCT class_id, date
       FROM attendance
       WHERE class_id IS NOT NULL`
    );

    if (activeDayRows.rows.length === 0) {
      return NextResponse.json({ message: 'No attendance days found to backfill.', filled: 0 });
    }

    let totalFilled = 0;

    for (const row of activeDayRows.rows) {
      const { class_id, date } = row;

      const result = await pool.query(
        `INSERT INTO attendance (student_id, status, date, class_id)
         SELECT s.id, 'present', $1, $2
         FROM students s
         WHERE s.class_id = $2
           AND $1 >= COALESCE((SELECT max(p.created_at)::date FROM school_promotions p WHERE p.school_id = s.school_id), '-infinity')
           AND NOT EXISTS (
             SELECT 1
             FROM attendance a
             WHERE a.student_id = s.id
               AND (a.date = $1 OR (a.class_id <> $2 AND a.date > $1))
           )`,
        [date, class_id]
      );

      totalFilled += result.rowCount ?? 0;
    }

    console.log(`Backfill complete: inserted ${totalFilled} 'present' records across ${activeDayRows.rows.length} class-day pairs.`);

    return NextResponse.json({
      message: 'Backfill complete.',
      classDayPairsProcessed: activeDayRows.rows.length,
      recordsInserted: totalFilled,
    });
  } catch (error) {
    console.error('Backfill error:', error);
    return NextResponse.json({ error: 'Backfill failed', details: String(error) }, { status: 500 });
  }
}
