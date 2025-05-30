import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";
// No need for the shared auth hook

interface AssessmentResultData {
  id: string;
  email: string;
  name: string;
  scores: {
    sections: Record<string, { percentage: number }>;
    overallPercentage: number;
  };
  profile: {
    id: string;
    name: string;
  };
  genderProfile?: {
    id: string;
    name: string;
  };
  timestamp: string;
  transactionId?: string;
  coupleId?: string;
  coupleRole?: string;
  reportSent: boolean;
  recalculated?: boolean;
  lastRecalculated?: string;
  originalScore?: number;
}

interface SectionAnalytics {
  sectionName: string;
  average: number;
  count: number;
}

interface AnalyticsData {
  sectionAverages: Record<string, number>;
  profileDistribution: Record<string, number>;
  totalAssessments: number;
}

export default function SimpleAssessmentResults() {
  const [assessments, setAssessments] = useState<AssessmentResultData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState<boolean>(false);
  const [showAnalytics, setShowAnalytics] = useState<boolean>(false);
  const { toast } = useToast();
  // Admin constants
  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "100marriage";
  
  // Track authentication directly with local state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('admin_authenticated') === 'true';
  });
  
  // Authentication states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Only fetch assessments if admin is authenticated
    if (isAuthenticated) {
      fetchAssessments();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Set authentication in localStorage
      localStorage.setItem('admin_authenticated', 'true');
      setIsAuthenticated(true);
      
      toast({
        title: "Logged in successfully",
        description: "You now have access to assessment data",
      });
      fetchAssessments();
    } else {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
  };

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      // Fetch all assessments including recalculated ones, sorted by most recent update
      const response = await fetch("/api/admin/assessments?sortBy=updated");
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch assessments");
      }
      
      const data = await response.json();
      console.log("Fetched assessments:", data);
      
      // Process the data to ensure all assessment properties are properly formatted
      const processedData = Array.isArray(data) ? data.map(assessment => {
        // Ensure scores is an object, not a string
        let scores = assessment.scores;
        if (typeof scores === 'string') {
          try {
            scores = JSON.parse(scores);
          } catch (e) {
            console.error("Error parsing scores JSON:", e);
            scores = { sections: {}, overallPercentage: 0 };
          }
        }
        
        // Ensure profile is an object, not a string
        let profile = assessment.profile;
        if (typeof profile === 'string') {
          try {
            profile = JSON.parse(profile);
          } catch (e) {
            console.error("Error parsing profile JSON:", e);
            profile = { id: "unknown", name: "Unknown Profile" };
          }
        }
        
        // Ensure genderProfile is an object if present, not a string
        let genderProfile = assessment.genderProfile;
        if (typeof genderProfile === 'string') {
          try {
            genderProfile = JSON.parse(genderProfile);
          } catch (e) {
            console.error("Error parsing genderProfile JSON:", e);
            genderProfile = null;
          }
        }
        
        return {
          ...assessment,
          scores,
          profile,
          genderProfile
        };
      }) : [];
      
      console.log("Processed assessments:", processedData);
      setAssessments(processedData);
      setError(null);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      setError(error instanceof Error ? error.message : "Unknown error occurred");
      toast({
        title: "Error",
        description: "Failed to load assessment results. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch (error) {
      return "Invalid date";
    }
  };

  const resendReport = async (email: string) => {
    try {
      const response = await fetch(`/api/admin/resend-report/${email}`, {
        method: "POST",
      });
      
      if (!response.ok) {
        throw new Error("Failed to resend report");
      }
      
      toast({
        title: "Success",
        description: `Report resent to ${email}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to resend report",
        variant: "destructive",
      });
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoadingAnalytics(true);
      const response = await fetch("/api/analytics/sections");
      
      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }
      
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const exportAssessmentData = async (assessmentId: string, email: string) => {
    try {
      const response = await fetch(`/api/assessment/${assessmentId}/export`);
      
      if (!response.ok) {
        throw new Error("Failed to export assessment data");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `assessment-${email.replace('@', '_at_')}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Success",
        description: `Assessment data exported for ${email}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export assessment data",
        variant: "destructive",
      });
    }
  };

  const downloadPDF = async (assessmentId: string, email: string) => {
    try {
      const response = await fetch(`/api/assessment/${assessmentId}/pdf`);
      
      if (!response.ok) {
        throw new Error("Failed to download PDF");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `assessment-report-${email.replace('@', '_at_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Success",
        description: `PDF downloaded for ${email}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download PDF",
        variant: "destructive",
      });
    }
  };

  // Login form for admin authentication
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>
              Login to view and manage assessment results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  className="w-full rounded-md border border-input px-3 py-2"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full rounded-md border border-input px-3 py-2"
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

  // Admin authenticated view with assessment data
  return (
    <div className="container py-10">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assessment Results</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all assessment results
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              setShowAnalytics(!showAnalytics);
              if (!showAnalytics && !analytics) {
                fetchAnalytics();
              }
            }}
          >
            {showAnalytics ? "Hide Analytics" : "Show Analytics"}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = "/admin"}
          >
            Back to Dashboard
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              localStorage.removeItem('admin_authenticated');
              setIsAuthenticated(false);
              toast({
                title: "Logged out",
                description: "You have been logged out successfully",
              });
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      {showAnalytics && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Section Analytics</CardTitle>
            <CardDescription>
              Average scores and distribution across all assessments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingAnalytics ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : analytics ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {analytics.totalAssessments}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Assessments
                    </div>
                  </div>
                  <div className="text-center p-4 bg-secondary/5 rounded-lg">
                    <div className="text-2xl font-bold text-secondary-foreground">
                      {Object.keys(analytics.sectionAverages).length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Active Sections
                    </div>
                  </div>
                  <div className="text-center p-4 bg-accent/5 rounded-lg">
                    <div className="text-2xl font-bold text-accent-foreground">
                      {Object.keys(analytics.profileDistribution).length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Profile Types
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Section Averages</h4>
                  {Object.entries(analytics.sectionAverages).map(([section, average]) => (
                    <div key={section} className="flex justify-between items-center p-2 border rounded">
                      <span className="font-medium">{section}</span>
                      <span className="text-primary font-semibold">{average.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Profile Distribution</h4>
                  {Object.entries(analytics.profileDistribution).map(([profile, count]) => (
                    <div key={profile} className="flex justify-between items-center p-2 border rounded">
                      <span className="font-medium">{profile}</span>
                      <span className="text-secondary-foreground font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No analytics data available
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Assessment Results</CardTitle>
          <CardDescription>
            Displaying {assessments.length} assessments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="bg-destructive/10 p-4 rounded-md text-destructive">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <div>{error}</div>
              </div>
            </div>
          ) : assessments.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <p>No assessment results found.</p>
              <p className="mt-2">
                This could be because no assessments have been completed yet or there might be an issue with the database connection.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Profile</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessments.map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell>{formatDate(assessment.timestamp)}</TableCell>
                      <TableCell>{assessment.name}</TableCell>
                      <TableCell>{assessment.email}</TableCell>
                      <TableCell>
                        {assessment.scores?.overallPercentage
                          ? `${assessment.scores.overallPercentage.toFixed(1)}%`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {assessment.profile?.name || "N/A"}
                        {assessment.genderProfile && (
                          <div className="text-xs text-muted-foreground mt-1">
                            ({assessment.genderProfile.name})
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {assessment.transactionId ? (
                          <span className="text-green-600 font-medium">Paid</span>
                        ) : (
                          <span className="text-amber-600">Unpaid</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resendReport(assessment.email)}
                        >
                          Resend Report
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}