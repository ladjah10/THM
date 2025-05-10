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
  genderProfile?: UserProfile | null;
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
      cc: 'lawrence@lawrenceadjah.com', // Add required CC field
      subject: `${data.name}'s 100 Marriage Assessment Results`,
      data: {
        name: data.name,
        scores: data.scores,
        profile: data.profile,
        genderProfile: data.genderProfile,
        responses: data.responses,
        demographics: data.demographics
      }
    });
    
    if (!response.ok) {
      // Try to extract detailed error information if available
      let errorMessage = 'Failed to send email report';
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (jsonError) {
        console.warn('Could not parse error response JSON');
      }
      
      throw new Error(errorMessage);
    }
    
    return;
  } catch (error) {
    console.error('Error sending email report:', error);
    // If the error has response data, log it for better debugging
    if (error instanceof Error && 'response' in error) {
      const responseData = (error as any).response?.data;
      if (responseData) {
        console.error('Error response data:', responseData);
      }
    }
    throw error;
  }
}
