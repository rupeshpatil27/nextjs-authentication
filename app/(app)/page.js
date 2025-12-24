import { cn } from '@/lib/utils';
import { Poppins } from 'next/font/google';
import Link from 'next/link';

const font=Poppins({
  subsets:["latin"],
  weight:["600"],
})

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-linear-to-r from-slate-300 via-slate-200 to-slate-300">
      <h1 className={cn("text-4xl font-bold mb-4",font.className)}>
        Welcome to the Next.js 🔐 Authentication
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
          className="px-4 py-2 bg-gray-600 text-gray-200 rounded hover:bg-gray-800 transition"
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
