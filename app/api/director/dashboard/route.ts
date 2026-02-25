import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import { getSession } from '../../../../lib/jwt';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'director') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const directorId = session.directorId;

    // Fetch schools assigned to this director
    const schoolsResult = await pool.query(
      `SELECT s.id, s.name, s.email 
       FROM schools s
       JOIN director_schools ds ON s.id = ds.school_id
       WHERE ds.director_id = $1`,
      [directorId]
    );
    const schools = schoolsResult.rows;

    if (schools.length === 0) {
      return NextResponse.json({ success: true, schools: [], summary: { averageAttendance: 0, totalPresent: 0, totalAbsent: 0 } });
    }

    const schoolIds = schools.map(s => s.id);

    // Fetch attendance for these schools for today and the last 7 days
    const attendanceDataResult = await pool.query(
      `SELECT a.status, a.date, c.school_id as "schoolId"
       FROM attendance a
       JOIN classes c ON a.class_id = c.id
       WHERE c.school_id = ANY($1)
       AND a.date >= CURRENT_DATE - INTERVAL '7 days'`,
      [schoolIds]
    );

    const attendances = attendanceDataResult.rows;

    const todayStr = new Date().toISOString().split('T')[0];

    let globalPresent = 0;
    let globalAbsent = 0;

    const enrichedSchools = schools.map(school => {
      const schoolAttendances = attendances.filter(a => a.schoolId === school.id);
      
      const todayAttendances = schoolAttendances.filter(a => {
        // Handle timezone difference on dates and postgres return format formatting
        const dateStr = new Date(a.date).toISOString().split('T')[0];
        return dateStr === todayStr;
      });

      const todayPresent = todayAttendances.filter(a => a.status === 'present').length;
      const todayTotal = todayAttendances.filter(a => a.status === 'present' || a.status === 'absent').length; // Ignore 'late' if it exists or treat as present. Let's count them all.
      const todayAbsent = todayAttendances.filter(a => a.status === 'absent').length;

      globalPresent += todayPresent;
      globalAbsent += todayAbsent;

      const todayPercentage = todayTotal > 0 ? (todayPresent / todayTotal) * 100 : 0;

      // Group by date for the 7-day trend
      const trendMap: Record<string, { present: number, total: number }> = {};
      schoolAttendances.forEach(a => {
        const dateStr = new Date(a.date).toISOString().split('T')[0];
        if (!trendMap[dateStr]) trendMap[dateStr] = { present: 0, total: 0 };
        trendMap[dateStr].total += 1;
        if (a.status === 'present') trendMap[dateStr].present += 1;
      });

      const trend = Object.entries(trendMap).map(([date, data]) => ({
        date,
        percentage: data.total > 0 ? (data.present / data.total) * 100 : 0,
        present: data.present,
        absent: data.total - data.present,
        total: data.total
      })).sort((a, b) => a.date.localeCompare(b.date));

      return {
        ...school,
        todayPercentage,
        trend
      };
    });

    const globalTotal = globalPresent + globalAbsent;
    const globalAverage = globalTotal > 0 ? (globalPresent / globalTotal) * 100 : 0;

    return NextResponse.json({
      success: true,
      schools: enrichedSchools,
      summary: {
        averageAttendance: globalAverage,
        totalPresent: globalPresent,
        totalAbsent: globalAbsent
      }
    });
  } catch (error) {
    console.error('Director dashboard error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
