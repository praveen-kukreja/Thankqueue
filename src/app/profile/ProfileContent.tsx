"use client";
import { useState, useEffect } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import BadgeProgress from './BadgeProgress';

interface UserData {
  username: string;
  employee_name: string;
  designation_id: number;
}

export default function ProfileContent() {
  return (
    <SessionProvider>
      <Content />
    </SessionProvider>
  );
}

export function Content() {
  const { data: session } = useSession();
  const [canClaim, setCanClaim] = useState(false);
  const [userData, setUserData] = useState<UserData>({ username: '', employee_name: '', designation_id: 0 });
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    const fetchUserDataAndPoints = async () => {
      if (session?.user?.name) {
        const username = session.user.name;

        // Fetch user data first
        try {
          const resUserData = await fetch(`/api/userdata?employee=${encodeURIComponent(username)}`);
          const data = await resUserData.json();
          setUserData(data);

          // Then fetch user points using the fetched username
          if (data.username) {

            const resUserPoints = await fetch(`/api/getpoints?username=${encodeURIComponent(data.username)}`);
            const pointsData = await resUserPoints.json();
            const points = Array.isArray(pointsData) && pointsData.length > 0 ? pointsData[0].points : 0;

            setUserPoints(points);
          } else {
            console.error("Username not found in user data.");
          }
        } catch (error) {
          console.error("Error fetching user data or points:", error);
        }
      }
    };

    fetchUserDataAndPoints();
  }, [session]);

  const handleClaim = async () => {
    console.log(userPoints)
    if (userPoints >= 100) {
      setCanClaim(true);
      alert('You are ready to claim your reimbursement on Saral Portal!');
    } else {
      alert('You need at least 100 points to claim reimbursement.');
    }
  };

  return session ? (
    <div className="flex flex-col items-center space-y-8 w-full max-w-4xl mx-auto px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">{userData.employee_name}'s Profile</h1>
        <p className="text-lg text-gray-600">Total Points: {userPoints}</p>
      </div>
      
      {/* Add the BadgeProgress component */}
      <BadgeProgress points={userPoints} />
      
      <button
        onClick={handleClaim}
        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
      >
        Claim Reimbursement
      </button>
      {canClaim && (
        <p className="text-green-500 font-medium">
          You are ready for reimbursement!
        </p>
      )}
    </div>
  ) : null;
}
