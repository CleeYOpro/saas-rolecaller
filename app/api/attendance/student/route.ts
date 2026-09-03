import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

// Removed local client instantiation and connect()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    // Get attendance records for the student
    const attendanceResult = await pool.query(
      'SELECT id, student_id as "studentId", status, date::text as date, class_id as "classId" FROM attendance WHERE student_id = $1 ORDER BY date DESC',
      [studentId]
    );

    // Calculate summary statistics
    const summary = {
      present: 0,
      absent: 0,
      late: 0,
      total: attendanceResult.rows.length
    };

    attendanceResult.rows.forEach((record: any) => {
      if (record.status === 'present') summary.present++;
      if (record.status === 'absent') summary.absent++;
      if (record.status === 'late') summary.late++;
    });

    return NextResponse.json({
      attendance: attendanceResult.rows,
      summary
    });
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    return NextResponse.json({ error: 'Failed to fetch student attendance' }, { status: 500 });
  }
}