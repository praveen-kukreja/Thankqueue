import { query } from '@/lib/db';

export interface ValidationResponse {
  isValid: boolean;
  reason?: string;
}

export async function validateDesignation(receiverdesignation: number, senderdesignation: number): Promise<ValidationResponse> {
  // try {
  //   const result = await query(
  //     `SELECT designation FROM designation WHERE grade = $1 OR grade = $2`,
  //     [helpsender, helpreceiver]
  //   );

  //   const designations = result.rows.map(row => row.designation);

    // if (designations.length < 2 || designations[0] !== designations[1]) {
    if (receiverdesignation != senderdesignation) {
      return {
        isValid: false,
        reason: 'Cross designation requires approval from DM, please send for review'
      };
    }

    return { isValid: true };
  // } catch (error) {
  //   console.error('Error validating designations:', error);
  //   return {
  //     isValid: false,
  //     reason: 'Failed to validate designations'
  //   };
  // }
}