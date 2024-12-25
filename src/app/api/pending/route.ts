import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {

  const url = new URL(request.url);
  const user = url.searchParams.get('user');
//   const url = new URL(request.url);
//   const page = parseInt(url.searchParams.get('page') || '1', 10);
//   const limit = 10; // Number of requests per page
//   const offset = (page - 1) * limit;

//   try {
//     const result = await query(
//       'SELECT * FROM thankYous WHERE status = $1 ORDER BY createdAt DESC LIMIT $2 OFFSET $3',
//       ['PENDING', limit, offset]
//     ); // no need of pagination for now
try {
    const result = await query('SELECT * FROM thankYous WHERE status = $1 AND sender = $2', ['PENDING', user]);

    return NextResponse.json({ requests: result.rows });
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    return NextResponse.json({ error: 'Failed to fetch pending requests' }, { status: 500 });
  }
}