import 'dotenv/config';
import { db } from '@/db';
import { users } from '@/db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';


async function main() {
    console.log('Verifying database connection...');
    try {
        const existingUsers = await db.select().from(users).limit(1);
        console.log('Database connected successfully.');

        const email = 'test@test.com';
        const password = 'Test123@123';
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await db.select().from(users).where(eq(users.email, email));

        if (existingUser.length > 0) {
            console.log(`User ${email} already exists. updating password just in case.`);
            await db.update(users).set({ password: hashedPassword }).where(eq(users.email, email));
        } else {
            console.log(`Creating user ${email}...`);
            await db.insert(users).values({
                name: 'Test User',
                email,
                password: hashedPassword,
                role: 'user',
                status: 'pending',
            });
            console.log('User created successfully.');
        }
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
    process.exit(0);
}

main();
