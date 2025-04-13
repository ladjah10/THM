import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function Home() {
  const [_, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">100 Marriage Assessment</CardTitle>
          <CardDescription>
            Discover your marriage compatibility and strengths with our comprehensive assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            The 100 Marriage Assessment helps you evaluate your compatibility across key areas including:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Your Foundation</li>
            <li>Faith Life</li>
            <li>Marriage Life</li>
            <li>Parenting</li>
            <li>Financial</li>
            <li>Sexual</li>
          </ul>
          <p className="text-gray-700 font-medium mt-4">
            This assessment takes approximately 30-40 minutes to complete and will provide you with valuable insights about your relationship.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            className="px-8 py-6 text-lg" 
            onClick={() => navigate('/assessment')}
          >
            Start Assessment
          </Button>
        </CardFooter>
      </Card>
      <p className="mt-8 text-sm text-gray-500">© 2025 Lawrence E. Adjah</p>
    </div>
  );
}
