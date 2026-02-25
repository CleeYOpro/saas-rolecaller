import { NextResponse } from 'next/server';
import pool from './db';
import { getSession } from './jwt';

export async function verifyDirectorAccess(schoolId: string | null) {
  if (!schoolId) return null; // If no school is targeted, standard validation should occur in the route
  
  const session = await getSession();
  

  // If no session exists or the user is not a director, allow the request to proceed.
  // This maintains compatibility with the existing client-side school admin authentication
  // while ensuring that directors are restricted to their assigned schools.
  if (session && session.role === 'director') {
    const accessCheck = await pool.query(
      'SELECT 1 FROM director_schools WHERE director_id = $1 AND school_id = $2',
      [session.directorId, schoolId]
    );

    if (accessCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Unauthorized: Director cannot access this school' }, { status: 403 });
    }
  }

  return null; // Access granted
}
