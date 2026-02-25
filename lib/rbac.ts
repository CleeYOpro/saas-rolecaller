import { NextResponse } from 'next/server';
import pool from './db';
import { getSession } from './jwt';

export async function verifyDirectorAccess(schoolId: string | null) {
  if (!schoolId) return null; // If no school is targeted, standard validation should occur in the route
  
  const session = await getSession();
  
  // If no session exists, or not a director, we let the existing school admin flow continue.
  // The current app design has school admin auth state tracked on the client only,
  // so backend assumes normal requests without session are school admins (which is insecure but part of the existing design).
  // Our goal is just to ensure IF a director session is present, they don't jump boundaries.
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
