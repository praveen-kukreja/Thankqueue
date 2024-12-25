export interface ThankYou {
  sender: string;
  receiver: string;
  timestamp: Date;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  description: string;
}

export interface ValidationResponse {
  isValid: boolean;
  reason?: string;
}

// lib/validators/thank-you.ts
export class ThankYouValidator {
  // Configuration
  private static readonly HARVESTING_COOLDOWN_HOURS = 24;
  private static readonly MIN_DESCRIPTION_LENGTH = 20;

  /**
   * Validates if a user can file a new thank you request
   * Prevents thank-harvesting by checking recent interactions
   */
  static async validateThankFilingRequest(
    sender: string,
    receiver: string,
    description: string,
    previousThankYous: ThankYou[]
  ): Promise<ValidationResponse> {
    // Basic validation
    if (sender === receiver) {
      return {
        isValid: false,
        reason: "You cannot thank yourself"
      };
    }

    if (description.length < this.MIN_DESCRIPTION_LENGTH) {
      return {
        isValid: false,
        reason: `Description must be at least ${this.MIN_DESCRIPTION_LENGTH} characters`
      };
    }

    // Check for thank-harvesting by finding the most recent thank you between these users
    const relevantThankYous = previousThankYous.filter(thank =>
      (thank.sender === sender && thank.receiver === receiver) ||
      (thank.sender === receiver && thank.receiver === sender)
    );

    if (relevantThankYous.length > 0) {
      // Find the most recent thank you
      const mostRecentThankYou = relevantThankYous.reduce((latest, current) => {
        const latestDate = new Date(latest.timestamp);
        const currentDate = new Date(current.timestamp);
        return currentDate > latestDate ? current : latest;
      });
      
      // Calculate the time difference
      const currentTime = new Date();
      const lastThankYouTime = new Date(mostRecentThankYou.timestamp);

      //offset handle
      lastThankYouTime.setHours(lastThankYouTime.getHours() + 5);
      lastThankYouTime.setMinutes(lastThankYouTime.getMinutes() + 30);

      const hoursSinceLastThankYou = (currentTime.getTime() - lastThankYouTime.getTime()) / (1000 * 60 * 60);


      if (hoursSinceLastThankYou < this.HARVESTING_COOLDOWN_HOURS) {
        const hoursRemaining = Math.ceil(this.HARVESTING_COOLDOWN_HOURS - hoursSinceLastThankYou);
        return {
          isValid: false,
          reason: `Please wait ${hoursRemaining} more hour${hoursRemaining === 1 ? '' : 's'} before sending another thank you to this person`
        };
      }
    }

    return { isValid: true };
  }
}