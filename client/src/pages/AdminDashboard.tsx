import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { RefreshCw, FileDown, Search, Loader2, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AssessmentScores, UserProfile, DemographicData, AssessmentResult, SectionScore } from "@/types/assessment";
import type { AnalyticsSummary, PageView, VisitorSession, PaymentTransaction } from "@shared/schema";

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
import type { ReferralData } from "@/types/referrals";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const locationWeight = 0.2;
  
  // Score ranking - higher scores are better for traditional match
  const scoreRank = candidate.scores.overallPercentage;
  
  // Age ranking - optimal age range is 25-35
  const age = calculateAge(candidate.demographics.birthday);
  let ageRank = 0;
  if (age >= 25 && age <= 35) {
    ageRank = 100; // Optimal age range
  } else if (age < 25) {
    ageRank = 100 - ((25 - age) * 5); // 5% penalty per year under 25
  } else {
    ageRank = 100 - ((age - 35) * 3); // 3% penalty per year over 35
  }
  
  // Location ranking - placeholder (would use zipcode proximity in real implementation)
  // For now, just check if location info is complete
  const locationRank = candidate.demographics.city && 
    candidate.demographics.state && 
    candidate.demographics.zipCode ? 100 : 50;
  
  // Calculate weighted score
  return (scoreRank * scoreWeight) + (ageRank * ageWeight) + (locationRank * locationWeight);
}

