import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import { verifyDirectorAccess } from '../../../lib/rbac';
import { getSession } from '../../../lib/jwt';

// Removed local client instantiation and connect()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const schoolId = searchParams.get('schoolId');

    let query = 'SELECT id, student_id as "studentId", status, date::text as date, class_id as "classId" FROM attendance';
    let params: any[] = [];

    const accessError = await verifyDirectorAccess(schoolId);
    if (accessError) return accessError;

    // Filter by the class's school rather than the student's, so graduated students'
    // past attendance still shows up in the history of the classes they were in
    if (schoolId) {
      query += ' WHERE class_id IN (SELECT id FROM classes WHERE school_id = $1)';
      params.push(schoolId);
    }

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (session?.role === 'director') return NextResponse.json({ error: 'Directors cannot modify data' }, { status: 403 });

    const { studentId, status, date, classId } = await request.json();

    const result = await pool.query(
      'INSERT INTO attendance (student_id, status, date, class_id) VALUES ($1, $2, $3, $4) RETURNING id, student_id as "studentId", status, date::text as date, class_id as "classId"',
      [studentId, status, date, classId]
    );

    // Auto-present logic: Find all students in the same class who don't have a record for that date, and insert them as 'present'.
    // Never fills dates before the school's last yearly promotion or before a student was in another class,
    // because the class had different students then (correcting an old date must not add the newer ones).
    await pool.query(
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
      [date, classId]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating attendance record:', error);
    return NextResponse.json({ error: 'Failed to create attendance record' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (session?.role === 'director') return NextResponse.json({ error: 'Directors cannot modify data' }, { status: 403 });

    const { id, studentId, status, date, classId } = await request.json();

    const result = await pool.query(
      'UPDATE attendance SET student_id = $1, status = $2, date = $3, class_id = $4 WHERE id = $5 RETURNING id, student_id as "studentId", status, date::text as date, class_id as "classId"',
      [studentId, status, date, classId, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Attendance record not found' }, { status: 404 });
    }

    // Auto-present logic: Find all students in the same class who don't have a record for that date, and insert them as 'present'.
    // Skips dates when the class had different students (see POST).
    await pool.query(
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
      [date, classId]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating attendance record:', error);
    return NextResponse.json({ error: 'Failed to update attendance record' }, { status: 500 });
  }
}