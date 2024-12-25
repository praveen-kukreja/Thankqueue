"use client";
import { useEffect, useState } from 'react';
import { useSession, SessionProvider, signIn } from 'next-auth/react';

interface Request {
  thankyou_id: number;
  sender: string;
  description: string;
  receiver: string;
  amount: number;
  // Add any other properties that a request might have
}

export default function ApproveRequests() {

  return (
    <SessionProvider>
      <RequestsList/>
    </SessionProvider>
    );

  }

export function RequestsList() {

  const { data: session } = useSession();
  const POINTS = 10

  // Hardcoded list of requests
  // const requests = Array.from({ length: 20 }, (_, index) => ({
  //   thankyou_id: index + 1,
  //   sender: `Helper ${index + 1}`,
  //   description: `Description for request ${index + 1}`,
  //   department: index % 2 === 0 ? "Sales" : "IT",
  // }));

  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const username = session?.user?.name;
        if (username){
          const response = await fetch(`/api/pending?user=${encodeURIComponent(username)}`);
          const data = await response.json();
          setRequests(data.requests || []);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, []);

  const handleApprove = async (id : number, helpreceiver: string, helpsender: string, amount: number) => {
    console.log(`Approving request with id: ${id}`);
    try {
      const resp = await fetch(`/api/userdata?employee=${encodeURIComponent(helpsender)}`);
      const senderData = await resp.json()

      const response = await fetch("/api/approve-help", {
        method: "POST",
        body: JSON.stringify({ helpId: id, pointsToClaim: amount, helpreceiver: helpreceiver, helpsender: helpsender}),
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();

      if (result.success) {

        try {
        const claimResponse = await fetch("/api/claimpoints", {
          method: "POST",
          body: JSON.stringify({
            username: senderData.username,
            thankyou_id: id,
            createdat: new Date().toISOString(),
            status: "APPROVED",
            updatedat: new Date().toISOString(),
          }),
          headers: { "Content-Type": "application/json" },
        });

        const claimResult = await claimResponse.json();
        if (!claimResult.success) {
          console.error("Error adding claim:", claimResult.message);
        }
      } catch (claimError) {
        console.error("Error making claim API call:", claimError);
      }

        // Remove approved request from the list
        setRequests((prev) => prev.filter((request) => request.thankyou_id !== id));
        alert("Request approved successfully!");
      } else if (result.requiresReview) {
        alert(
          "This request requires review because the helper is from another department."
        );
      } else {
        alert(result.message || "An error occurred while approving the request.");
      }
    } catch (error) {
      console.error("Error approving request:", error);
      alert("Failed to approve the request. Please try again.");
    }
  };

  const handleSendForReview = (id: number) => {
    console.log(`Sending request with id: ${id} for review`);
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <p className="text-lg">You need to be signed in to view this page.</p>
        <button
          onClick={() => signIn()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-3xl font-bold mb-4">Pending Thank Requests</h1>
      <ul className="w-1/2 overflow-y-auto max-h-96">
        { requests.length > 0 ? (
          requests.map((request) => (
            <li key={request.thankyou_id} className="border-b py-2">
              <p><strong>Helper:</strong> {request.sender}</p>
              <p><strong>Description:</strong> {request.description}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleApprove(request.thankyou_id, request.receiver, request.sender, request.amount)}
                  className="px-2 py-1 bg-green-500 text-white rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleSendForReview(request.thankyou_id)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded"
                >
                  Send for Review
                </button>
              </div>
            </li>
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
          <h2 className="text-lg text-center">Voila, you are all set</h2>
          </div>
        )
      }
      </ul>
    </div>
  );
}