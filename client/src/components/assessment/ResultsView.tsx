import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { AssessmentScores, DemographicData, UserProfile } from "@/types/assessment";

interface ResultsViewProps {
  scores: AssessmentScores;
  profile: UserProfile;
  demographics: DemographicData;
  onSendEmail: () => void;
  onRetakeAssessment: () => void;
  emailSending: boolean;
}

export default function ResultsView({
  scores,
  profile,
  demographics,
  onSendEmail,
  onRetakeAssessment,
  emailSending
}: ResultsViewProps) {
  const [userEmail, setUserEmail] = useState(demographics.email);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-100">
      <div className="mb-8 text-center pb-6 border-b border-gray-100">
        <h3 className="text-2xl font-semibold text-blue-900 mb-2">Your Marriage Assessment Results</h3>
        <p className="text-gray-600">
          Based on your responses to The 100 Marriage Assessment questions by Lawrence E. Adjah
        </p>
      </div>

      {/* Overall Score */}
      <div className="mb-10">
        <h4 className="text-xl font-medium text-blue-900 mb-5 text-center">Overall Compatibility Score</h4>
        <div className="flex items-center justify-center">
          <div className="w-52 h-52 rounded-full flex flex-col items-center justify-center border-8 border-blue-500 relative shadow-lg">
            <div className="text-5xl font-bold text-blue-600">{scores.overallPercentage}%</div>
            <div className="text-base font-medium text-gray-700 mt-1">
              {scores.overallPercentage >= 80 
                ? "Highly Compatible" 
                : scores.overallPercentage >= 60 
                ? "Compatible"
                : scores.overallPercentage >= 40
                ? "Moderately Compatible"
                : "Less Compatible"}
            </div>
          </div>
        </div>
      </div>

      {/* Psychographic Profile */}
      <div className="mb-10">
        <h4 className="text-xl font-medium text-blue-900 mb-4">Your Psychographic Profile</h4>
        <div className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-lg border border-blue-100 shadow-sm">
          <p className="font-semibold text-lg text-blue-800 mb-3">{profile.name}</p>
          <p className="text-gray-700 leading-relaxed">{profile.description}</p>
        </div>
      </div>

      {/* Section Scores */}
      <div className="mb-10 p-6 bg-white rounded-lg border border-gray-100 shadow-sm">
        <h4 className="text-xl font-medium text-blue-900 mb-5">Section Scores</h4>
        <div className="space-y-6">
          {Object.entries(scores.sections).map(([section, { percentage }]) => (
            <div key={section}>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-800">{section}</span>
                <span className="font-medium text-blue-700">{percentage}%</span>
              </div>
              <Progress value={percentage} className="h-3" />
            </div>
          ))}
        </div>
      </div>

      {/* Areas of Strength and Growth */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Areas of Strength */}
        <div className="bg-gradient-to-r from-amber-50 to-white p-6 rounded-lg border border-amber-100 shadow-sm">
          <h4 className="text-xl font-medium text-amber-800 mb-4">Areas of Strength</h4>
          <ul className="space-y-3 text-gray-700">
            {scores.strengths.map((strength, index) => (
              <li key={index} className="flex items-start">
                <svg className="h-5 w-5 mr-2 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for Growth */}
        <div className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-lg border border-blue-100 shadow-sm">
          <h4 className="text-xl font-medium text-blue-800 mb-4">Areas for Growth</h4>
          <ul className="space-y-3 text-gray-700">
            {scores.improvementAreas.map((area, index) => (
              <li key={index} className="flex items-start">
                <svg className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Email Results Section */}
      <div className="mb-10 bg-gradient-to-r from-blue-50 to-white p-6 rounded-lg border border-blue-100 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
          <div className="w-16 h-16 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div>
            <h4 className="text-xl font-medium text-blue-900 mb-1">Send Your Detailed Results</h4>
            <p className="text-gray-600">
              Receive your comprehensive PDF report with personalized insights. A copy will also be sent to Lawrence Adjah for consultation purposes.
            </p>
          </div>
        </div>
        
        <div className="flex">
          <Input
            type="email"
            placeholder="Confirm your email address"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="flex-1 rounded-r-none border-blue-200 focus:ring-blue-500"
          />
          <Button 
            className="rounded-l-none bg-blue-600 hover:bg-blue-500"
            onClick={onSendEmail}
            disabled={!userEmail || emailSending}
          >
            {emailSending ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Sending PDF...</span>
              </div>
            ) : (
              "Email My PDF Report"
            )}
          </Button>
        </div>
      </div>

      {/* Book Reference */}
      <div className="mb-10 pt-6 pb-8 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-32 flex-shrink-0">
          <img 
            src="/attached_assets/image_1744661653587.png" 
            alt="The 100 Marriage Book Cover" 
            className="h-auto w-full shadow-sm rounded-sm"
          />
        </div>
        <div>
          <h4 className="text-lg font-medium text-blue-900 mb-2">Based on the Best-Selling Book</h4>
          <p className="text-gray-600 mb-4">
            This assessment is inspired by <em>The 100 Marriage</em> by Lawrence E. Adjah—designed to help you avoid misaligned expectations that can destroy your forever.
          </p>
          <div className="flex flex-wrap gap-3">
            <a 
              href="https://lawrenceadjah.com/the100marriagebook" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-amber-300 bg-amber-50 text-amber-800 rounded-md text-sm hover:bg-amber-100 transition-colors"
            >
              Purchase the Book
            </a>
            <a 
              href="https://lawrence-adjah.clientsecure.me/request/service" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-blue-300 bg-blue-50 text-blue-800 rounded-md text-sm hover:bg-blue-100 transition-colors"
            >
              Schedule a Consultation
            </a>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <Button 
          variant="outline" 
          className="px-5 py-3 text-sm font-medium border-blue-200 text-blue-700 hover:bg-blue-50"
          onClick={onRetakeAssessment}
        >
          Retake Assessment
        </Button>
        <Button
          className="px-5 py-3 text-sm font-medium bg-amber-500 hover:bg-amber-400 text-white"
          onClick={() => window.open('https://lawrenceadjah.com/the100marriagebook', '_blank')}
        >
          Learn More About The 100 Marriage Book
        </Button>
      </div>
    </div>
  );
}
