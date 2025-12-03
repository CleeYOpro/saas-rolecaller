import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

// Define the type for our CSV records
interface CSVRecord {
  name: string;
  number: string;
  grade: string;
  class: string;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const schoolId = formData.get('schoolId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!schoolId) {
      return NextResponse.json({ error: 'School ID is required' }, { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer();
    const csvText = Buffer.from(fileBuffer).toString('utf-8');

    // Dynamic import for csv-parse
    const { parse } = await import('csv-parse/sync');

    // Parse CSV
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    }) as CSVRecord[];

    let created = 0;
    let updated = 0;
    let classesCreated = 0;

    // Process each record
    for (const record of records) {
      const { name, number, grade, class: className } = record;

      if (!name || !number || !grade || !className) {
        console.warn('Skipping invalid record:', record);
        continue;
      }

      // Check if class exists, create if not
      let classResult = await pool.query(
        'SELECT id FROM classes WHERE name = $1 AND school_id = $2',
        [className, schoolId]
      );

      let classId;
      if (classResult.rows.length === 0) {
        // Create new class
        classId = Math.floor(Math.random() * 100000).toString();
        await pool.query(
          'INSERT INTO classes (id, name, school_id) VALUES ($1, $2, $3)',
          [classId, className, schoolId]
        );
        classesCreated++;
      } else {
        classId = classResult.rows[0].id;
      }

      // Check if student exists
      const studentResult = await pool.query(
        'SELECT id FROM students WHERE id = $1 AND school_id = $2',
        [number, schoolId]
      );

      if (studentResult.rows.length === 0) {
        // Create new student
        await pool.query(
          'INSERT INTO students (id, name, grade, class_id, school_id) VALUES ($1, $2, $3, $4, $5)',
          [number, name, grade, classId, schoolId]
        );
        created++;
      } else {
        // Update existing student
        await pool.query(
          'UPDATE students SET name = $1, grade = $2, class_id = $3 WHERE id = $4 AND school_id = $5',
          [name, grade, classId, number, schoolId]
        );
        updated++;
      }
    }

    return NextResponse.json({
      results: {
        created,
        updated,
        classesCreated
      }
    });
  } catch (error) {
    console.error('Error processing CSV:', error);
    return NextResponse.json({
      error: 'Failed to process CSV file',
      details: error instanceof Error ? [error.message] : []
    }, { status: 500 });
  }
}