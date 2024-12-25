"use client";

import { SessionProvider } from 'next-auth/react';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Logout() {
    return (
      <SessionProvider>
        <LogoutButton />
      </SessionProvider>
    );
  }

export function LogoutButton() {
  const { data: session } = useSession();

  if (!session) {
    return (
        <div className="flex flex-col items-center space-y-4">
        <p className="text-lg">You need to be signed in to view this page.</p>
        <button
          onClick={() => signIn()}
          className="mt-4 px-4 py-2 bg-thank-you-gradient text-white rounded font-semibold tracking-wide"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      
      {/* Logout Button */}
      <button
        onClick={() => signOut()}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
      
      {/* Other profile content */}
    </div>
  );
}