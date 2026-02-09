import 'dotenv/config';
import { db } from '@/db';
import { users } from '@/db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

async function main() {
    const email = 'newuser@test.com';
    const password = 'User123@123';
    console.log(`Creating pending user ${email}...`);
    try {
        const existingUser = await db.select().from(users).where(eq(users.email, email));

        if (existingUser.length > 0) {
            // Reset to pending if already exists
            await db.update(users).set({ status: 'pending' }).where(eq(users.email, email));
            console.log(`User ${email} reset to pending.`);
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.insert(users).values({
                name: 'New Test User',
                email,
                password: hashedPassword,
                role: 'user',
                status: 'pending',
            });
            console.log(`User ${email} created with pending status.`);
        }
    } catch (error) {
        console.error('Failed to create/reset user:', error);
        process.exit(1);
    }
    process.exit(0);
}

main();
