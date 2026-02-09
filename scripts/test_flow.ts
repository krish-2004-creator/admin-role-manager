import 'dotenv/config';
import { db } from '@/db';
import { users } from '@/db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

async function main() {
    const email = 'final_test@test.com';
    const password = 'FinalPassword123!';

    console.log(`Starting test flow for user: ${email}...`);

    try {
        // 1. Clean up existing users
        await db.delete(users).where(eq(users.email, email));

        // 2. Create User (Pending)
        console.log('Creating Test User...');
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.insert(users).values({
            name: 'Final Test User',
            email,
            password: hashedPassword,
            role: 'user',
            status: 'pending',
        });

        // 3. Verify Pending
        let user = await db.select().from(users).where(eq(users.email, email));
        if (user[0].status !== 'pending') {
            throw new Error('User should be pending initially.');
        }
        console.log(`User created successfully. Status: ${user[0].status}`);

        // 4. Approve User
        console.log('Approving User...');
        await db.update(users).set({ status: 'approved' }).where(eq(users.email, email));

        // 5. Verify Approved
        user = await db.select().from(users).where(eq(users.email, email));
        if (user[0].status !== 'approved') {
            throw new Error('User approval failed.');
        }
        console.log(`User approved successfully. Status: ${user[0].status}`);

        // 6. Reset to Pending
        console.log('Resetting User to Pending...');
        await db.update(users).set({ status: 'pending' }).where(eq(users.email, email));

        // 7. Reject User
        console.log('Rejecting User...');
        await db.update(users).set({ status: 'rejected' }).where(eq(users.email, email));

        // 8. Verify Rejected
        user = await db.select().from(users).where(eq(users.email, email));
        if (user[0].status !== 'rejected') {
            throw new Error('User rejection failed.');
        }
        console.log(`User rejected successfully. Status: ${user[0].status}`);

        // 9. Re-approve for final state
        console.log('Re-approving user for final verification...');
        await db.update(users).set({ status: 'approved' }).where(eq(users.email, email));

        console.log('Full test flow (Approve & Reject) completed successfully.');

    } catch (error) {
        console.error('Test flow failed:', error);
        process.exit(1);
    }
    process.exit(0);
}

main();
