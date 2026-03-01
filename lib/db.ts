import { Pool } from 'pg';

let dbUrl = process.env.DATABASE_URL;

// 1. Strip out single quotes or double quotes if they were accidentally added in Vercel.
if (dbUrl) {
    dbUrl = dbUrl.replace(/^['"]|['"]$/g, '');
}

// Robust fallback against terminal/turbopack cache issues overriding or dropping the DATABASE_URL.
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
        console.warn("==> Could not read fallback .env", e);
    }
}

if (!dbUrl || dbUrl === 'base' || !dbUrl.startsWith('postgres')) {
    throw new Error("CRITICAL STARTUP ERROR: DATABASE_URL is not properly configured. It must start with 'postgres://' or 'postgresql://'. Go to your Vercel Project Settings > Environment Variables, verify it, and hit Redeploy.");
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
