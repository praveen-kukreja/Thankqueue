// export default function Home() {
//   return (
//     <div className="flex flex-col items-center justify-center h-screen">
//       <h1 className="text-4xl font-bold mb-4">Welcome to ThankQueue</h1>
//       <p className="mb-6 text-lg text-gray-600">
//         Recognizing unsung heroes in your organization!
//       </p>
//       <div className="space-x-4">
//         <a href="/thank-you" className="px-4 py-2 bg-blue-500 text-white rounded">
//           Send/Receive a Thank You
//         </a>
//         <a href="/profile" className="px-4 py-2 bg-green-500 text-white rounded">
//           View Profile
//         </a>
//       </div>
//     </div>
//   );
// }

'use client'; // This is a Client Component

import { SessionProvider } from 'next-auth/react'; // Import SessionProvider
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  return (
    <SessionProvider>
      <LoginPageContent />
    </SessionProvider>
  );
}

function LoginPageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard'); // Redirect to dashboard if authenticated
    }
  }, [status]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl mb-6">Welcome to ThankQueue</h1>
        <button
          onClick={() => signIn('google')}
          className="px-6 py-3 bg-blue-500 text-white rounded"
        >
          Sign In with Google
        </button>
      </div>
    );
  }

  return <div>Redirecting to dashboard...</div>;
}
