import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Redirect } from "wouter";

export default function AuthPage() {
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if already authenticated
  if (!isLoading && isAuthenticated) {
    return <Redirect to="/" />;
  }

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Login Form */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-blue-900">
              Welcome to The 100 Marriage Assessment
            </CardTitle>
            <CardDescription>
              Sign in to start or continue your assessment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              Sign in with Replit
            </Button>
            <p className="text-sm text-gray-600 text-center">
              Your progress will be automatically saved and you can resume anytime
            </p>
          </CardContent>
        </Card>

        {/* Hero Section */}
        <div className="flex flex-col justify-center space-y-6">
          <h1 className="text-4xl font-bold text-blue-900">
            Discover Your Marriage Readiness
          </h1>
          <p className="text-lg text-gray-700">
            Take Lawrence Adjah's comprehensive 99-question assessment to understand your compatibility and relationship foundation.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>Individual Assessment ($49)</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>Couple Assessment ($79)</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>Marriage Pool Matching ($25)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}