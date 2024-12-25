import { NextResponse } from 'next/server';
import { updatePointsForUser } from '@/api/update-points/route';
import { getUserData } from '@/api/userdata/route';
import { validateDesignation } from '@/lib/validators/approve-request';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  // helpId: id, pointsToClaim: amount, helpreceiver: helpreceiver, helpsender: helpsender
  const { helpId, pointsToClaim, helpreceiver, helpsender } = await request.json();

  const res = await getUserData(helpsender)
  const data = await res.json();

  const receiverdetails = await getUserData(helpreceiver)
  const receiverdata = await receiverdetails.json();
  
    // Calculate the number of claims approved for the current month
    const { rows } = await query(
      `SELECT COUNT(*) as claimcount FROM claims 
       WHERE username = $1 
       AND date_part('month', createdat) = date_part('month', CURRENT_DATE)
       AND status = 'APPROVED'`, 
      [data.username]
    );

    const monthlyLimit = 7; // Example: monthly limit of 7 claims
    const claimCount = parseInt(rows[0].claimcount, 10);

    if (claimCount >= monthlyLimit) {
      return NextResponse.json({ message: 'Monthly claim limit reached.' }, { status: 400 });
    }

    const validationResult = await validateDesignation(receiverdata.designation_id, data.designation_id)

    if (!validationResult.isValid) {
      return NextResponse.json({ message: validationResult.reason }, { status: 400 });
    }
  
    async function updateThankYouStatus(helpId: string) {
      try {
        await query(
          `UPDATE thankyous 
           SET status = 'APPROVED' 
           WHERE thankyou_id = $1`,
          [helpId]
        );
      } catch (error) {
        console.error('Error updating thankyous table:', error);
        throw new Error('Failed to update thankyou status.');
      }
    }
    
  try {
    await updateThankYouStatus(helpId);

    // Update points for Person A (helper)
    await updatePointsForUser(data.username, pointsToClaim);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return NextResponse.json({ success: false, error: error.message });
    } else {
      console.error('An unknown error occurred');
      return NextResponse.json({ success: false, error: 'An unknown error occurred' });
    }
  }
}
