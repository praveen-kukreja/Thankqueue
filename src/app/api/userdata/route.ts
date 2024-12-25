import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {

  const url = new URL(request.url);
  const emp_name = url.searchParams.get('employee');

  try {
    const result = await query('SELECT username, employee_name, designation_id FROM public.employee WHERE employee_name = $1', [emp_name]);
    return NextResponse.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false });
  }
}

export async function getUserData(employee_name: string) {
    
  const result = await query('SELECT username, employee_name, designation_id FROM public.employee WHERE employee_name = $1', [employee_name]);
  return NextResponse.json(result.rows[0]);
}
