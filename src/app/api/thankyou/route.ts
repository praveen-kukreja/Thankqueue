// app/api/thankYou/route.ts
import { NextResponse } from 'next/server';
import { ThankYouValidator } from '@/lib/validators/thank-request';
import {query} from '@/lib/db';

export async function POST(request: Request) {
  const { session, thankYouData } = await request.json();
  const receiverId = session.user.name
  const senderId = thankYouData.helper

  // Fetch the latest thank you timestamp between the users
  const recentThankYouResult = await query(
    `SELECT * FROM thankYous 
      WHERE (sender = $1 AND receiver = $2) 
          OR (sender = $2 AND receiver = $1) 
      ORDER BY timestamp DESC`,
  [senderId, receiverId]
  );

  const recentThankYou = recentThankYouResult.rows;

  const validationResult = await ThankYouValidator.validateThankFilingRequest(
    senderId,
    receiverId,
    thankYouData.description,
    recentThankYou
  );


  if (!validationResult.isValid) {
    return NextResponse.json({ message: validationResult.reason }, { status: 400 });
  }

  // // Define a cooldown period in milliseconds (e.g., 24 hours)
  // const cooldownPeriod = 24 * 60 * 60 * 1000;
  // if (recentThankYou && Date.now() - new Date(recentThankYou.createdAt).getTime() < cooldownPeriod) {
  //   return NextResponse.json({ error: 'You cannot thank this user again so soon.' }, { status: 400 });
  // }

  // Allow the thank you if cooldown period has passed
  const AMOUNT = 10
  const currentTimestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  await query('INSERT INTO thankYous (sender, receiver, timestamp, description, status, amount) VALUES ($1, $2, $3, $4, $5, $6)', [senderId, receiverId, currentTimestamp, thankYouData.description, 'PENDING', AMOUNT]);

  return NextResponse.json({ success: true });
}
