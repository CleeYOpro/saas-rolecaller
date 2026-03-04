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

    // Fetch director name
    const directorRes = await pool.query('SELECT username FROM directors WHERE id = $1', [directorId]);
    const directorName = directorRes.rows[0]?.username || 'Director';

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

    // Format today's date consistently with how dates are stored in the DB
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format

    let globalPresent = 0;
    let globalAbsent = 0;

    const enrichedSchools = schools.map(school => {
      const schoolAttendances = attendances.filter(a => a.schoolId === school.id);
      
      // Group by date for the 7-day trend
      const trendMap: Record<string, { present: number, absent: number, total: number }> = {};
      schoolAttendances.forEach(a => {
        // Format the date to YYYY-MM-DD to match the format from the database
        const dateStr = new Date(a.date).toISOString().split('T')[0];
        if (!trendMap[dateStr]) trendMap[dateStr] = { present: 0, absent: 0, total: 0 };
        trendMap[dateStr].total += 1;
        if (a.status === 'present') trendMap[dateStr].present += 1;
        if (a.status === 'absent') trendMap[dateStr].absent += 1;
      });

      // Get today's attendance for this school
      const todayData = trendMap[todayStr];
      const todayPresent = todayData?.present || 0;
      const todayAbsent = todayData?.absent || 0;
      const todayTotal = todayData?.total || 0;
      const todayPercentage = todayTotal > 0 ? (todayPresent / todayTotal) * 100 : 0;

      globalPresent += todayPresent;
      globalAbsent += todayAbsent;

      const trend = Object.entries(trendMap).map(([date, data]) => ({
        date,
        percentage: data.total > 0 ? (data.present / data.total) * 100 : 0,
        present: data.present,
        absent: data.absent,
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
      directorName,
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