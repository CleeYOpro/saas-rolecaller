const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

async function getDatabaseSchema() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Connected to database successfully');

    // Get all tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    console.log('\nTables in database:');
    for (const row of tablesResult.rows) {
      console.log(`- ${row.table_name}`);

      // Get columns for each table
      const columnsResult = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position
      `, [row.table_name]);

      console.log(`  Columns in ${row.table_name}:`);
      for (const col of columnsResult.rows) {
        console.log(`    - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
      }

      // Get primary keys
      const pkResult = await client.query(`
        SELECT a.attname AS column_name
        FROM pg_index i
        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
        WHERE i.indrelid = $1::regclass AND i.indisprimary
      `, [row.table_name]);

      if (pkResult.rows.length > 0) {
        console.log(`  Primary key(s): ${pkResult.rows.map(r => r.column_name).join(', ')}`);
      }

      console.log('');
    }

    // Try to get some sample data to understand relationships
    console.log('Sample data:');
    for (const row of tablesResult.rows) {
      try {
        const sampleResult = await client.query(`SELECT * FROM ${row.table_name} LIMIT 3`);
        console.log(`\nSample from ${row.table_name}:`);
        console.log(sampleResult.rows);
      } catch (err) {
        console.log(`\nCould not get sample from ${row.table_name}:`, err.message);
      }
    }

  } catch (err) {
    console.error('Error connecting to database:', err);
  } finally {
    await client.end();
  }
}

getDatabaseSchema();