import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Home() {
  const [_, navigate] = useLocation();
  
  // Automatically redirect to assessment page
  useEffect(() => {
    navigate('/assessment');
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <p>Redirecting to the 100 Marriage Assessment...</p>
    </div>
  );
}
