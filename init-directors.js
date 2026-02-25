const { Client } = require('pg');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

async function init() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Connected to database successfully');

    // Create directors table
    await client.query(`
      CREATE TABLE IF NOT EXISTS directors (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(255) UNIQUE NOT NULL,
        hashed_password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created directors table');

    // Create director_schools join table
    await client.query(`
      CREATE TABLE IF NOT EXISTS director_schools (
        director_id UUID REFERENCES directors(id) ON DELETE CASCADE,
        school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
        PRIMARY KEY (director_id, school_id)
      )
    `);
    console.log('Created director_schools join table');

    // Create a mock director for testing
    const username = 'director_demo';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const checkDirector = await client.query('SELECT id FROM directors WHERE username = $1', [username]);
    let directorId;
    
    if (checkDirector.rows.length === 0) {
      const insertResult = await client.query(
        'INSERT INTO directors (username, hashed_password) VALUES ($1, $2) RETURNING id',
        [username, hashedPassword]
      );
      directorId = insertResult.rows[0].id;
      console.log('Created mock director: username "director_demo", password "password123"');
    } else {
      directorId = checkDirector.rows[0].id;
      console.log('Mock director already exists');
    }

    // Assign some schools to the director
    const schoolsResult = await client.query('SELECT id FROM schools LIMIT 2');
    for (const school of schoolsResult.rows) {
      await client.query(`
        INSERT INTO director_schools (director_id, school_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
      `, [directorId, school.id]);
    }
    console.log('Assigned schools to mock director');

  } catch (err) {
    console.error('Error connecting to database:', err);
  } finally {
    await client.end();
  }
}

init();
