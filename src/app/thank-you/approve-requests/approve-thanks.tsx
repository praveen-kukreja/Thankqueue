"use client";

export default function ThankYouApproval({ helperId }: { helperId: number }) {
  const handleApprove = async () => {
    const res = await fetch('/api/approve-help', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ helperId, pointsToAdd: 10 }), // Add 10 points for this example
    });

    const data = await res.json();
    if (data.success) {
      alert('Thank you approved! Points have been added.');
    } else {
      alert('Failed to approve the thank you.');
    }
  };

  return (
    <button
      onClick={handleApprove}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Approve Thank You
    </button>
  );
}
