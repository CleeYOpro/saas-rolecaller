import { Pool } from 'pg';

let dbUrl = process.env.DATABASE_URL;

// Robust fallback against terminal/turbopack cache issues overriding or dropping the DATABASE_URL.
// The string 'base' comes from local dev overrides / cache that pg resolves as a literal hostname.
if (!dbUrl || dbUrl === 'base' || !dbUrl.startsWith('postgres')) {
    try {
        const fs = require('fs');
        const path = require('path');
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf8');
            const match = content.match(/DATABASE_URL=['"]?(postgres[^'"\s]+)/);
            if (match && match[1]) {
                dbUrl = match[1];
                console.log("==> Extracted fallback DATABASE_URL from .env");
            }
        } else {
            console.warn("==> No local .env file found. If you are on Vercel, ensure DATABASE_URL is set in your Project Settings > Environment Variables!");
        }
    } catch (e) {
        console.warn("==> Could not read fallback .env. If you are on Vercel, ensure DATABASE_URL is set in your Project Settings > Environment Variables!", e);
    }
}

const pool = new Pool({
    connectionString: dbUrl,
    ssl: {
        rejectUnauthorized: false
    },
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

export default pool;
