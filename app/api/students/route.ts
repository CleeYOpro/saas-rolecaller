import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import { verifyDirectorAccess } from '../../../lib/rbac';
import { getSession } from '../../../lib/jwt';

// Removed local client instantiation and connect()


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const schoolId = searchParams.get('schoolId');

    let query = 'SELECT id, name, grade, class_id as "classId", school_id as "schoolId", number FROM students';
    let params: any[] = [];

    const accessError = await verifyDirectorAccess(schoolId);
    if (accessError) return accessError;

    if (schoolId) {
      query += ' WHERE school_id = $1';
      params.push(schoolId);
    }

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (session?.role === 'director') return NextResponse.json({ error: 'Directors cannot modify data' }, { status: 403 });

    const { name, standard, classId, schoolId } = await request.json();

    const result = await pool.query(
      'INSERT INTO students (name, grade, class_id, school_id) VALUES ($1, $2, $3, $4) RETURNING id, name, grade as "standard", class_id as "classId", school_id as "schoolId"',
      [name, standard, classId, schoolId]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (session?.role === 'director') return NextResponse.json({ error: 'Directors cannot modify data' }, { status: 403 });

    const { id, name, standard, classId, schoolId } = await request.json();

    const result = await pool.query(
      'UPDATE students SET name = $1, grade = $2, class_id = $3, school_id = $4 WHERE id = $5 RETURNING id, name, grade as "standard", class_id as "classId", school_id as "schoolId"',
      [name, standard, classId, schoolId, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (session?.role === 'director') return NextResponse.json({ error: 'Directors cannot modify data' }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    await pool.query('DELETE FROM students WHERE id = $1', [id]);
    return NextResponse.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}