import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {

  try {
    const result = await query('SELECT employee_name, employee_id, username FROM public.employee WHERE status is true');
    return NextResponse.json(result.rows);

  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false });
  }
}