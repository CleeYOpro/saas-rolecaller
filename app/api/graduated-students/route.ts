import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import { verifyDirectorAccess } from '../../../lib/rbac';

// Students who graduated out of the school via the yearly promotion (see /api/promotions)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const schoolId = searchParams.get('schoolId');

    if (!schoolId) {
      return NextResponse.json({ error: 'School ID is required' }, { status: 400 });
    }

    const accessError = await verifyDirectorAccess(schoolId);
    if (accessError) return accessError;

    const result = await pool.query(
      `SELECT id, name, grade, number, school_id as "schoolId", graduation_year as "graduationYear"
       FROM graduated_students
       WHERE school_id = $1
       ORDER BY graduation_year DESC, name`,
      [schoolId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching graduated students:', error);
    return NextResponse.json({ error: 'Failed to fetch graduated students' }, { status: 500 });
  }
}
