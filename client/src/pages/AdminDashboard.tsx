import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { AssessmentScores, UserProfile, DemographicData, AssessmentResult, SectionScore } from "@/types/assessment";
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

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState<"all" | "male" | "female">("all");
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentResult | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

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
  
  // Handle viewing assessment details
  const handleViewDetails = (assessment: AssessmentResult) => {
    setSelectedAssessment(assessment);
    setDetailModalOpen(true);
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
            <TabsTrigger value="matching">THM Pool Matching</TabsTrigger>
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