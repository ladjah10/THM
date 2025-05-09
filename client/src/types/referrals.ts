export interface ReferralData {
  id: string;
  referrerId: string;
  referrerName: string;
  referrerEmail: string;
  invitedName: string;
  invitedEmail: string;
  timestamp: string;
  status: 'sent' | 'completed' | 'expired';
  promoCode?: string;
  completedTimestamp?: string;
}