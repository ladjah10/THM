import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { CoupleAssessmentReport } from '@shared/schema';
import { CoupleReport } from '@/components/couple/CoupleAssessmentReport';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Home, FileText, ArrowLeft } from 'lucide-react';

export default function CoupleAssessmentReportPage() {
  const { coupleId } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<CoupleAssessmentReport | null>(null);
  
  // Fetch the couple assessment report
  useEffect(() => {
    if (!coupleId) {
      setError('Invalid report ID');
      setLoading(false);
      return;
    }
    
    const fetchReport = async () => {
      try {
        const response = await apiRequest('GET', `/api/couple-assessment/${coupleId}`);
        const data = await response.json();
        
        if (response.ok && data.success && data.coupleReport) {
          setReport(data.coupleReport);
        } else {
          setError(data.message || 'Failed to load couple assessment report');
        }
      } catch (error) {
        console.error('Error fetching couple assessment report:', error);
        setError('Failed to load report. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReport();
  }, [coupleId]);
  
  // Print report
  const handlePrintReport = () => {
    window.print();
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => setLocation('/')}>
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
          <h1 className="text-2xl font-bold">Loading Report...</h1>
        </div>
        <div className="space-y-8">
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-60 w-full rounded-lg" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={() => setLocation('/')}>
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
        </div>
        <Card className="border-red-200">
          <CardHeader className="bg-red-50">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <CardTitle>Error Loading Report</CardTitle>
            </div>
            <CardDescription>
              There was a problem loading the couple assessment report
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            
            <div className="mt-6 text-center">
              <Button onClick={() => setLocation('/')}>
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Render report
  if (!report) {
    return null;
  }
  
  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 print:px-0 print:py-0 print:max-w-none">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 print:hidden">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setLocation('/')}>
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <div>
          <Button variant="outline" onClick={handlePrintReport}>
            <FileText className="h-4 w-4 mr-2" />
            Print Report
          </Button>
        </div>
      </div>
      
      {/* Report header for print version */}
      <div className="hidden print:block mb-8">
        <h1 className="text-3xl font-bold text-center text-blue-900">The 100 Marriage Couple Assessment</h1>
        <p className="text-center text-gray-600 text-lg mt-2">
          {report.primaryAssessment.demographics.firstName} & {report.spouseAssessment.demographics.firstName}'s Compatibility Report
        </p>
        <p className="text-center text-gray-500 text-sm mt-1">
          Generated on {new Date(report.timestamp).toLocaleDateString()}
        </p>
      </div>
      
      {/* Main report */}
      <CoupleReport report={report} />
      
      {/* Footer for print version */}
      <div className="hidden print:block mt-8 pt-4 border-t border-gray-200">
        <p className="text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Lawrence E. Adjah - The 100 Marriage Assessment - Series 1
        </p>
        <p className="text-center text-gray-500 text-sm mt-1">
          For consultation: <a href="https://lawrence-adjah.clientsecure.me/request/service">lawrence-adjah.clientsecure.me</a>
        </p>
      </div>
    </div>
  );
}