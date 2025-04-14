import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { AssessmentResult } from "../../shared/schema";
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

// Simple admin authentication
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "100marriage";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Query to fetch assessments
  const { data: assessments, isLoading, error } = useQuery<AssessmentResult[]>({
    queryKey: ['/api/admin/assessments'],
    queryFn: async () => {
      // Only fetch if authenticated
      if (!isAuthenticated) return [];
      
      const response = await apiRequest("GET", "/api/admin/assessments");
      
      if (!response.ok) {
        throw new Error("Failed to fetch assessments");
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
  
  // Calculate analytics
  const analytics = {
    totalAssessments: assessments?.length || 0,
    genderDistribution: {
      male: assessments?.filter(a => a.demographics.gender === "male").length || 0,
      female: assessments?.filter(a => a.demographics.gender === "female").length || 0,
    },
    averageScore: assessments?.reduce((sum, assessment) => sum + assessment.scores.overallPercentage, 0) / (assessments?.length || 1) || 0,
    profileDistribution: {} as Record<string, number>
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
      setIsAuthenticated(true);
    } else {
      alert("Invalid credentials");
    }
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
  
  // Handle CSV export
  const handleExportCSV = () => {
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
          <Button variant="outline" onClick={() => setIsAuthenticated(false)}>Logout</Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="analytics" className="space-y-4">
          <TabsList>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="assessments">Assessment Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </TabsContent>
          
          <TabsContent value="assessments" className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <h2 className="text-lg font-medium">Assessment Results</h2>
                
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportCSV}
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
                              <Button variant="outline" size="sm">View Details</Button>
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
        </Tabs>
      </main>
    </div>
  );
}