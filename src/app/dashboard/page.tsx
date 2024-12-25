"use client";
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react'; // Import SessionProvider
import ThemeToggle from '../theme-toggle';


export default function Dashboard() {
    return (
      <SessionProvider>
        <DashboardPage />
      </SessionProvider>
    );
  }

function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      // If not authenticated, redirect to login
      router.push('/');
    }
  }, [status]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div>
        <h1>Please sign in to view the dashboard</h1>
        <button onClick={() => signIn('google')}>Sign In</button>
      </div>
    );
  }

  return (
   
    <div className="flex flex-col items-center justify-center h-screen">
      <ThemeToggle/>
      <h1 className="text-4xl font-bold mb-4">Welcome to ThankQueue</h1>
      <p className="mb-6 text-lg text-gray-600">
        Recognizing unsung heroes in your organization!
      </p>
      <div className="space-x-4">
        <a href="/thank-you" className="px-4 py-2 bg-thank-you-gradient text-white rounded font-semibold tracking-wide">
          Send/Receive a Thank You
        </a>
        <a href="/profile" className="px-4 py-2 bg-thank-you-gradient text-white rounded font-semibold tracking-wide">
          View Profile
        </a>
      </div>
    </div>

  );
}
