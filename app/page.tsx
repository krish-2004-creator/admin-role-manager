
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-gray-900">
      <main className="flex flex-col items-center text-center px-4">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
          User Management <span className="text-blue-600">Portal</span>
        </h1>
        <p className="mt-4 text-lg leading-8 text-gray-600 max-w-2xl">
          A secure, role-based dashboard for managing users and administrators.
          Built with Next.js, Neon DB, and NextAuth.
        </p>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/login"
            className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors"
          >
            Create account <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="mt-16 flex gap-8 justify-center grayscale opacity-50">
          {/* Placeholders for logos or trust indicators if needed */}
        </div>
      </main>
    </div>
  );
}
