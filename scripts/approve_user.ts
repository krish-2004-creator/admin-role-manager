import 'dotenv/config';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
    const email = 'test@test.com';
    console.log(`Approving user ${email}...`);
    try {
        await db.update(users)
            .set({ status: 'approved' })
            .where(eq(users.email, email));
        console.log(`User ${email} has been approved.`);
    } catch (error) {
        console.error('Failed to approve user:', error);
        process.exit(1);
    }
    process.exit(0);
}

main();
