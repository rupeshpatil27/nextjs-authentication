import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to the Next.js Authentication Repo
      </h1>
      <p className="mb-6 text-gray-500">
        This is the starting point for a secure auth system.
      </p>

      <div className="flex gap-4">
        <Link 
          href="/sign-in" 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Sign In
        </Link>
        <Link 
          href="/sign-up" 
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
          Sign Up
        </Link>
        <Link 
          href="/dashboard" 
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          View Dashboard (Protected)
        </Link>
      </div>
    </main>
  );
}
