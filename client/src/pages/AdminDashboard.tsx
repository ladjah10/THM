import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { RefreshCw, FileDown, Search, Loader2, Mail, Info, Download, AlertCircle, Users, DollarSign, Activity, TrendingUp, FileText, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { AssessmentScores, UserProfile, DemographicData, AssessmentResult, SectionScore } from "@/types/assessment";
import type { AnalyticsSummary, PageView, VisitorSession } from "@shared/schema";
import type { ReferralData } from "@/types/referrals";

// Define PaymentTransaction interface
interface PaymentTransaction {
  id: string;
  stripeId: string;
  customerEmail?: string;
  amount: number;
  currency: string;
  status: string;
  created: string;
  productType: string;
  assessmentType?: string;
  productName?: string;
  metadata: string | Record<string, any>;
  isRefunded: boolean;
  refundAmount?: number;
  refundReason?: string;
  promoCode?: string;
  customerId?: string;
}

// Define enhanced transaction type with assessment data
interface EnhancedTransaction extends PaymentTransaction {
  assessmentData?: {
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    marriageStatus: string;
    desireChildren: string;
    ethnicity: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

// Define type for customer recovery data
interface CustomerRecoveryData {
  payment_id: string;
  payment_date: string;
  amount: number;
  currency: string;
  description: string;
  email: string;
  name: string;
  phone: string;
  address?: any;
  metadata: any;
  product_type: string;
}

// Simple admin authentication
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "100marriage";

// Calculate age from birthday string (YYYY-MM-DD format)
function calculateAge(birthday: string): number {
  if (!birthday) return 0;
  
  try {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  } catch (e) {
    return 0;
  }
}

// Calculate match compatibility score (higher is better)
function calculateMatchScore(candidate: AssessmentResult): number {
  const scoreWeight = 0.5;
  const ageWeight = 0.3;
  const profileWeight = 0.2;
  
  // Base score from assessment percentage
  const baseScore = candidate.scores?.overallPercentage || 0;
  
  // Age factor (prefer ages 25-35)
  const age = calculateAge(candidate.demographics?.birthday || '');
  const ageFactor = age >= 25 && age <= 35 ? 1.0 : age >= 22 && age <= 40 ? 0.8 : 0.6;
  
  // Profile compatibility (simplified)
  const profileFactor = candidate.profile?.name ? 1.0 : 0.8;
  
  return (baseScore * scoreWeight) + (ageFactor * ageWeight * 100) + (profileFactor * profileWeight * 100);
}



// Recovery Section Component
function RecoverySection() {
  const [recoveryData, setRecoveryData] = useState<CustomerRecoveryData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRecoveryImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/admin/import-recovery-data', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to import recovery data');
      }

      const data = await response.json();
      setRecoveryData(data);
      
      toast({
        title: "Recovery data imported",
        description: `Successfully imported ${data.length} customer records`,
      });
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Failed to import recovery data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Customer Recovery Data
        </CardTitle>
        <CardDescription>
          Import and process customer data for account recovery
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="recovery-file">Upload Recovery Data (CSV/JSON)</Label>
          <Input
            id="recovery-file"
            type="file"
            accept=".csv,.json"
            onChange={handleRecoveryImport}
            disabled={isLoading}
          />
        </div>
        
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing recovery data...
          </div>
        )}
        
        {recoveryData.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Imported {recoveryData.length} customer records
            </p>
            <div className="max-h-48 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recoveryData.slice(0, 10).map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-xs">{record.email}</TableCell>
                      <TableCell>{record.name}</TableCell>
                      <TableCell>${record.amount}</TableCell>
                      <TableCell>{new Date(record.payment_date).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('admin_authenticated') === 'true';
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentResult | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [filterGender, setFilterGender] = useState<string>("all");
  const [filterMarriageStatus, setFilterMarriageStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [simulationLoading, setSimulationLoading] = useState(false);
  const { toast } = useToast();

  // Add simulation function to test scoring algorithm with PDF generation
  const runSimulatedAssessment = async (gender: "male" | "female") => {
    try {
      setSimulationLoading(true);
      const res = await fetch(`/api/simulate?gender=${gender}`);
      const data = await res.json();
      
      if (data.testInfo?.emailSent) {
        toast({
          title: "Simulation Complete",
          description: `✅ ${data.message}\nScore: ${data.scores?.overallPercentage?.toFixed(2)}%\nProfile: ${data.profile?.name || 'Not determined'}\nPDF sent to: ${data.testInfo.recipient}`,
        });
      } else {
        toast({
          title: "Simulation Complete",
          description: `⚠️ ${data.message}\nScore: ${data.scores?.overallPercentage?.toFixed(2)}%\nProfile: ${data.profile?.name || 'Not determined'}`,
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Simulation failed", err);
      toast({
        title: "Simulation Failed",
        description: "❌ Simulation failed. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setSimulationLoading(false);
    }
  };

  // Fetch assessments data
  const { 
    data: assessments, 
    isLoading: assessmentsLoading, 
    error: assessmentsError,
    refetch: refetchAssessments 
  } = useQuery({
    queryKey: ["/api/admin/assessments"],
    enabled: isAuthenticated,
  });

  // Fetch analytics data
  const { 
    data: analytics, 
    isLoading: analyticsLoading,
    refetch: refetchAnalytics 
  } = useQuery({
    queryKey: ["/api/admin/analytics"],
    enabled: isAuthenticated,
  });

  // Fetch section averages data
  const { 
    data: sectionAverages, 
    isLoading: sectionAveragesLoading,
    refetch: refetchSectionAverages 
  } = useQuery({
    queryKey: ["/api/admin/analytics/section-averages"],
    enabled: isAuthenticated,
  });

  // Fetch payment transactions
  const { 
    data: paymentTransactions, 
    isLoading: transactionsLoading,
    refetch: refetchTransactions 
  } = useQuery({
    queryKey: ["/api/admin/payment-transactions"],
    enabled: isAuthenticated,
  });

  // Fetch pool candidates (arranged marriage pool participants)
  const { 
    data: poolCandidatesData, 
    isLoading: poolCandidatesLoading,
    error: poolCandidatesError,
    refetch: refetchPoolCandidates 
  } = useQuery({
    queryKey: ["/api/admin/pool-candidates"],
    enabled: isAuthenticated,
  });

  // Fetch referral data
  const { 
    data: referralData, 
    isLoading: referralsLoading,
    refetch: refetchReferrals 
  } = useQuery({
    queryKey: ["/api/admin/referrals"],
    enabled: isAuthenticated,
  });

  // Fetch partial assessments (in-progress)
  const { 
    data: partialAssessmentsData, 
    isLoading: partialAssessmentsLoading,
    refetch: refetchPartialAssessments 
  } = useQuery({
    queryKey: ["/api/admin/partial-assessments"],
    enabled: isAuthenticated,
  });

  // Mutation for sending assessment results
  const sendResultsMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest("POST", `/api/admin/resend-report/${email}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Report sent successfully",
        description: "The assessment report has been sent via email",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send report",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation for downloading assessment data
  const downloadDataMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("GET", "/api/admin/download-assessment-data");
      const blob = await response.blob();
      return blob;
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `assessment-data-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download completed",
        description: "Assessment data has been downloaded as CSV",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Download failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation for recalculating all assessments
  const recalculateMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/admin/recalculate-all");
      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate all assessment-related queries to force fresh data
      queryClient.invalidateQueries({ queryKey: ["/api/admin/assessments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics/section-averages"] });
      
      refetchAssessments();
      refetchAnalytics();
      refetchSectionAverages();
      
      toast({
        title: "Recalculation completed",
        description: `Successfully recalculated ${data.summary.successCount} assessments with updated scores and profiles`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Recalculation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation for regenerating all reports
  const regenerateReportsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/admin/regenerate-all-reports");
      return response.json();
    },
    onSuccess: (data) => {
      refetchAssessments();
      toast({
        title: "Report regeneration completed",
        description: `Successfully regenerated ${data.summary.successCount} reports with updated profiles and formatting`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Report regeneration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter assessments based on search and filters
  const filteredAssessments = useMemo(() => {
    if (!assessments || !Array.isArray(assessments)) return [];
    
    return assessments.filter((assessment: AssessmentResult) => {
      const matchesSearch = !searchTerm || 
        assessment.demographics?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.demographics?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.demographics?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGender = filterGender === "all" || 
        assessment.demographics?.gender?.toLowerCase() === filterGender.toLowerCase();
      
      const matchesMarriageStatus = filterMarriageStatus === "all" || 
        assessment.demographics?.marriageStatus?.toLowerCase() === filterMarriageStatus.toLowerCase();
      
      return matchesSearch && matchesGender && matchesMarriageStatus;
    });
  }, [assessments, searchTerm, filterGender, filterMarriageStatus]);

  // Paginated assessments
  const paginatedAssessments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAssessments.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAssessments, currentPage]);

  const totalPages = Math.ceil(filteredAssessments.length / itemsPerPage);

  // Calculate pool candidates from dedicated endpoint
  const poolCandidates = useMemo(() => {
    if (!poolCandidatesData || !poolCandidatesData.success || !Array.isArray(poolCandidatesData.data)) return [];
    
    return poolCandidatesData.data.map((assessment: AssessmentResult) => ({
      ...assessment,
      matchScore: assessment.matchScore || calculateMatchScore(assessment)
    }));
  }, [poolCandidatesData]);

  // Generate analytics summary
  const analyticsSummary = useMemo(() => {
    if (!assessments || !Array.isArray(assessments)) return null;

    const summary = {
      totalAssessments: assessments.length,
      totalRevenue: 0,
      averageScore: 0,
      completionRate: 0,
      genderDistribution: {} as Record<string, number>,
      ageDistribution: {} as Record<string, number>,
      marriageStatusDistribution: {} as Record<string, number>,
      profileDistribution: {} as Record<string, number>,
      monthlyTrends: [],
      topPerformers: [],
      recentActivity: []
    };

    // Calculate revenue from payment transactions
    if (paymentTransactions && Array.isArray(paymentTransactions)) {
      summary.totalRevenue = paymentTransactions.reduce((total: number, transaction: PaymentTransaction) => {
        return total + (transaction.amount / 100); // Convert from cents
      }, 0);
    }

    // Calculate average score
    const validScores = assessments.filter((a: AssessmentResult) => a.scores?.overallPercentage);
    if (validScores.length > 0) {
      summary.averageScore = validScores.reduce((sum: number, a: AssessmentResult) => 
        sum + (a.scores?.overallPercentage || 0), 0) / validScores.length;
    }

    // Gender distribution
    const genderCounts: Record<string, number> = {};
    assessments.forEach((assessment: AssessmentResult) => {
      const gender = assessment.demographics?.gender || 'Unknown';
      genderCounts[gender] = (genderCounts[gender] || 0) + 1;
    });
    summary.genderDistribution = genderCounts;

    // Marriage status distribution
    const marriageCounts: Record<string, number> = {};
    assessments.forEach((assessment: AssessmentResult) => {
      const status = assessment.demographics?.marriageStatus || 'Unknown';
      marriageCounts[status] = (marriageCounts[status] || 0) + 1;
    });
    summary.marriageStatusDistribution = marriageCounts;

    // Profile distribution
    const profileCounts: Record<string, number> = {};
    assessments.forEach((assessment: AssessmentResult) => {
      const profile = assessment.profile?.name || 'Unknown';
      profileCounts[profile] = (profileCounts[profile] || 0) + 1;
    });
    summary.profileDistribution = profileCounts;

    return summary;
  }, [assessments, analytics, paymentTransactions]);

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem('admin_authenticated', 'true');
      setIsAuthenticated(true);
      
      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard",
        variant: "default"
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive"
      });
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
      variant: "default"
    });
  };

  // Handle view details
  const handleViewDetails = (assessment: AssessmentResult) => {
    setSelectedAssessment(assessment);
    setDetailModalOpen(true);
  };

  // Handle resend assessment
  const handleResendAssessment = (email: string) => {
    sendResultsMutation.mutate(email);
  };

  // Handle download assessment data
  const handleDownloadAssessmentData = (assessment: AssessmentResult) => {
    const csvData = [
      ['Field', 'Value'],
      ['Email', assessment.demographics?.email || ''],
      ['Name', `${assessment.demographics?.firstName || ''} ${assessment.demographics?.lastName || ''}`],
      ['Gender', assessment.demographics?.gender || ''],
      ['Age', calculateAge(assessment.demographics?.birthday || '').toString()],
      ['Marriage Status', assessment.demographics?.marriageStatus || ''],
      ['Overall Score', `${assessment.scores?.overallPercentage || 0}%`],
      ['Profile', assessment.profile?.name || ''],
      ['Timestamp', assessment.timestamp || '']
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `assessment-${assessment.demographics?.email || 'unknown'}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
            <CardDescription>
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={async () => {
                    try {
                      console.log('Refresh button clicked - starting data refresh...');
                      
                      toast({
                        title: "Refreshing data...",
                        description: "Updating all dashboard information",
                      });

                      await Promise.all([
                        refetchAssessments(),
                        refetchAnalytics(),
                        refetchTransactions(),
                        refetchReferrals(),
                        refetchSectionAverages(),
                        refetchPoolCandidates(),
                        refetchPartialAssessments()
                      ]);

                      console.log('All data refreshed successfully');
                      
                      toast({
                        title: "Data refreshed",
                        description: "All dashboard information has been updated",
                      });
                    } catch (error) {
                      console.error('Error refreshing data:', error);
                      toast({
                        title: "Refresh failed",
                        description: "There was an error updating the data",
                        variant: "destructive",
                      });
                    }
                  }}
                  disabled={assessmentsLoading || analyticsLoading || sectionAveragesLoading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Critical Data Integrity Alert */}
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                Data Integrity Status - Authentic Questions Restored
              </CardTitle>
              <CardDescription className="text-red-700">
                Critical system update: All 99 authentic questions from Lawrence Adjah's book have been restored.
                Legacy assessments used corrupted/simplified questions and require user attention.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-green-600">99</div>
                  <div className="text-sm text-gray-600">Authentic Questions Restored</div>
                  <div className="text-xs text-gray-500">From Lawrence Adjah's book</div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-red-600">
                    {assessments?.filter((a: any) => !a.recalculated)?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Legacy Assessments</div>
                  <div className="text-xs text-gray-500">Used corrupted questions</div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-blue-600">
                    {assessments?.filter((a: any) => a.recalculated)?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Corrected Assessments</div>
                  <div className="text-xs text-gray-500">Recalculated with authentic questions</div>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">Action Required</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Legacy assessments show artificially low scores (3-10%)</li>
                  <li>• Users should retake assessments with authentic 99 questions</li>
                  <li>• New assessments automatically use authentic book content</li>
                  <li>• PDF reports now include data integrity status</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Testing Section */}
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800">Testing & Simulation</CardTitle>
              <CardDescription className="text-blue-700">
                Test the assessment system with simulated data and PDF generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => runSimulatedAssessment("male")}
                  disabled={simulationLoading}
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  {simulationLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <User className="h-4 w-4 mr-2" />
                  )}
                  Test Male Assessment
                </Button>
                <Button
                  variant="outline"
                  onClick={() => runSimulatedAssessment("female")}
                  disabled={simulationLoading}
                  className="border-pink-300 text-pink-700 hover:bg-pink-100"
                >
                  {simulationLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <User className="h-4 w-4 mr-2" />
                  )}
                  Test Female Assessment
                </Button>
              </div>
              <div className="text-sm text-blue-600 mt-2">
                Generates full assessment with PDF report and sends to la@lawrenceadjah.com
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          {analyticsSummary && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsSummary.totalAssessments}</div>
                  <p className="text-xs text-muted-foreground">
                    Active assessments in system
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${analyticsSummary.totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    From assessment payments
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsSummary.averageScore.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">
                    Across all assessments
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pool Candidates</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{poolCandidates.length}</div>
                  <p className="text-xs text-muted-foreground">
                    High-compatibility singles
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Simulation Testing Controls */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Algorithm Testing</h2>
            <div className="my-4 space-x-2">
              <Button variant="outline" onClick={() => runSimulatedAssessment("male")}>
                Simulate Male Assessment
              </Button>
              <Button variant="outline" onClick={() => runSimulatedAssessment("female")}>
                Simulate Female Assessment
              </Button>
            </div>
          </div>

          <Tabs defaultValue="assessments" className="space-y-6">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="assessments">Assessments</TabsTrigger>
              <TabsTrigger value="in-progress">In-Progress</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="pool">Marriage Pool</TabsTrigger>
              <TabsTrigger value="referrals">Referrals</TabsTrigger>
              <TabsTrigger value="recovery">Recovery</TabsTrigger>
            </TabsList>

            {/* Assessments Tab */}
            <TabsContent value="assessments" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Assessment Results</CardTitle>
                      <CardDescription>
                        Manage and view all assessment submissions
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => downloadDataMutation.mutate()}
                        disabled={downloadDataMutation.isPending}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Summary
                      </Button>
                      <Button 
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/api/admin/export-all-assessments-csv';
                          link.download = 'complete-assessment-data.csv';
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          
                          toast({
                            title: "Complete data export started",
                            description: "Downloading comprehensive assessment data with all original responses",
                          });
                        }}
                        variant="outline"
                      >
                        <FileDown className="h-4 w-4 mr-2" />
                        Export Complete Data
                      </Button>
                      
                      <Button 
                        onClick={() => recalculateMutation.mutate()}
                        disabled={recalculateMutation.isPending}
                        variant="default"
                        className="flex items-center gap-2"
                      >
                        {recalculateMutation.isPending ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4 mr-2" />
                        )}
                        Recalculate All
                      </Button>
                      
                      <Button 
                        onClick={() => regenerateReportsMutation.mutate()}
                        disabled={regenerateReportsMutation.isPending}
                        variant="secondary"
                        className="flex items-center gap-2"
                      >
                        {regenerateReportsMutation.isPending ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <FileText className="h-4 w-4 mr-2" />
                        )}
                        Regenerate All Reports
                      </Button>
                    </div>
                  </div>
                  
                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by email, name..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <Select value={filterGender} onValueChange={setFilterGender}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Genders</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterMarriageStatus} onValueChange={setFilterMarriageStatus}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  {assessmentsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : assessmentsError ? (
                    <div className="flex items-center justify-center py-8 text-red-500">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Failed to load assessments
                    </div>
                  ) : (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Profile</TableHead>
                            <TableHead>Data Integrity</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedAssessments.map((assessment: AssessmentResult, index: number) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">
                                {assessment.demographics?.firstName} {assessment.demographics?.lastName}
                              </TableCell>
                              <TableCell>{assessment.demographics?.email}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Badge variant={
                                    (assessment.scores?.overallPercentage || 0) >= 80 ? "default" :
                                    (assessment.scores?.overallPercentage || 0) >= 60 ? "secondary" : "destructive"
                                  }>
                                    {assessment.scores?.overallPercentage?.toFixed(1) || 0}%
                                  </Badge>
                                  {!assessment.recalculated && (
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        Low score due to corrupted questions
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>{assessment.profile?.name || "N/A"}</TableCell>
                              <TableCell>
                                <div className="flex flex-col gap-1">
                                  {assessment.recalculated ? (
                                    <Badge variant="default" className="bg-green-100 text-green-800 border-green-300">
                                      Authentic (99Q)
                                    </Badge>
                                  ) : (
                                    <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-300">
                                      Legacy (Corrupted)
                                    </Badge>
                                  )}
                                  <div className="text-xs text-gray-500">
                                    {assessment.recalculated ? 'Book questions' : 'Needs retake'}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{formatDate(assessment.timestamp)}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {assessment.recalculated || assessment.recalculationDate || assessment.reportRegeneratedAt ? (
                                    <>
                                      <span className="text-green-600">✅</span>
                                      {(assessment.recalculationDate || assessment.reportRegeneratedAt) && (
                                        <span className="text-xs text-muted-foreground">
                                          {formatDate(assessment.recalculationDate || assessment.reportRegeneratedAt)}
                                        </span>
                                      )}
                                    </>
                                  ) : (
                                    <span className="text-gray-400">—</span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleViewDetails(assessment)}
                                      >
                                        <Info className="h-3 w-3" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>View Details</TooltipContent>
                                  </Tooltip>
                                  
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleResendAssessment(assessment.demographics?.email || '')}
                                        disabled={sendResultsMutation.isPending}
                                      >
                                        <Mail className="h-3 w-3" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Resend Report</TooltipContent>
                                  </Tooltip>
                                  
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDownloadAssessmentData(assessment)}
                                      >
                                        <Download className="h-3 w-3" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Download Data</TooltipContent>
                                  </Tooltip>

                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => window.open(`/api/admin/responses/${encodeURIComponent(assessment.demographics?.email || '')}/json`)}
                                      >
                                        <FileText className="h-3 w-3" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Download JSON</TooltipContent>
                                  </Tooltip>

                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => window.open(`/api/admin/assessment/${encodeURIComponent(assessment.demographics?.email || '')}/download`, '_blank')}
                                      >
                                        <FileDown className="h-3 w-3" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Download PDF</TooltipContent>
                                  </Tooltip>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between space-x-2 py-4">
                          <div className="text-sm text-muted-foreground">
                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAssessments.length)} of {filteredAssessments.length} results
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                              disabled={currentPage === 1}
                            >
                              Previous
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                              disabled={currentPage === totalPages}
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* In-Progress Tab */}
            <TabsContent value="in-progress" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>In-Progress Assessments</CardTitle>
                      <CardDescription>
                        Users who started but haven't completed their assessments
                      </CardDescription>
                    </div>
                    <Badge variant="outline">
                      {partialAssessmentsData?.data?.length || 0} in progress
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {partialAssessmentsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : partialAssessmentsData?.data?.length > 0 ? (
                    <div className="space-y-4">
                      {partialAssessmentsData.data.map((partial: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium">
                              {partial.demographics?.firstName} {partial.demographics?.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {partial.email}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Started: {new Date(partial.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="text-sm font-medium">
                                {Object.keys(partial.responses || {}).length} / 99
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Questions
                              </div>
                            </div>
                            <div className="w-20">
                              <div className="text-xs text-muted-foreground mb-1">
                                {Math.round((Object.keys(partial.responses || {}).length / 99) * 100)}%
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full" 
                                  style={{ 
                                    width: `${Math.round((Object.keys(partial.responses || {}).length / 99) * 100)}%` 
                                  }}
                                />
                              </div>
                            </div>
                            <Badge variant={partial.assessmentType === 'couple' ? 'secondary' : 'default'}>
                              {partial.assessmentType || 'individual'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      No assessments in progress
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              {analyticsSummary && (
                <>
                  {/* Section Averages */}
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Section Performance Averages</CardTitle>
                      <CardDescription>Average scores across all assessment sections</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {sectionAveragesLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                      ) : sectionAverages ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {Object.entries(sectionAverages).map(([sectionName, data]: [string, any]) => (
                            <Card key={sectionName} className="p-4">
                              <div className="text-sm font-medium text-muted-foreground mb-1">
                                {sectionName}
                              </div>
                              <div className="text-2xl font-bold">
                                {data.average.toFixed(1)}%
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {data.count} assessments
                              </div>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground py-8">
                          No section data available
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Gender Distribution */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Gender Distribution</CardTitle>
                        <CardDescription>Assessment participants by gender</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={Object.entries(analyticsSummary.genderDistribution).map(([key, value]) => ({
                                name: key,
                                value: value,
                                fill: key === 'Male' ? '#3b82f6' : key === 'Female' ? '#ec4899' : '#6b7280'
                              }))}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {Object.entries(analyticsSummary.genderDistribution).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry[0] === 'Male' ? '#3b82f6' : entry[0] === 'Female' ? '#ec4899' : '#6b7280'} />
                              ))}
                            </Pie>
                            <RechartsTooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* Marriage Status Distribution */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Marriage Status</CardTitle>
                        <CardDescription>Participants by relationship status</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={Object.entries(analyticsSummary.marriageStatusDistribution).map(([key, value]) => ({ name: key, count: value }))}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <RechartsTooltip />
                            <Bar dataKey="count" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Profile Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Distribution</CardTitle>
                      <CardDescription>Most common personality profiles</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={Object.entries(analyticsSummary.profileDistribution).map(([key, value]) => ({ name: key, count: value }))}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                          <YAxis />
                          <RechartsTooltip />
                          <Bar dataKey="count" fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Transactions</CardTitle>
                  <CardDescription>All payment transactions and revenue data</CardDescription>
                </CardHeader>
                <CardContent>
                  {transactionsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : !paymentTransactions || !Array.isArray(paymentTransactions) ? (
                    <div className="flex items-center justify-center py-8 text-muted-foreground">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      No payment transactions available
                    </div>
                  ) : paymentTransactions.length === 0 ? (
                    <div className="flex items-center justify-center py-8 text-muted-foreground">
                      No payment transactions found
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Summary Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-2xl font-bold text-green-600">
                              ${(paymentTransactions.reduce((sum: number, t: PaymentTransaction) => sum + (t.amount / 100), 0)).toFixed(2)}
                            </div>
                            <p className="text-sm text-muted-foreground">Total Revenue</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-2xl font-bold">{paymentTransactions.length}</div>
                            <p className="text-sm text-muted-foreground">Total Transactions</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-2xl font-bold">
                              ${(paymentTransactions.reduce((sum: number, t: PaymentTransaction) => sum + (t.amount / 100), 0) / paymentTransactions.length).toFixed(2)}
                            </div>
                            <p className="text-sm text-muted-foreground">Average Transaction</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Transactions Table */}
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Product</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paymentTransactions.slice(0, 20).map((transaction: PaymentTransaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell>{formatDate(transaction.created)}</TableCell>
                              <TableCell>{transaction.customerEmail || 'N/A'}</TableCell>
                              <TableCell>${(transaction.amount / 100).toFixed(2)}</TableCell>
                              <TableCell>
                                <Badge variant={transaction.status === 'succeeded' ? 'default' : 'destructive'}>
                                  {transaction.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{transaction.productType || 'Assessment'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Marriage Pool Tab */}
            <TabsContent value="pool" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Arranged Marriage Pool</CardTitle>
                  <CardDescription>High-compatibility singles available for matching</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4 items-center">
                      <Select value={filterGender} onValueChange={setFilterGender}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Filter by gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Genders</SelectItem>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {poolCandidatesLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                      </div>
                    ) : poolCandidatesError ? (
                      <div className="flex items-center justify-center py-8 text-red-500">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        Failed to load pool candidates
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Age</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Profile</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Match Score</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {poolCandidates
                            .filter((candidate: any) => filterGender === "all" || candidate.demographics?.gender?.toLowerCase() === filterGender.toLowerCase())
                            .map((candidate: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">
                                {candidate.demographics?.firstName} {candidate.demographics?.lastName}
                              </TableCell>
                              <TableCell>{calculateAge(candidate.demographics?.birthday || '')}</TableCell>
                              <TableCell>
                                <Badge variant="default">
                                  {candidate.scores?.overallPercentage?.toFixed(1) || 0}%
                                </Badge>
                              </TableCell>
                              <TableCell>{candidate.profile?.name || "N/A"}</TableCell>
                              <TableCell>
                                {candidate.demographics?.city}, {candidate.demographics?.state}
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary">
                                  {candidate.matchScore?.toFixed(1) || 0}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Referrals Tab */}
            <TabsContent value="referrals" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Referral Program</CardTitle>
                  <CardDescription>Track referral codes and program performance</CardDescription>
                </CardHeader>
                <CardContent>
                  {referralsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : referralData && referralData.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Referrer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Invitee
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Promo Code
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Sent Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Completed Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {referralData.map((referral) => (
                            <tr key={referral.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div>
                                  <div className="font-medium">{referral.referrerName || 'N/A'}</div>
                                  <div className="text-gray-500">{referral.referrerEmail}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div>
                                  <div className="font-medium">{referral.invitedName || 'N/A'}</div>
                                  <div className="text-gray-500">{referral.invitedEmail}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                  {referral.promoCode || 'N/A'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  referral.status === 'completed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : referral.status === 'expired'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {referral.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {referral.timestamp ? new Date(referral.timestamp).toLocaleDateString() : 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {referral.completedTimestamp ? new Date(referral.completedTimestamp).toLocaleDateString() : 'N/A'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No referrals found. Referral data will appear here when users send invitations.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Recovery Tab */}
            <TabsContent value="recovery" className="space-y-6">
              <RecoverySection />
            </TabsContent>
          </Tabs>
        </main>

        {/* Assessment Detail Modal */}
        <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Assessment Details - {selectedAssessment?.demographics?.firstName} {selectedAssessment?.demographics?.lastName}
              </DialogTitle>
              <DialogDescription>
                Complete assessment information and scoring breakdown
              </DialogDescription>
            </DialogHeader>

            {selectedAssessment && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Email</Label>
                    <p className="text-sm">{selectedAssessment.demographics?.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Gender</Label>
                    <p className="text-sm">{selectedAssessment.demographics?.gender}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Age</Label>
                    <p className="text-sm">{calculateAge(selectedAssessment.demographics?.birthday || '')}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Marriage Status</Label>
                    <p className="text-sm">{selectedAssessment.demographics?.marriageStatus}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Location</Label>
                    <p className="text-sm">
                      {selectedAssessment.demographics?.city}, {selectedAssessment.demographics?.state} {selectedAssessment.demographics?.zipCode}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Ethnicity</Label>
                    <p className="text-sm">{selectedAssessment.demographics?.ethnicity}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">Overall Score</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="default" className="text-lg px-3 py-1">
                      {selectedAssessment.scores?.overallPercentage?.toFixed(1) || 0}%
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">Primary Profile</Label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium">{selectedAssessment.profile?.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{selectedAssessment.profile?.description}</p>
                  </div>
                </div>

                {(selectedAssessment.genderProfile || selectedAssessment.genderSpecificProfile) && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Gender-Specific Profile</Label>
                    <div className="mt-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {selectedAssessment.demographics?.gender?.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground">Profile</span>
                      </div>
                      <h4 className="font-medium text-blue-900">
                        {selectedAssessment.genderProfile?.name || selectedAssessment.genderSpecificProfile?.name}
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        {selectedAssessment.genderProfile?.description || selectedAssessment.genderSpecificProfile?.description}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium text-gray-600">Section Scores</Label>
                  <div className="mt-2 space-y-2">
                    {selectedAssessment.scores?.sections && Object.entries(selectedAssessment.scores.sections).map(([section, score]) => (
                      <div key={section} className="flex justify-between items-center">
                        <span className="text-sm">{section}</span>
                        <Badge variant="outline">{(score as SectionScore).percentage?.toFixed(1) || 0}%</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => handleDownloadAssessmentData(selectedAssessment!)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Data
              </Button>
              <Button
                onClick={() => setDetailModalOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}