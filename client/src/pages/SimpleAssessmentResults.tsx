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
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";

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
}

export default function SimpleAssessmentResults() {
  const [assessments, setAssessments] = useState<AssessmentResultData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      // Fetch all assessments without date filtering
      const response = await fetch("/api/admin/assessments");
      
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

  return (
    <div className="container py-10">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assessment Results</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all assessment results
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin">Back to Dashboard</Link>
        </Button>
      </div>

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
              {error}
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