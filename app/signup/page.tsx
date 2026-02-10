
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { register } from '@/app/actions';
import Link from 'next/link';

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 shadow-lg transform hover:-translate-y-0.5"
            aria-disabled={pending}
        >
            {pending ? 'Registering...' : 'Sign Up'}
        </button>
    );
}

export default function SignupPage() {
    const [errorMessage, dispatch] = useActionState(register, undefined);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20">
                <div className="px-8 pt-8 pb-8">
                    <h1 className="mb-2 text-3xl font-extrabold text-center text-white tracking-tight">Create Account</h1>
                    <p className="mb-8 text-center text-gray-400 text-sm">Join us to start your journey</p>
                    <form action={dispatch} className="space-y-5">
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="name">
                                Full Name
                            </label>
                            <input
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                id="name"
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                id="email"
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                id="password"
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <SubmitButton />

                        <div
                            className="flex h-6 items-end space-x-1 justify-center"
                            aria-live="polite"
                            aria-atomic="true"
                        >
                            {errorMessage === 'success' ? (
                                <p className="text-sm text-green-400 font-medium">Registration successful! Please login.</p>
                            ) : errorMessage && (
                                <p className="text-sm text-red-400 font-medium animate-pulse">{errorMessage}</p>
                            )}
                        </div>
                    </form>
                </div>
                <div className="bg-gray-900/50 px-8 py-4 border-t border-gray-700 text-center">
                    <p className="text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
