import 'dotenv/config';
import { db } from '@/db';
import { users } from '@/db/schema';

async function main() {
    console.log('Checking user status...');
    try {
        const allUsers = await db.select().from(users);
        console.table(allUsers.map(u => ({ id: u.id, email: u.email, role: u.role, status: u.status })));
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
    process.exit(0);
}

main();
