import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import ExcelJS from 'exceljs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const schoolId = searchParams.get('schoolId');

    if (!schoolId) {
      return NextResponse.json({ error: 'Missing schoolId' }, { status: 400 });
    }

    // Generate last 30 days dates in YYYY-MM-DD
    const dates = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }).reverse();

    // Fetch students
    const studentsResult = await pool.query(
      'SELECT id, name FROM students WHERE school_id = $1 ORDER BY name',
      [schoolId]
    );
    const students = studentsResult.rows;

    // Fetch attendance for these dates
    const thirtyDaysAgo = dates[0];
    const attendanceResult = await pool.query(
      `SELECT student_id, status, date
       FROM attendance
       WHERE student_id IN (SELECT id FROM students WHERE school_id = $1)
       AND date >= $2`,
      [schoolId, thirtyDaysAgo]
    );
    const attendanceRecords = attendanceResult.rows;

    const workbook = new ExcelJS.Workbook();
    
    // ---- Sheet 1: Daily Attendance ----
    const sheet1 = workbook.addWorksheet('Attendance (Last 30 Days)');
    sheet1.columns = [
      { header: 'Student Name', key: 'name', width: 25 },
      ...dates.map(date => ({ header: date, key: date, width: 12 }))
    ];

    // Build data structure
    const attendanceMap: Record<string, Record<string, string>> = {};
    attendanceRecords.forEach(record => {
      if (!attendanceMap[record.student_id]) {
        attendanceMap[record.student_id] = {};
      }
      
      let dString = '';
      if (record.date instanceof Date) {
        const yyyy = record.date.getFullYear();
        const mm = String(record.date.getMonth() + 1).padStart(2, '0');
        const dd = String(record.date.getDate()).padStart(2, '0');
        dString = `${yyyy}-${mm}-${dd}`;
      } else {
        dString = String(record.date).slice(0, 10);
      }
      attendanceMap[record.student_id][dString] = record.status;
    });

    const studentStats: { name: string; presentCount: number }[] = [];

    students.forEach(student => {
      const row: any = { name: student.name };
      let presentCount = 0;

      dates.forEach(date => {
        const status = attendanceMap[student.id]?.[date];
        if (status === 'present') {
           row[date] = 'Present';
           presentCount++;
        } else if (status === 'absent') {
           row[date] = 'Absent';
        } else if (status === 'late') {
           row[date] = 'Late'; // Depending on requirements, we can keep late as late. But prompt says "Present or Absent only" - let's treat late as either Late or we just map everything properly
        } else {
           row[date] = ''; // No data if data isn't there
        }
      });
      
      sheet1.addRow(row);
      studentStats.push({ name: student.name, presentCount });
    });

    // ---- Sheet 2: Most Present Students ----
    const sheet2 = workbook.addWorksheet('Most Present Students');
    sheet2.columns = [
      { header: 'Student Name', key: 'name', width: 25 },
      { header: 'Total Present', key: 'presentCount', width: 15 }
    ];

    // Sort descending
    studentStats.sort((a, b) => b.presentCount - a.presentCount);

    studentStats.forEach(stat => {
      sheet2.addRow({ name: stat.name, presentCount: stat.presentCount });
    });

    // Write to buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Stream the file
    const headers = new Headers();
    headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    headers.set('Content-Disposition', 'attachment; filename="attendance_report.xlsx"');

    return new NextResponse(buffer, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error generating Excel:', error);
    return NextResponse.json({ error: 'Failed to generate Excel report' }, { status: 500 });
  }
}
