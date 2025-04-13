import { apiRequest } from '@/lib/queryClient';
import { 
  AssessmentScores, 
  UserResponse, 
  DemographicData,
  UserProfile 
} from '@/types/assessment';

interface EmailReportData {
  to: string;
  name: string;
  scores: AssessmentScores;
  profile: UserProfile;
  responses: Record<number, UserResponse>;
  demographics: DemographicData;
}

/**
 * Send assessment report email to user and admin
 */
export async function sendEmailReport(data: EmailReportData): Promise<void> {
  try {
    const response = await apiRequest('POST', '/api/email/send', {
      to: data.to,
      cc: 'la@lawrenceadjah.com',
      subject: `${data.name}'s 100 Marriage Assessment Results`,
      data: {
        name: data.name,
        scores: data.scores,
        profile: data.profile,
        responses: data.responses,
        demographics: data.demographics
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to send email report');
    }
    
    return;
  } catch (error) {
    console.error('Error sending email report:', error);
    throw error;
  }
}
