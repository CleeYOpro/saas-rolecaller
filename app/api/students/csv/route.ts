import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import { GRADE_LADDER, gradeIndex } from '../../../../lib/grades';

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
    const csvText = Buffer.from(fileBuffer).toString('utf-8').replace(/^﻿/, '');

    // Dynamic import for csv-parse
    const { parse } = await import('csv-parse/sync');

    // Parse CSV
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    }) as CSVRecord[];

    let created = 0;
    let skipped = 0;
    let invalid = 0;
    let classesCreated = 0;
    const numberConflicts: { name: string; number: string; usedBy: string }[] = [];

    // An upload only adds students; existing students are never changed, so uploading the same
    // (or last year's) list again can't create duplicates or move anyone between classes.
    for (const record of records) {
      const { name, number, grade, class: className } = record;

      if (!name || !number || !grade || !className) {
        console.warn('Skipping invalid record:', record);
        invalid++;
        continue;
      }

      // Match the class ignoring case and spacing; new grade classes get the standard spelling
      let classResult = await pool.query(
        'SELECT id FROM classes WHERE lower(trim(name)) = lower($1) AND school_id = $2 ORDER BY created_at LIMIT 1',
        [className.trim(), schoolId]
      );

      let classId;
      if (classResult.rows.length === 0) {
        const i = gradeIndex(className);
        const newClass = await pool.query(
          'INSERT INTO classes (name, school_id) VALUES ($1, $2) RETURNING id',
          [i >= 0 ? GRADE_LADDER[i].className : className.trim(), schoolId]
        );
        classId = newClass.rows[0].id;
        classesCreated++;
      } else {
        classId = classResult.rows[0].id;
      }

      // Same name (ignoring case and spacing) in the same class is the same student, unless both
      // have admission numbers and they differ, i.e. two different children with the same name
      const sameName = await pool.query(
        `SELECT number FROM students
         WHERE school_id = $1 AND class_id = $2
           AND lower(regexp_replace(trim(name), '\\s+', ' ', 'g')) = lower(regexp_replace(trim($3), '\\s+', ' ', 'g'))`,
        [schoolId, classId, name]
      );
      if (sameName.rows.some((s) => s.number === null || s.number === number)) {
        skipped++;
        continue;
      }

      // Admission numbers are unique per school; don't take one that belongs to another student
      const numberOwner = await pool.query(
        `SELECT s.name, c.name AS class
         FROM students s JOIN classes c ON c.id = s.class_id
         WHERE s.number = $1 AND s.school_id = $2`,
        [number, schoolId]
      );
      if (numberOwner.rows.length > 0) {
        numberConflicts.push({ name, number, usedBy: `${numberOwner.rows[0].name} (${numberOwner.rows[0].class})` });
        continue;
      }

      await pool.query(
        'INSERT INTO students (name, grade, class_id, school_id, number) VALUES ($1, $2, $3, $4, $5)',
        [name, grade, classId, schoolId, number]
      );
      created++;
    }

    return NextResponse.json({
      results: {
        created,
        skipped,
        invalid,
        classesCreated,
        numberConflicts
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