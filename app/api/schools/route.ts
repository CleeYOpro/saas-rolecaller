import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

// Removed local client instantiation and connect()

export async function GET() {
  try {
    const result = await pool.query('SELECT id, name, email FROM schools');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching schools:', error);
    return NextResponse.json({ error: 'Failed to fetch schools' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    const result = await pool.query(
      'INSERT INTO schools (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, password]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating school:', error);
    return NextResponse.json({ error: 'Failed to create school' }, { status: 500 });
  }
}