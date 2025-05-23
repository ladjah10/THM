import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Download, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DatePicker } from "@/components/ui/date-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import type { AssessmentResult } from "@/types/assessment";

export default function AdminAssessmentResults() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [assessments, setAssessments] = useState<AssessmentResult[]>([]);
  const [dateRange, setDateRange] = useState({
    startDate: undefined as string | undefined,
    endDate: undefined as string | undefined,
    requirePayment: false,
    completedOnly: true
  });

  // Fetch assessments
  const { 
    data: fetchedAssessments, 
    isLoading: isLoadingAssessments, 
    refetch: refetchAssessments 
  } = useQuery({
    queryKey: ['/api/admin/assessments', dateRange],
    queryFn: async () => {
      // Build query string
      const queryParams = new URLSearchParams();
      if (dateRange.startDate) queryParams.append('startDate', dateRange.startDate);
      if (dateRange.endDate) queryParams.append('endDate', dateRange.endDate);
      if (dateRange.requirePayment) queryParams.append('requirePayment', 'true');
      
      const response = await apiRequest(
        'GET', 
        `/api/admin/assessments?${queryParams.toString()}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch assessments');
      }
      
      return await response.json();
    },
    retry: 1,
  });

  // Update local state when data is fetched
  useEffect(() => {
    if (fetchedAssessments) {
      // Apply completed only filter if needed
      const filtered = dateRange.completedOnly 
        ? fetchedAssessments.filter((a: AssessmentResult) => a.completed === true)
        : fetchedAssessments;
        
      setAssessments(filtered || []);
    }
  }, [fetchedAssessments, dateRange.completedOnly]);

  // Resend assessment results
  const { mutate: resendAssessmentResults } = useMutation({
    mutationFn: async ({ email, assessmentType }: { email: string, assessmentType: 'individual' | 'couple' }) => {
      const response = await apiRequest(
        'POST',
        '/api/admin/resend-assessment-results',
        { email, assessmentType }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to resend assessment results');
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data.message || "Assessment results resent successfully",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to resend assessment results",
        variant: "destructive",
      });
    }
  });

  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    
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

  // Handle downloading full assessment data as JSON
  const handleDownloadAssessmentData = async (email: string, isCoupleAssessment: boolean = false) => {
    try {
      // Show loading toast
      toast({
        title: "Downloading...",
        description: `Downloading assessment data for ${email}`,
      });
      
      const endpoint = isCoupleAssessment 
        ? `/api/admin/download-couple-assessment/${encodeURIComponent(email)}`
        : `/api/admin/download-assessment/${encodeURIComponent(email)}`;
      
      // Create authentication header with admin credentials
      const adminUsername = 'admin';
      const adminPassword = '100marriage';
      // Browser-safe base64 encoding
      const adminAuth = btoa(`${adminUsername}:${adminPassword}`);
      
      // Fetch data with auth header
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Auth": adminAuth
        },
        credentials: "include"
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Download failed with status: ${response.status}`);
      }
      
      // Parse the response data
      const data = await response.json();
      
      // Convert to a pretty-printed JSON string
      const jsonString = JSON.stringify(data, null, 2);
      
      // Create a Blob with the data
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create a link and trigger a download
      const a = document.createElement('a');
      a.href = url;
      a.download = `assessment-data-${email}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      // Show success toast
      toast({
        title: "Download Complete",
        description: `Assessment data for ${email} downloaded successfully.`,
        variant: "default"
      });
    } catch (error) {
      console.error("Error downloading assessment data:", error);
      
      // Show error toast
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Failed to download assessment data",
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
            View detailed assessment results and demographic data
          </p>
        </div>
        
        <Button asChild variant="outline">
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin Dashboard
          </Link>
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Assessment Filters</CardTitle>
          <CardDescription>
            Filter assessment results by date and payment status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="startDate" className="block mb-2">Start Date</Label>
              <DatePicker
                id="startDate"
                date={dateRange.startDate ? new Date(dateRange.startDate) : undefined}
                onSelect={(date) => 
                  setDateRange({
                    ...dateRange,
                    startDate: date ? date.toISOString().split('T')[0] : undefined,
                  })
                }
              />
            </div>
            
            <div>
              <Label htmlFor="endDate" className="block mb-2">End Date</Label>
              <DatePicker
                id="endDate"
                date={dateRange.endDate ? new Date(dateRange.endDate) : undefined}
                onSelect={(date) => 
                  setDateRange({
                    ...dateRange,
                    endDate: date ? date.toISOString().split('T')[0] : undefined,
                  })
                }
              />
            </div>
            
            <div className="flex flex-col justify-end">
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox 
                  id="requirePayment"
                  checked={dateRange.requirePayment}
                  onCheckedChange={(checked) => setDateRange({
                    ...dateRange,
                    requirePayment: checked === true
                  })}
                />
                <Label htmlFor="requirePayment">Paid assessments only</Label>
              </div>
              
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox 
                  id="completedOnly"
                  checked={dateRange.completedOnly}
                  onCheckedChange={(checked) => setDateRange({
                    ...dateRange,
                    completedOnly: checked === true
                  })}
                />
                <Label htmlFor="completedOnly">Completed assessments only</Label>
              </div>
              
              <Button 
                variant="default" 
                onClick={() => refetchAssessments()}
                className="mt-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Assessment Results</CardTitle>
          <CardDescription>
            {assessments.length} assessments found from {dateRange.startDate || "all time"} 
            {dateRange.endDate ? ` to ${dateRange.endDate}` : ""} 
            {dateRange.requirePayment ? " (paid only)" : ""}
            {dateRange.completedOnly ? " (completed only)" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingAssessments ? (
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
                  {assessments && assessments.length > 0 ? (
                    assessments.map((assessment) => (
                      <TableRow key={assessment.id}>
                        <TableCell className="font-medium">
                          {assessment.demographics?.name || assessment.name || "N/A"}
                        </TableCell>
                        <TableCell className="max-w-[180px] truncate">{assessment.email}</TableCell>
                        <TableCell>{formatDate(assessment.timestamp)}</TableCell>
                        <TableCell>
                          {assessment.demographics?.gender || "Unknown"}, {assessment.demographics?.marriageStatus || "Unknown"}
                        </TableCell>
                        <TableCell>
                          {assessment.scores?.overallPercentage?.toFixed(1) || "N/A"}%
                        </TableCell>
                        <TableCell>
                          {assessment.profile?.name || "N/A"}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                resendAssessmentResults({
                                  email: assessment.email,
                                  assessmentType: 'individual'
                                });
                              }}
                              title="Resend results to this email"
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDownloadAssessmentData(assessment.email)}
                              title="Download full assessment data"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No assessment results found in this date range.
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