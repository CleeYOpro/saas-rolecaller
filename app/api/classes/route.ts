import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

// Removed local client instantiation and connect()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const schoolId = searchParams.get('schoolId');

    let query = 'SELECT id, name, school_id as "schoolId" FROM classes';
    let params: any[] = [];

    if (schoolId) {
      query += ' WHERE school_id = $1';
      params.push(schoolId);
    }

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, schoolId } = await request.json();

    // Generate a random ID for the class
    const classId = Math.floor(Math.random() * 100000).toString();

    const result = await pool.query(
      'INSERT INTO classes (id, name, school_id) VALUES ($1, $2, $3) RETURNING id, name, school_id as "schoolId"',
      [classId, name, schoolId]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating class:', error);
    return NextResponse.json({ error: 'Failed to create class' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Class ID is required' }, { status: 400 });
    }

    await pool.query('DELETE FROM classes WHERE id = $1', [id]);
    return NextResponse.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Error deleting class:', error);
    return NextResponse.json({ error: 'Failed to delete class' }, { status: 500 });
  }
}