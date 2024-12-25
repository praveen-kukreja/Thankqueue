// // app/api/claimPoints/route.ts
import { NextResponse } from 'next/server';
import {query} from '@/lib/db';

export async function POST(request: Request) {
//   const { userId, pointsToClaim } = await request.json();

//   // Calculate the user’s claims for the current month
//   const monthlyClaims = await query(
//     `SELECT SUM(points) FROM claims WHERE userId = $1 AND date_part('month', createdAt) = date_part('month', CURRENT_DATE)`,
//     [userId]
//   );

//   const monthlyLimit = 1000; // Example: monthly limit of 1000 points
//   monthlyClaims = parseInt(monthlyClaims, 10);
//   if (monthlyClaims >= monthlyLimit) {
//     return NextResponse.json({ error: 'Monthly claim limit reached.' }, { status: 400 });
//   }
    const { username, thankyou_id, createdat, status, updatedat } = await request.json();

  try {
    await query(
      'INSERT INTO claims (username, thankyou_id, createdat, status, updatedat) VALUES ($1, $2, $3, $4, $5)',
      [username, thankyou_id, createdat, status, updatedat]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error inserting claim:", error);
    return NextResponse.json({ success: false, message: "Failed to insert claim." }, { status: 500 });
  }
}
