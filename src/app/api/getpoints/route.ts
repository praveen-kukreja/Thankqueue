import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {

  const url = new URL(request.url);
  const username = url.searchParams.get('username');

  
  try {
    const res = await query('SELECT points FROM public.points WHERE username = $1', [username]); // Mock user ID 1
    return NextResponse.json(res.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false });
  }
}