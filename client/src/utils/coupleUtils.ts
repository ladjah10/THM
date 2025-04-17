import { apiRequest } from '@/lib/queryClient';

/**
 * Registers a couple assessment early in the process, before either partner completes their assessment
 * @param primaryEmail Email of the primary partner who initiated the assessment
 * @param spouseEmail Email of the spouse who was invited
 * @returns The generated coupleId that will link both assessments
 */
export async function registerEarlyCoupleAssessment(
  primaryEmail: string,
  spouseEmail: string
): Promise<{ coupleId: string }> {
  try {
    const response = await apiRequest('POST', '/api/couple-assessment/register-early', {
      primaryEmail,
      spouseEmail
    });
    
    if (!response.ok) {
      throw new Error('Failed to register couple assessment');
    }
    
    const data = await response.json();
    return { coupleId: data.coupleId };
  } catch (error) {
    console.error('Error registering early couple assessment:', error);
    throw error;
  }
}

/**
 * Sends invitation emails to both partners for a couple assessment
 * @param coupleId The unique identifier linking both partner's assessments
 * @param primaryEmail Email of the primary partner who initiated the assessment
 * @param spouseEmail Email of the spouse who was invited
 * @returns Success status and any additional information
 */
export async function sendCoupleInvitations(
  coupleId: string,
  primaryEmail: string,
  spouseEmail: string
): Promise<{ success: boolean }> {
  try {
    const response = await apiRequest('POST', '/api/couple-assessment/send-invitations', {
      coupleId,
      primaryEmail,
      spouseEmail
    });
    
    if (!response.ok) {
      throw new Error('Failed to send couple invitations');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error sending couple invitations:', error);
    return { success: false };
  }
}