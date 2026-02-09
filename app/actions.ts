
'use server';

import { signIn, signOut, auth } from '@/auth';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

export async function register(prevState: string | undefined, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return 'Please fill in all fields';
    }

    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
        return 'User already exists';
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
            role: 'user', // Default role
            status: 'pending', // Default status
        });
    } catch {
        return 'Failed to register user';
    }
    // redirect or just return success message to let client handle redirect
    return 'success';
}
export async function approveUser(userId: number) {
    const session = await auth();
    if (session?.user?.role !== 'admin') {
        throw new Error('Unauthorized');
    }
    // update status
    await db.update(users)
        .set({ status: 'approved' })
        .where(eq(users.id, userId));
    revalidatePath('/dashboard');
}

export async function getUsers() {
    return await db.select().from(users).orderBy(users.createdAt);
}

export async function rejectUser(userId: number) {
    const session = await auth();
    if (session?.user?.role !== 'admin') {
        throw new Error('Unauthorized');
    }
    // update status
    await db.update(users)
        .set({ status: 'rejected' })
        .where(eq(users.id, userId));
    revalidatePath('/dashboard');
}

export async function handleSignOut() {
    await signOut();
}
