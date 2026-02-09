import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const getDb = () => {
    if (!process.env.DATABASE_URL) {
        // Fallback for build time if env var is missing
        return null;
    }
    const sql = neon(process.env.DATABASE_URL);
    return drizzle(sql, { schema });
};

export const db = getDb()!;
// Note: We use ! because at runtime it must exist,
// but this lazy pattern helps some bundlers/build steps.
// Better yet, let's export a proxy or a getter if needed.
