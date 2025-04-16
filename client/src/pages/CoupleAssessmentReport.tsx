import React from 'react';
import { useLocation, useRoute, useRouter } from 'wouter';
import { CoupleAssessmentView } from '../components/couple/CoupleAssessmentView';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ArrowLeft } from 'lucide-react';

export default function CoupleAssessmentReportPage() {
  const [, params] = useRoute('/couple-assessment/:coupleId');
  const [location, setLocation] = useLocation();
  
  const coupleId = params?.coupleId;
  
  // Function to navigate back to home
  const handleBackToHome = () => {
    setLocation('/');
  };
  
  // If no coupleId was provided, show error UI
  if (!coupleId) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-3xl mx-auto border-red-200">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-800 flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Missing Couple Assessment ID
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-700 mb-4">
              No couple assessment ID was provided. This is required to load your assessment results.
            </p>
            <p className="text-gray-700 mb-6">
              Please make sure you're using the correct link that was provided in your invitation email.
            </p>
            <Button onClick={handleBackToHome}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // We have a coupleId, so render the assessment view
  return (
    <div className="container mx-auto px-4 py-12">
      <CoupleAssessmentView 
        coupleId={coupleId} 
        onBack={handleBackToHome}
      />
    </div>
  );
}