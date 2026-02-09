import 'dotenv/config';
import { db } from '@/db';
import { users } from '@/db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

async function main() {
    const email = 'test@test.com';
    const password = 'Test123@123';

    console.log(`Setting admin role and updating password for: ${email}...`);

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.update(users)
            .set({
                role: 'admin',
                status: 'approved',
                password: hashedPassword
            })
            .where(eq(users.email, email));

        console.log(`Successfully updated ${email} to Admin with new password.`);
    } catch (error) {
        console.error('Failed to update user:', error);
        process.exit(1);
    }
    process.exit(0);
}

main();
