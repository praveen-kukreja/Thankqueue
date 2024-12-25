import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  const { username, points } = await request.json();
  
  try {
    await query('UPDATE points SET points = points + $1 WHERE username = $2', [points, username]); // Mock user ID 1
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false });
  }
}

export async function updatePointsForUser(username: string, pointsToAdd: number) {
    
  await query(`INSERT INTO points (username, points, updatedat)
    VALUES ($1, $2, NOW() AT TIME ZONE 'UTC')
    ON CONFLICT (username) 
    DO UPDATE SET points = points.points + $2, updatedat = NOW() AT TIME ZONE 'UTC'
  `, [username, pointsToAdd]);
}