// Component for customer data recovery from Stripe
function RecoverySection() {
  const [isRecoveryLoading, setIsRecoveryLoading] = useState(false);
  const [recoveryData, setRecoveryData] = useState<CustomerRecoveryData[] | null>(null);
  const { toast } = useToast();

  const handleRecoverData = async () => {
    setIsRecoveryLoading(true);
    
    try {
      const response = await apiRequest("GET", "/api/admin/customer-data-recovery");
      
      if (!response.ok) {
        throw new Error(`Error retrieving customer data: ${response.statusText}`);
      }
      
      const data = await response.json();
      setRecoveryData(data);
      
      toast({
        title: "Data Recovery Complete",
        description: `Retrieved contact information for ${data.length} customers`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Data Recovery Failed",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive"
      });
    } finally {
      setIsRecoveryLoading(false);
    }
  };
  
  const handleDownloadCSV = () => {
    if (!recoveryData) return;
    
    try {
      // Create CSV data
      const headers = ["Date", "Email", "Name", "Phone", "Amount", "Product Type", "Description"];
      
      const csvRows = [
        headers.join(','),
        ...recoveryData.map(customer => [
          new Date(customer.payment_date).toLocaleDateString(),
          `"${customer.email || ''}"`,
          `"${customer.name || ''}"`,
          `"${customer.phone || ''}"`,
          customer.amount,
          customer.product_type,
          `"${customer.description || ''}"`,
        ].join(','))
      ];
      
      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `customer-data-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "CSV Generated",
        description: "Customer data has been exported to CSV format",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "CSV Export Failed",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive"
      });
    }
  };
  
  return (
    <>
      <div className="mb-4">
        <Button 
          onClick={handleRecoverData}
          className="bg-green-600 hover:bg-green-700 text-white"
          disabled={isRecoveryLoading}
        >
          {isRecoveryLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Retrieving Data...
            </>
          ) : (
            <>
              <FileDown className="h-4 w-4 mr-2" />
              Recover Customer Data from Stripe
            </>
          )}
        </Button>
      </div>
      
      {isRecoveryLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-500">Retrieving customer data from Stripe...</span>
        </div>
      ) : recoveryData && recoveryData.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Product Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recoveryData.map((customer, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(customer.payment_date).toLocaleDateString()}</TableCell>
                  <TableCell>{customer.email || 'N/A'}</TableCell>
                  <TableCell>{customer.name || 'N/A'}</TableCell>
                  <TableCell>{customer.phone || 'N/A'}</TableCell>
                  <TableCell>${customer.amount}</TableCell>
                  <TableCell>
                    <Badge variant={
                      customer.product_type === 'marriage_pool' ? 'secondary' :
                      customer.product_type === 'individual' ? 'outline' :
                      customer.product_type === 'couple' ? 'default' : 'destructive'
                    }>
                      {customer.product_type}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Total records: {recoveryData.length}
            </div>
            <Button 
              onClick={handleDownloadCSV}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              Download CSV
            </Button>
          </div>
        </div>
      ) : recoveryData ? (
        <div className="text-center py-12 text-gray-500">
          No customer data found. Try syncing with Stripe first.
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          Click the button above to recover customer data from Stripe.
        </div>
      )}
    </>
  );
}

export default function AdminDashboard() {
  // Check localStorage for authentication status on initial load
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem('admin_authenticated');
    return savedAuth === 'true';
  });
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [referralSearchTerm, setReferralSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState<"all" | "male" | "female">("all");
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentResult | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const { toast } = useToast();

  // State for assessment date filtering
  const [assessmentDateRange, setAssessmentDateRange] = useState<{
    startDate?: string,
    endDate?: string,
    requirePayment: boolean,
    promoCodeUsed: boolean,
    completedOnly: boolean
  }>({
    startDate: "2025-05-06", // Default to May 6, 2025
    endDate: undefined,
    requirePayment: false,
    promoCodeUsed: false,
    completedOnly: true
  });

  // Query to fetch assessments with date filtering
  const { data: assessments, isLoading, error, refetch: refetchAssessments } = useQuery<AssessmentResult[]>({
    queryKey: ['/api/admin/assessments', assessmentDateRange],
    queryFn: async () => {
      // Only fetch if authenticated
      if (!isAuthenticated) return [];
      
      const params = new URLSearchParams();
      
      if (assessmentDateRange.startDate) {
        params.append('startDate', assessmentDateRange.startDate);
      }
      
      if (assessmentDateRange.endDate) {
        params.append('endDate', assessmentDateRange.endDate);
      }
      
      if (assessmentDateRange.requirePayment) {
        params.append('requirePayment', 'true');
      }
      
      if (assessmentDateRange.promoCodeUsed) {
        params.append('promoCodeUsed', 'true');
      }
      
      if (assessmentDateRange.completedOnly) {
        params.append('completedOnly', 'true');
      }
      
      const queryString = params.toString();
      const url = queryString ? `/api/admin/assessments?${queryString}` : '/api/admin/assessments';
      
      const response = await apiRequest("GET", url);
      
      if (!response.ok) {
        throw new Error("Failed to fetch assessments");
      }
      
      return response.json();
    },
    enabled: isAuthenticated,
  });
  
  // Query to fetch referrals
  const { data: referrals, isLoading: isLoadingReferrals, error: referralsError } = useQuery<ReferralData[]>({
    queryKey: ['/api/admin/referrals'],
    queryFn: async () => {
      // Only fetch if authenticated
      if (!isAuthenticated) return [];
      
      const response = await apiRequest("GET", "/api/admin/referrals");
      
      if (!response.ok) {
        throw new Error("Failed to fetch referrals");
      }
      
      return response.json();
    },
    enabled: isAuthenticated,
  });
  
  // Website Analytics - summary data
  const [analyticsPeriod, setAnalyticsPeriod] = useState<'day' | 'week' | 'month' | 'year'>('week');
  
  const { data: analyticsSummary, isLoading: isLoadingAnalytics } = useQuery<AnalyticsSummary>({
    queryKey: ['/api/admin/analytics/summary', analyticsPeriod],
    queryFn: async () => {
      if (!isAuthenticated) return {
        totalVisitors: 0,
        totalPageViews: 0,
        topPages: [],
        dailyVisitors: [],
        conversionRate: 0,
        averageSessionDuration: 0
      };
      
      const response = await apiRequest("GET", `/api/admin/analytics/summary?period=${analyticsPeriod}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch analytics summary");
      }
      
      return response.json();
    },
    enabled: isAuthenticated,
  });
  
  // Website Analytics - page views data
  const { data: pageViews, isLoading: isLoadingPageViews } = useQuery<PageView[]>({
    queryKey: ['/api/admin/analytics/page-views'],
    queryFn: async () => {
      if (!isAuthenticated) return [];
      
      const response = await apiRequest("GET", "/api/admin/analytics/page-views");
      
      if (!response.ok) {
        throw new Error("Failed to fetch page views");
      }
      
      return response.json();
    },
    enabled: isAuthenticated,
  });
  
  // Website Analytics - visitor sessions data
  const { data: visitorSessions, isLoading: isLoadingVisitorSessions } = useQuery<VisitorSession[]>({
    queryKey: ['/api/admin/analytics/visitor-sessions'],
    queryFn: async () => {
      if (!isAuthenticated) return [];
      
      const response = await apiRequest("GET", "/api/admin/analytics/visitor-sessions");
      
      if (!response.ok) {
        throw new Error("Failed to fetch visitor sessions");
      }
      
      return response.json();
    },
    enabled: isAuthenticated,
  });
  
  // Payment transactions data
  const [transactionDateRange, setTransactionDateRange] = useState<{start?: string, end?: string}>({});
  const [emailSearchTerm, setEmailSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<AssessmentResult[] | null>(null);
  
  // Remove customerRecoveryData state as it's now in the RecoverySection component
  
  // State for assessment reminder system
  const [sendingReminders, setSendingReminders] = useState<boolean>(false);
  const [reminderDaysAgo, setReminderDaysAgo] = useState<number>(3);
  
  // Mutation to send assessment reminders
  const { mutate: sendAssessmentReminders, isPending: isSendingReminders } = useMutation({
    mutationFn: async () => {
      setSendingReminders(true);
      
      // Show toast that reminders are being sent
      toast({
        title: "Sending Reminders",
        description: "Processing incomplete assessments and sending reminders...",
        variant: "default"
      });
      
      const response = await apiRequest("POST", "/api/admin/send-assessment-reminders", {
        daysAgo: reminderDaysAgo
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send assessment reminders: ${errorText}`);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      const stats = data.stats || {};
      const emailsSent = stats.emailsSent || 0;
      const incompleteCount = stats.incompleteAssessments || 0;
      
      toast({
        title: emailsSent > 0 ? "Reminders Sent Successfully" : "Process Complete",
        description: emailsSent > 0 
          ? `Sent ${emailsSent} reminder email${emailsSent !== 1 ? 's' : ''} to customers with incomplete assessments.`
          : "No incomplete assessments found that require reminders.",
        variant: "default"
      });
      
      setSendingReminders(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Send Reminders",
        description: error.message,
        variant: "destructive"
      });
      
      setSendingReminders(false);
    }
  });
  
  // Sync Stripe payments mutation
  const { mutate: syncStripePayments, isPending: isSyncingPayments } = useMutation({
    mutationFn: async () => {
      // Show toast that sync is starting
      toast({
        title: "Syncing Transactions",
        description: "Retrieving payment data from Stripe...",
        variant: "default"
      });
      
      const response = await apiRequest("POST", "/api/admin/stripe/sync-payments", {
        startDate: transactionDateRange.start,
        endDate: transactionDateRange.end
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to sync Stripe payments: ${errorText}`);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      const newCount = data.count || 0;
      const detail = data.detail || {};
      
      // Build a more detailed message
      let detailMessage = "";
      if (detail.individual) detailMessage += `\n• ${detail.individual} individual assessment(s)`;
      if (detail.couple) detailMessage += `\n• ${detail.couple} couple assessment(s)`;
      if (detail.marriage_pool) detailMessage += `\n• ${detail.marriage_pool} arranged marriage pool application(s)`;
      if (detail.other) detailMessage += `\n• ${detail.other} other transaction(s)`;
      
      toast({
        title: newCount > 0 ? "Sync Successful" : "Sync Complete",
        description: newCount > 0 
          ? `Found ${newCount} new payment(s):${detailMessage}`
          : "No new transactions found. You're up to date!",
        variant: "default"
      });
      
      // Invalidate payment transactions query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/admin/analytics/payment-transactions'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Sync Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Define a type for enhanced transactions including assessment data
  type EnhancedTransaction = PaymentTransaction & { 
    assessmentData?: { 
      firstName?: string;
      lastName?: string; 
      gender?: string;
      marriageStatus?: string;
      desireChildren?: string;
      ethnicity?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    }
  };
  
  const { data: paymentTransactions, isLoading: isLoadingPaymentTransactions } = useQuery<EnhancedTransaction[]>({
    queryKey: ['/api/admin/analytics/payment-transactions', transactionDateRange],
    queryFn: async () => {
      if (!isAuthenticated) return [];
      
      let url = "/api/admin/analytics/payment-transactions";
      const params = new URLSearchParams();
      
      if (transactionDateRange.start) {
        params.append('startDate', transactionDateRange.start);
      }
      
      if (transactionDateRange.end) {
        params.append('endDate', transactionDateRange.end);
      }
      
      // Request assessment data to be included
      params.append('includeAssessmentData', 'true');
      
      const queryString = params.toString();
      if (queryString) {
        url = `${url}?${queryString}`;
      }
      
      const response = await apiRequest("GET", url);
      
      if (!response.ok) {
        throw new Error("Failed to fetch payment transactions");
      }
      
      return response.json();
    },
    enabled: isAuthenticated,
  });
  
  // Filter assessments by search term
  const filteredAssessments = assessments?.filter(assessment => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      assessment.name.toLowerCase().includes(searchLower) ||
      assessment.email.toLowerCase().includes(searchLower) ||
      assessment.demographics.gender.toLowerCase().includes(searchLower) ||
      assessment.profile.name.toLowerCase().includes(searchLower)
    );
  });
  
  // Filter referrals by search term
  const filteredReferrals = referrals?.filter(referral => {
    if (!referralSearchTerm) return true;
    
    const searchLower = referralSearchTerm.toLowerCase();
    return (
      referral.referrerName.toLowerCase().includes(searchLower) ||
      referral.referrerEmail.toLowerCase().includes(searchLower) ||
      referral.invitedName.toLowerCase().includes(searchLower) ||
      referral.invitedEmail.toLowerCase().includes(searchLower) ||
      (referral.promoCode && referral.promoCode.toLowerCase().includes(searchLower))
    );
  });
  
  // Filter THM pool candidates by gender
  const filteredPoolCandidates = useMemo(() => {
    if (!assessments) return [];
    
    // First filter by THM pool opt-in
    const poolCandidates = assessments.filter(a => a.demographics.thmPoolApplied);
    
    // Then filter by gender if needed
    if (filterGender === "all") {
      return poolCandidates;
    } else {
      return poolCandidates.filter(a => a.demographics.gender === filterGender);
    }
  }, [assessments, filterGender]);
  
  // Calculate analytics
  const analytics = {
    totalAssessments: assessments?.length || 0,
    genderDistribution: {
      male: assessments?.filter(a => a.demographics.gender === "male").length || 0,
      female: assessments?.filter(a => a.demographics.gender === "female").length || 0,
    },
    averageScore: assessments && assessments.length > 0 
      ? assessments.reduce((sum, assessment) => sum + assessment.scores.overallPercentage, 0) / assessments.length 
      : 0,
    profileDistribution: {} as Record<string, number>,
    referralsStats: {
      total: referrals?.length || 0,
      completed: referrals?.filter(r => r.status === 'completed').length || 0,
      pending: referrals?.filter(r => r.status === 'sent').length || 0,
      expired: referrals?.filter(r => r.status === 'expired').length || 0,
      completionRate: referrals && referrals.length > 0
        ? (referrals.filter(r => r.status === 'completed').length / referrals.length) * 100
        : 0
    }
  };
  
  // Count profiles
  if (assessments?.length) {
    const profileCounts: Record<string, number> = {};
    assessments.forEach(assessment => {
      const profileName = assessment.profile.name;
      profileCounts[profileName] = (profileCounts[profileName] || 0) + 1;
    });
    analytics.profileDistribution = profileCounts;
  }
  
  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Store authentication state in localStorage
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
    // Remove authentication state from localStorage
    localStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
      variant: "default"
    });
  };
  
  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString || "N/A";
    }
  };
  
  // Handle viewing assessment details
  const handleViewDetails = (assessment: AssessmentResult) => {
    setSelectedAssessment(assessment);
    setDetailModalOpen(true);
  };
  
  // Handle searching for assessments by email
  const handleEmailSearch = async () => {
    if (!emailSearchTerm) return;
    
    try {
      // Show loading toast
      toast({
        title: "Searching...",
        description: `Looking for assessments with email: ${emailSearchTerm}`,
      });
      
      const response = await apiRequest(
        "GET", 
        `/api/admin/assessments/search?email=${encodeURIComponent(emailSearchTerm)}`
      );
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.assessments.length === 0) {
        toast({
          title: "No Results Found",
          description: `No assessments found for email: ${emailSearchTerm}`,
          variant: "destructive"
        });
        setSearchResults(null);
      } else {
        toast({
          title: "Search Results",
          description: `Found ${data.assessments.length} assessment(s) for ${emailSearchTerm}`,
        });
        setSearchResults(data.assessments);
        
        // If there's exactly one result, open the details modal
        if (data.assessments.length === 1) {
          setSelectedAssessment(data.assessments[0]);
          setDetailModalOpen(true);
        }
      }
    } catch (error) {
      console.error("Error searching for assessments:", error);
      toast({
        title: "Search Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };
  
  // Pool Candidates Table component for THM matching
  const PoolCandidatesTable = ({ candidates }: { candidates: AssessmentResult[] }) => {
    const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
    
    // Rank candidates by score, age and location
    const rankedCandidates = useMemo(() => {
      return [...candidates].sort((a, b) => {
        const scoreA = calculateMatchScore(a);
        const scoreB = calculateMatchScore(b);
        return scoreB - scoreA; // Sort by descending score
      });
    }, [candidates]);
    
    // Handle checkbox selection
    const handleSelectCandidate = (email: string) => {
      setSelectedCandidates(prev => {
        if (prev.includes(email)) {
          return prev.filter(e => e !== email);
        } else {
          return [...prev, email];
        }
      });
    };
    
    // Handle sending match notification emails
    const handleSendMatchNotifications = async () => {
      if (selectedCandidates.length < 2) {
        alert("Please select at least 2 candidates to match");
        return;
      }
      
      try {
        // API call would go here
        // await apiRequest("POST", "/api/admin/send-match-notifications", { candidates: selectedCandidates });
        alert(`Match notifications would be sent to ${selectedCandidates.length} candidates`);
        setSelectedCandidates([]);
      } catch (error) {
        console.error("Error sending match notifications:", error);
        alert("Error sending match notifications");
      }
    };
    
    return (
      <div className="space-y-4">
        {selectedCandidates.length > 0 && (
          <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-md">
            <span className="text-sm">
              <span className="font-medium">{selectedCandidates.length}</span> candidates selected
            </span>
            <Button 
              size="sm" 
              onClick={handleSendMatchNotifications}
            >
              Send Match Notifications
            </Button>
          </div>
        )}
        
        <Table>
          <TableCaption>THM Pool Candidates - Ranked by compatibility</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Select</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Profile</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankedCandidates.length ? (
              rankedCandidates.map((candidate) => {
                const age = calculateAge(candidate.demographics.birthday);
                const matchScore = calculateMatchScore(candidate);
                const location = `${candidate.demographics.city}, ${candidate.demographics.state} ${candidate.demographics.zipCode}`;
                
                return (
                  <TableRow key={candidate.email}>
                    <TableCell>
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 rounded border-gray-300"
                        checked={selectedCandidates.includes(candidate.email)}
                        onChange={() => handleSelectCandidate(candidate.email)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{candidate.name}</TableCell>
                    <TableCell>{age || "N/A"}</TableCell>
                    <TableCell>{candidate.demographics.gender}</TableCell>
                    <TableCell>{location}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${matchScore}%` }}
                          />
                        </div>
                        <span className="text-sm">{matchScore.toFixed(0)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{candidate.profile.name}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => alert(`View ${candidate.name}'s profile (would show detailed info)`)}
                      >
                        View Profile
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No THM pool candidates found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  };

  // Handle Assessment CSV export
  const handleExportAssessmentsCSV = () => {
    if (!assessments?.length) return;
    
    // Define CSV columns
    const headers = [
      "Name",
      "Email",
      "Date",
      "Gender",
      "Marriage Status",
      "Desire Children",
      "Ethnicity",
      "Profile",
      "Overall Score",
      "Book Purchased"
    ];
    
    // Convert assessment data to CSV rows
    const rows = assessments.map(assessment => [
      assessment.name,
      assessment.email,
      assessment.timestamp ? new Date(assessment.timestamp).toISOString().split('T')[0] : '',
      assessment.demographics.gender,
      assessment.demographics.marriageStatus,
      assessment.demographics.desireChildren,
      assessment.demographics.ethnicity,
      assessment.profile.name,
      assessment.scores.overallPercentage.toFixed(1) + '%',
      assessment.demographics.hasPurchasedBook
    ]);
    
    // Add headers to beginning of rows
    rows.unshift(headers);
    
    // Convert to CSV content
    const csvContent = rows.map(row => row.map(cell => 
      // Escape quotes and wrap in quotes if contains comma or quote
      typeof cell === 'string' && (cell.includes(',') || cell.includes('"')) 
        ? `"${cell.replace(/"/g, '""')}"` 
        : cell
    ).join(',')).join('\n');
    
    // Create a download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `100-marriage-assessments-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Handle Referrals CSV export
  const handleExportReferralsCSV = () => {
    if (!referrals?.length) return;
    
    // Define CSV columns
    const headers = [
      "Referrer Name",
      "Referrer Email",
      "Invited Person",
      "Invited Email",
      "Date Sent",
      "Status",
      "Promo Code",
      "Completion Date"
    ];
    
    // Convert referral data to CSV rows
    const rows = referrals.map(referral => [
      referral.referrerName,
      referral.referrerEmail,
      referral.invitedName,
      referral.invitedEmail,
      referral.timestamp ? new Date(referral.timestamp).toISOString().split('T')[0] : '',
      referral.status,
      referral.promoCode || 'N/A',
      referral.completedTimestamp ? new Date(referral.completedTimestamp).toISOString().split('T')[0] : 'N/A'
    ]);
    
    // Add headers to beginning of rows
    rows.unshift(headers);
    
    // Convert to CSV content
    const csvContent = rows.map(row => row.map(cell => 
      // Escape quotes and wrap in quotes if contains comma or quote
      typeof cell === 'string' && (cell.includes(',') || cell.includes('"')) 
        ? `"${cell.replace(/"/g, '""')}"` 
        : cell
    ).join(',')).join('\n');
    
    // Create a download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `100-marriage-referrals-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
            <CardDescription>Please login to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="username">Username</label>
                <Input 
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="password">Password</label>
                <Input 
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Login</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">100 Marriage Assessment - Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="analytics" className="space-y-4">
          <TabsList>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="assessments">Assessment Results</TabsTrigger>
            <TabsTrigger value="historical">Historical Data (Since May 6)</TabsTrigger>
            <TabsTrigger value="data-recovery">Customer Data Recovery</TabsTrigger>
            <TabsTrigger value="referrals">Invitations & Referrals</TabsTrigger>
            <TabsTrigger value="payments">Payment Transactions</TabsTrigger>
            <TabsTrigger value="matching">THM Pool Matching</TabsTrigger>
          </TabsList>
          
          {/* Customer Data Recovery Tab */}
          <TabsContent value="data-recovery" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Data Recovery</CardTitle>
                <CardDescription>
                  Recover customer information directly from Stripe for customers who made payments since May 6, 2025
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecoverySection />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Assessments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analytics.totalAssessments}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Average Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analytics.averageScore.toFixed(1)}%</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Gender Distribution</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Male</div>
                    <div className="text-2xl font-bold">{analytics.genderDistribution.male}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Female</div>
                    <div className="text-2xl font-bold">{analytics.genderDistribution.female}</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Referrals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">Total Invitations</div>
                      <div className="text-lg font-semibold">{analytics.referralsStats.total}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">Completed</div>
                      <div className="text-lg font-semibold text-green-600">{analytics.referralsStats.completed}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">Completion Rate</div>
                      <div className="text-lg font-semibold">
                        {analytics.referralsStats.completionRate.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Profile Distribution</CardTitle>
                <CardDescription>Number of users in each psychographic profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(analytics.profileDistribution).map(([profile, count]) => (
                    <div key={profile} className="flex items-center justify-between">
                      <span>{profile}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 bg-primary-200 rounded-full w-[200px] overflow-hidden">
                          <div 
                            className="h-full bg-primary-500 rounded-full" 
                            style={{ width: `${(Number(count) / analytics.totalAssessments) * 100}%` }} 
                          />
                        </div>
                        <span className="text-sm text-gray-500">{Number(count)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Website Traffic Analytics Section */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Website Traffic Analytics</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Time period:</span>
                  <select 
                    value={analyticsPeriod}
                    onChange={(e) => setAnalyticsPeriod(e.target.value as 'day' | 'week' | 'month' | 'year')}
                    className="text-sm border rounded p-1"
                  >
                    <option value="day">Last 24 hours</option>
                    <option value="week">Last 7 days</option>
                    <option value="month">Last 30 days</option>
                    <option value="year">Last 12 months</option>
                  </select>
                </div>
              </div>
              
              {isLoadingAnalytics ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Visitors</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{analyticsSummary?.totalVisitors || 0}</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Page Views</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{analyticsSummary?.totalPageViews || 0}</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Conversion Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{(analyticsSummary?.conversionRate || 0).toFixed(1)}%</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Avg. Session</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">
                          {Math.floor((analyticsSummary?.averageSessionDuration || 0) / 60)}m {Math.floor((analyticsSummary?.averageSessionDuration || 0) % 60)}s
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Visitor Trends</CardTitle>
                        <CardDescription>Daily visitor count over time</CardDescription>
                      </CardHeader>
                      <CardContent className="h-80">
                        {analyticsSummary?.dailyVisitors && analyticsSummary.dailyVisitors.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analyticsSummary.dailyVisitors}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis 
                                dataKey="date" 
                                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              />
                              <YAxis allowDecimals={false} />
                              <Tooltip 
                                labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { 
                                  weekday: 'long',
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                                formatter={(value) => [`${value} visitors`, 'Count']}
                              />
                              <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-500">
                            No visitor data available for this period
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Top Pages</CardTitle>
                        <CardDescription>Most visited pages on the website</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {analyticsSummary?.topPages && analyticsSummary.topPages.length > 0 ? (
                          <div className="space-y-4">
                            {analyticsSummary.topPages.map((page, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium w-6 text-center">{index + 1}</span>
                                  <span className="text-sm truncate max-w-[200px]">{page.path}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-primary" 
                                      style={{ 
                                        width: `${(page.count / (analyticsSummary.topPages[0]?.count || 1)) * 100}%` 
                                      }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium">{page.count}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-32 text-gray-500">
                            No page view data available
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="assessments" className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <h2 className="text-lg font-medium">Assessment Results</h2>
                
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportAssessmentsCSV}
                    disabled={!assessments?.length}
                    className="whitespace-nowrap"
                  >
                    Export CSV
                  </Button>
                  
                  <Input 
                    placeholder="Search by name, email, etc..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64"
                  />
                </div>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  Error loading assessment data
                </div>
              ) : (
                <div className="overflow-auto">
                  <Table>
                    <TableCaption>A list of all assessment results</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Profile</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAssessments?.length ? (
                        filteredAssessments.map((assessment) => (
                          <TableRow key={`${assessment.email}-${assessment.timestamp}`}>
                            <TableCell className="font-medium">{assessment.name}</TableCell>
                            <TableCell>{assessment.email}</TableCell>
                            <TableCell>{formatDate(assessment.timestamp)}</TableCell>
                            <TableCell>{assessment.demographics.gender}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{assessment.profile.name}</Badge>
                            </TableCell>
                            <TableCell>{assessment.scores.overallPercentage}%</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewDetails(assessment)}
                              >
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                            No assessment results found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="historical" className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <h2 className="text-lg font-medium">Historical Assessment Data (Since May 6)</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportAssessmentsCSV}
                  disabled={!assessments?.length}
                  className="whitespace-nowrap"
                >
                  Export CSV
                </Button>
              </div>
              
              {/* Date Filter Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <Label htmlFor="startDate">From Date</Label>
                  <Input
                    type="date"
                    id="startDate"
                    value={assessmentDateRange.startDate || "2025-05-06"}
                    onChange={(e) => setAssessmentDateRange({
                      ...assessmentDateRange,
                      startDate: e.target.value || "2025-05-06"
                    })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">To Date</Label>
                  <Input
                    type="date"
                    id="endDate"
                    value={assessmentDateRange.endDate || ""}
                    onChange={(e) => setAssessmentDateRange({
                      ...assessmentDateRange,
                      endDate: e.target.value
                    })}
                    className="mt-1"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <div className="flex items-center space-x-2 h-10">
                    <Checkbox
                      id="requirePayment"
                      checked={assessmentDateRange.requirePayment}
                      onCheckedChange={(checked) => setAssessmentDateRange({
                        ...assessmentDateRange,
                        requirePayment: checked === true
                      })}
                    />
                    <Label htmlFor="requirePayment">Paid assessments only</Label>
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
              
              {/* Results Summary */}
              <div className="text-sm text-muted-foreground mb-4">
                Found {filteredAssessments?.length || 0} assessments from {assessmentDateRange.startDate || "May 6, 2025"} 
                {assessmentDateRange.endDate ? ` to ${assessmentDateRange.endDate}` : " to present"}
                {assessmentDateRange.requirePayment ? " (paid assessments only)" : ""}
              </div>
              
              {/* Assessment Results Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-medium">Name</TableHead>
                      <TableHead className="font-medium">Email</TableHead>
                      <TableHead className="font-medium">Date</TableHead>
                      <TableHead className="font-medium">Gender</TableHead>
                      <TableHead className="font-medium">Location</TableHead>
                      <TableHead className="font-medium">Marriage Status</TableHead>
                      <TableHead className="font-medium">Profile</TableHead>
                      <TableHead className="font-medium">Score</TableHead>
                      <TableHead className="font-medium"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                          <div className="flex justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredAssessments && filteredAssessments.length > 0 ? (
                      // Display filtered assessments sorted by date
                      filteredAssessments
                        .sort((a, b) => {
                          // Sort by most recent first
                          const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
                          const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
                          return dateB - dateA;
                        })
                        .map((assessment, index) => (
                          <TableRow key={index}>
                            <TableCell>{assessment.name}</TableCell>
                            <TableCell className="font-mono text-xs">{assessment.email}</TableCell>
                            <TableCell>
                              {assessment.timestamp ? formatDate(assessment.timestamp) : "N/A"}
                            </TableCell>
                            <TableCell>{assessment.demographics.gender}</TableCell>
                            <TableCell>
                              {assessment.demographics.city}, {assessment.demographics.state}
                            </TableCell>
                            <TableCell>{assessment.demographics.marriageStatus}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{assessment.profile.name}</Badge>
                            </TableCell>
                            <TableCell>
                              {assessment.scores.overallPercentage.toFixed(1)}%
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => {
                                  setSelectedAssessment(assessment);
                                  setDetailModalOpen(true);
                                }}
                              >
                                <Search className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                          No assessment results found in this date range.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="referrals" className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <h2 className="text-lg font-medium">Invitations & Referrals</h2>
                
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportReferralsCSV}
                    disabled={!referrals?.length}
                    className="whitespace-nowrap"
                  >
                    Export CSV
                  </Button>
                  
                  <Input 
                    placeholder="Search referrals..." 
                    value={referralSearchTerm}
                    onChange={(e) => setReferralSearchTerm(e.target.value)}
                    className="w-full sm:w-64"
                  />
                </div>
              </div>
              
              {isLoadingReferrals ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : referralsError ? (
                <div className="text-center py-8 text-red-500">
                  Error loading referral data
                </div>
              ) : (
                <div className="overflow-auto">
                  <Table>
                    <TableCaption>A list of all invitations and referrals</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Referrer</TableHead>
                        <TableHead>Invited Person</TableHead>
                        <TableHead>Invited Email</TableHead>
                        <TableHead>Date Sent</TableHead>
                        <TableHead>Promo Code</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Completion Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReferrals?.length ? (
                        filteredReferrals.map((referral) => (
                          <TableRow key={referral.id}>
                            <TableCell className="font-medium">
                              {referral.referrerName}
                              <div className="text-xs text-gray-500">{referral.referrerEmail}</div>
                            </TableCell>
                            <TableCell>{referral.invitedName}</TableCell>
                            <TableCell>{referral.invitedEmail}</TableCell>
                            <TableCell>{formatDate(referral.timestamp)}</TableCell>
                            <TableCell>
                              {referral.promoCode ? (
                                <Badge variant="outline">{referral.promoCode}</Badge>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  referral.status === 'completed' ? 'default' : 
                                  referral.status === 'sent' ? 'outline' : 'secondary'
                                }
                              >
                                {referral.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {referral.completedTimestamp ? (
                                formatDate(referral.completedTimestamp)
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                            No referrals found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="payments" className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <div>
                  <h2 className="text-lg font-medium">Payment Transactions</h2>
                  <p className="text-sm text-gray-500">
                    View revenue and payment details
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">From:</span>
                      <input 
                        type="date" 
                        className="text-sm border rounded p-1"
                        value={transactionDateRange.start || ''}
                        onChange={(e) => setTransactionDateRange(prev => ({...prev, start: e.target.value}))}
                      />
                      <span className="text-sm text-gray-500">To:</span>
                      <input 
                        type="date" 
                        className="text-sm border rounded p-1"
                        value={transactionDateRange.end || ''}
                        onChange={(e) => setTransactionDateRange(prev => ({...prev, end: e.target.value}))}
                      />
                    </div>
                    
                    {/* Email search input */}
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <input
                        type="email"
                        placeholder="Search by email..."
                        className="text-sm border rounded p-1 w-full sm:w-60"
                        value={emailSearchTerm}
                        onChange={(e) => setEmailSearchTerm(e.target.value)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEmailSearch}
                        disabled={!emailSearchTerm}
                      >
                        Search
                      </Button>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        variant="default"
                        size="sm" 
                        onClick={() => syncStripePayments()}
                        disabled={isSyncingPayments}
                        className="whitespace-nowrap"
                      >
                        {isSyncingPayments ? (
                          <>
                            <span className="animate-spin mr-2 h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                            Syncing Transactions...
                          </>
                        ) : "Sync Missing Transactions"}
                      </Button>
                      
                      <div className="flex items-center space-x-2">
                        <Select 
                          value={reminderDaysAgo.toString()} 
                          onValueChange={(value) => setReminderDaysAgo(parseInt(value))}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Reminder Days" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 day ago</SelectItem>
                            <SelectItem value="3">3 days ago</SelectItem>
                            <SelectItem value="7">7 days ago</SelectItem>
                            <SelectItem value="14">14 days ago</SelectItem>
                            <SelectItem value="30">30 days ago</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button 
                          variant="outline"
                          size="sm" 
                          onClick={() => sendAssessmentReminders()}
                          disabled={isSendingReminders}
                          className="whitespace-nowrap"
                        >
                          {isSendingReminders ? (
                            <>
                              <span className="animate-spin mr-2 h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                              Sending Reminders...
                            </>
                          ) : "Send Completion Reminders"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {isLoadingPaymentTransactions ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : (
                <>
                  {/* Revenue Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">
                          ${paymentTransactions 
                            ? paymentTransactions
                                .filter(t => !t.isRefunded)
                                .reduce((sum, t) => sum + Number(t.amount), 0)
                                .toFixed(2)
                            : '0.00'
                          }
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Transactions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{paymentTransactions?.length || 0}</div>
                        <div className="text-sm text-gray-500">
                          {paymentTransactions 
                            ? `${paymentTransactions.filter(t => !t.isRefunded).length} active / 
                               ${paymentTransactions.filter(t => t.isRefunded).length} refunded`
                            : '0 active / 0 refunded'
                          }
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Product Breakdown</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between items-center">
                            <span>Individual Assessments:</span>
                            <span className="font-medium">
                              ${paymentTransactions 
                                ? paymentTransactions
                                    .filter(t => t.productType === 'individual' && !t.isRefunded)
                                    .reduce((sum, t) => sum + Number(t.amount), 0)
                                    .toFixed(2)
                                : '0.00'
                              }
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Couple Assessments:</span>
                            <span className="font-medium">
                              ${paymentTransactions 
                                ? paymentTransactions
                                    .filter(t => t.productType === 'couple' && !t.isRefunded)
                                    .reduce((sum, t) => sum + Number(t.amount), 0)
                                    .toFixed(2)
                                : '0.00'
                              }
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Search Results */}
                  {searchResults && searchResults.length > 0 && (
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle>Search Results for: {emailSearchTerm}</CardTitle>
                        <CardDescription>Found {searchResults.length} assessment{searchResults.length > 1 ? 's' : ''}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {searchResults.map(assessment => (
                            <div key={assessment.email} className="border rounded-lg p-4 hover:bg-gray-50">
                              <div className="flex justify-between">
                                <div>
                                  <div className="text-lg font-medium">{assessment.name}</div>
                                  <div className="text-sm text-gray-500">{assessment.email}</div>
                                  <div className="flex mt-2 gap-2">
                                    <Badge>{assessment.demographics.gender}</Badge>
                                    <Badge variant="outline">{assessment.profile.name}</Badge>
                                    <Badge variant="secondary">{assessment.scores.overallPercentage.toFixed(1)}%</Badge>
                                  </div>
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleViewDetails(assessment)}
                                >
                                  View Details
                                </Button>
                              </div>
                              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                                <div>
                                  <span className="font-medium">Demographics:</span> {assessment.demographics.marriageStatus}, {assessment.demographics.ethnicity}
                                </div>
                                <div>
                                  <span className="font-medium">Location:</span> {assessment.demographics.city}, {assessment.demographics.state}
                                </div>
                                <div>
                                  <span className="font-medium">Date:</span> {formatDate(assessment.timestamp)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Revenue Chart */}
                  {paymentTransactions && paymentTransactions.length > 0 && (
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle>Revenue by Product Type</CardTitle>
                        <CardDescription>Distribution of revenue across assessment types</CardDescription>
                      </CardHeader>
                      <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { 
                                  name: 'Individual Assessments', 
                                  value: paymentTransactions
                                    .filter(t => t.productType === 'individual' && !t.isRefunded)
                                    .reduce((sum, t) => sum + Number(t.amount), 0)
                                },
                                { 
                                  name: 'Couple Assessments', 
                                  value: paymentTransactions
                                    .filter(t => t.productType === 'couple' && !t.isRefunded)
                                    .reduce((sum, t) => sum + Number(t.amount), 0)
                                }
                              ]}
                              cx="50%"
                              cy="50%"
                              labelLine={true}
                              outerRadius={120}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, value, percent }) => 
                                `${name}: $${Number(value).toFixed(2)} (${(percent * 100).toFixed(1)}%)`
                              }
                            >
                              <Cell key="individual" fill="#8884d8" />
                              <Cell key="couple" fill="#82ca9d" />
                            </Pie>
                            <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Revenue']} />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Transactions Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Transaction History</CardTitle>
                      <CardDescription>
                        Complete transaction records from Stripe
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Demographics</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Transaction ID</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paymentTransactions && paymentTransactions.length > 0 ? (
                            paymentTransactions
                              .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
                              .map((transaction) => (
                                <TableRow key={transaction.id} className={transaction.isRefunded ? "bg-red-50" : ""}>
                                  <TableCell>{formatDate(transaction.created)}</TableCell>
                                  <TableCell>
                                    {transaction.assessmentData?.firstName && transaction.assessmentData?.lastName ? (
                                      <div className="flex flex-col">
                                        <span className="font-medium">{`${transaction.assessmentData.firstName} ${transaction.assessmentData.lastName}`}</span>
                                        <span className="text-xs text-muted-foreground">{transaction.customerEmail || 'N/A'}</span>
                                      </div>
                                    ) : (
                                      <span>{transaction.customerEmail || "Anonymous"}</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {transaction.productType === 'individual' ? (
                                      <Badge variant="outline">Individual</Badge>
                                    ) : transaction.productType === 'couple' ? (
                                      <Badge variant="default">Couple</Badge>
                                    ) : transaction.productType === 'marriage_pool' ? (
                                      <Badge variant="secondary">Marriage Pool</Badge>
                                    ) : (
                                      <Badge>{transaction.productType}</Badge>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-sm">
                                    {transaction.productName || (
                                      transaction.productType === 'individual' ? 'The 100 Marriage Assessment - Series 1 (Individual)' :
                                      transaction.productType === 'couple' ? 'The 100 Marriage Assessment - Series 1 (Couple)' :
                                      transaction.productType === 'marriage_pool' ? 'THM Arranged Marriage Pool Application Fee' :
                                      'Unknown Product'
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {transaction.assessmentData ? (
                                      <div className="space-y-1 text-xs">
                                        {transaction.assessmentData.gender && (
                                          <div className="flex items-center gap-1">
                                            <span className="font-medium">Gender:</span> {transaction.assessmentData.gender}
                                          </div>
                                        )}
                                        {transaction.assessmentData.marriageStatus && (
                                          <div className="flex items-center gap-1">
                                            <span className="font-medium">Status:</span> {transaction.assessmentData.marriageStatus}
                                          </div>
                                        )}
                                        {transaction.assessmentData.city && transaction.assessmentData.state && (
                                          <div className="flex items-center gap-1">
                                            <span className="font-medium">Location:</span> {`${transaction.assessmentData.city}, ${transaction.assessmentData.state}`}
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <span className="text-xs text-muted-foreground">No data</span>
                                    )}
                                  </TableCell>
                                  <TableCell className="font-medium">
                                    ${(Number(transaction.amount)/100).toFixed(2)}
                                  </TableCell>
                                  <TableCell>
                                    {transaction.isRefunded ? (
                                      <Badge variant="destructive">Refunded</Badge>
                                    ) : transaction.status === 'succeeded' ? (
                                      <Badge variant="default">Succeeded</Badge>
                                    ) : (
                                      <Badge variant="outline">{transaction.status}</Badge>
                                    )}
                                  </TableCell>
                                  <TableCell className="font-mono text-xs">{transaction.stripeId.substring(0, 14)}...</TableCell>
                                </TableRow>
                              ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                No transactions found for the selected period
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="matching" className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <div>
                  <h2 className="text-lg font-medium">THM Pool Matching</h2>
                  <p className="text-sm text-gray-500">
                    View and match candidates who opted into The 100 Marriage Arranged pool
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilterGender("all")}
                    className={filterGender === "all" ? "bg-primary-50" : ""}
                  >
                    All Candidates
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilterGender("male")}
                    className={filterGender === "male" ? "bg-primary-50" : ""}
                  >
                    Male Candidates
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilterGender("female")}
                    className={filterGender === "female" ? "bg-primary-50" : ""}
                  >
                    Female Candidates
                  </Button>
                </div>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  Error loading assessment data
                </div>
              ) : (
                <div className="overflow-auto">
                  {filteredPoolCandidates?.length ? (
                    <PoolCandidatesTable candidates={filteredPoolCandidates} />
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No THM pool candidates found
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Assessment Detail Modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedAssessment && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">Assessment Details</DialogTitle>
                <DialogDescription>
                  {selectedAssessment.name} - {formatDate(selectedAssessment.timestamp)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                {/* Demographic Information */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">User Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Name:</div>
                      <div>{selectedAssessment.name}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Email:</div>
                      <div>{selectedAssessment.email}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Gender:</div>
                      <div>{selectedAssessment.demographics.gender}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Marriage Status:</div>
                      <div>{selectedAssessment.demographics.marriageStatus}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Desire Children:</div>
                      <div>{selectedAssessment.demographics.desireChildren}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Ethnicity:</div>
                      <div>{selectedAssessment.demographics.ethnicity.split(',').join(', ')}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Book Purchase:</div>
                      <div>{selectedAssessment.demographics.hasPurchasedBook}</div>
                    </div>
                    {selectedAssessment.demographics.purchaseDate && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm font-medium">Purchase Date:</div>
                        <div>{selectedAssessment.demographics.purchaseDate}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Profile Information */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      Psychographic Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-lg font-bold text-primary-600 mb-2">
                      {selectedAssessment.profile.name}
                    </div>
                    <div className="text-gray-600">
                      {selectedAssessment.profile.description}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Scores Breakdown */}
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      Score Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="text-center py-4">
                          <span className="text-4xl font-bold">
                            {selectedAssessment.scores.overallPercentage.toFixed(1)}%
                          </span>
                          <p className="text-sm text-gray-500">Overall Score</p>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Total Earned: {selectedAssessment.scores.totalEarned}</div>
                          <div className="text-sm font-medium">Total Possible: {selectedAssessment.scores.totalPossible}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium mb-2">Section Scores:</h4>
                        {Object.entries(selectedAssessment.scores.sections).map(([section, score]) => {
                          const sectionScore = score as SectionScore;
                          return (
                            <div key={section} className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-sm">{section}</span>
                                <span className="text-sm font-medium">
                                  {sectionScore.percentage.toFixed(1)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className="bg-primary h-1.5 rounded-full" 
                                  style={{ width: `${sectionScore.percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDetailModalOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}