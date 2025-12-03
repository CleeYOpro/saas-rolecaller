import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

// Removed local client instantiation and connect()

export async function POST(request: Request) {
  try {
    const { schoolId, email, password } = await request.json();

    // In a real application, you would hash passwords and use proper authentication
    // For this demo, we'll just check if the school exists with the given credentials

    const result = await pool.query(
      'SELECT id, name, email FROM schools WHERE id = $1 AND email = $2 AND password = $3',
      [schoolId, email, password]
    );

    if (result.rows.length > 0) {
      return NextResponse.json({
        success: true,
        school: result.rows[0]
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({
      success: false,
      error: 'Login failed'
    }, { status: 500 });
  }
}