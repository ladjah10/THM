import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Download, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "wouter";

// Define simplified assessment result interface
interface SimpleAssessment {
  id: string;
  email: string;
  name: string;
  gender?: string;
  marriageStatus?: string;
  score?: number;
  profile?: string;
  timestamp: string;
  completed?: boolean;
}

export default function SimpleAssessmentResults() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [assessments, setAssessments] = useState<SimpleAssessment[]>([]);
  
  useEffect(() => {
    fetchAssessments();
  }, []);
  
  async function fetchAssessments() {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/assessments?requirePayment=true');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Map the data to our simple format and filter for completed assessments
      const processedData = data
        .filter((assessment: any) => assessment.completed === true)
        .map((assessment: any) => ({
          id: assessment.id || `temp-${Math.random().toString(36).substring(2, 9)}`,
          email: assessment.email || 'unknown@example.com',
          name: assessment.demographics?.name || assessment.name || 'Unknown',
          gender: assessment.demographics?.gender || 'Unknown',
          marriageStatus: assessment.demographics?.marriageStatus || 'Unknown',
          score: assessment.scores?.overallPercentage || 0,
          profile: assessment.profile?.name || 'Unknown',
          timestamp: assessment.timestamp || new Date().toISOString(),
          completed: assessment.completed || false
        }));
      
      // Set the assessments data
      setAssessments(processedData);
      
      toast({
        title: "Assessments Loaded",
        description: `Successfully loaded ${processedData.length} assessments`,
        variant: "default"
      });
    } catch (error) {
      console.error("Error loading assessments:", error);
      
      toast({
        title: "Error Loading Assessments",
        description: "There was a problem loading the assessment results",
        variant: "destructive"
      });
      
      // Set empty assessments array
      setAssessments([]);
    } finally {
      setIsLoading(false);
    }
  }
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString || "N/A";
    }
  };
  
  // Handle resending assessment results
  const handleResendResults = async (email: string) => {
    try {
      toast({
        title: "Sending...",
        description: `Resending assessment results to ${email}`,
      });
      
      const response = await fetch('/api/admin/resend-assessment-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          assessmentType: 'individual'
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to resend: ${response.status}`);
      }
      
      toast({
        title: "Email Sent",
        description: `Assessment results successfully resent to ${email}`,
        variant: "default"
      });
    } catch (error) {
      console.error("Error resending assessment:", error);
      
      toast({
        title: "Error Sending Email",
        description: "Failed to resend assessment results",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Assessment Results</h1>
          <p className="text-sm text-gray-500">
            View completed assessment results and demographic data
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button asChild variant="outline">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin Dashboard
            </Link>
          </Button>
          
          <Button 
            variant="default" 
            onClick={fetchAssessments} 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                Loading...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Results
              </>
            )}
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Assessment Results</CardTitle>
          <CardDescription>
            {assessments.length} completed assessments found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium">Name</TableHead>
                    <TableHead className="font-medium">Email</TableHead>
                    <TableHead className="font-medium">Date</TableHead>
                    <TableHead className="font-medium">Demographics</TableHead>
                    <TableHead className="font-medium">Score</TableHead>
                    <TableHead className="font-medium">Profile</TableHead>
                    <TableHead className="font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessments.length > 0 ? (
                    assessments.map((assessment) => (
                      <TableRow key={assessment.id}>
                        <TableCell className="font-medium">
                          {assessment.name || "N/A"}
                        </TableCell>
                        <TableCell className="max-w-[180px] truncate">{assessment.email}</TableCell>
                        <TableCell>{formatDate(assessment.timestamp)}</TableCell>
                        <TableCell>
                          {assessment.gender || "Unknown"}, {assessment.marriageStatus || "Unknown"}
                        </TableCell>
                        <TableCell>
                          {typeof assessment.score === 'number' ? `${assessment.score.toFixed(1)}%` : "N/A"}
                        </TableCell>
                        <TableCell>
                          {assessment.profile || "N/A"}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleResendResults(assessment.email)}
                              title="Resend results to this email"
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No assessment results found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}