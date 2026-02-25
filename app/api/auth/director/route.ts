import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import bcrypt from 'bcryptjs';
import { setSession } from '../../../../lib/jwt';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Check if director exists
    const result = await pool.query(
      'SELECT id, username, hashed_password FROM directors WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const director = result.rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, director.hashed_password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Set JWT Session Cookie
    await setSession({
      directorId: director.id,
      role: 'director'
    });

    return NextResponse.json({
      success: true,
      director: {
        id: director.id,
        username: director.username
      }
    });
  } catch (error) {
    console.error('Director login error:', error);
    return NextResponse.json({
      success: false,
      error: 'Login failed due to an unexpected error'
    }, { status: 500 });
  }
}
