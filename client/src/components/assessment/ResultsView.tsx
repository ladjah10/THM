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
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <div className="mb-6 text-center">
        <h3 className="text-xl font-semibold text-gray-900">Your Marriage Assessment Results</h3>
        <p className="text-sm text-gray-500 mt-1">
          Based on your responses to the 100 Marriage Assessment questions
        </p>
      </div>

      {/* Overall Score */}
      <div className="mb-8">
        <h4 className="text-lg font-medium text-gray-800 mb-3">Overall Compatibility Score</h4>
        <div className="flex items-center justify-center">
          <div className="w-48 h-48 rounded-full flex flex-col items-center justify-center border-8 border-primary-500 relative">
            <div className="text-4xl font-bold text-primary-600">{scores.overallPercentage}%</div>
            <div className="text-sm font-medium text-gray-700">
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
      <div className="mb-8">
        <h4 className="text-lg font-medium text-gray-800 mb-3">Your Psychographic Profile</h4>
        <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
          <p className="font-medium text-primary-800 mb-2">{profile.name}</p>
          <p className="text-sm text-gray-700">{profile.description}</p>
        </div>
      </div>

      {/* Section Scores */}
      <div className="mb-8">
        <h4 className="text-lg font-medium text-gray-800 mb-3">Section Scores</h4>
        <div className="space-y-4">
          {Object.entries(scores.sections).map(([section, { percentage }]) => (
            <div key={section}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{section}</span>
                <span className="text-sm font-medium text-gray-700">{percentage}%</span>
              </div>
              <Progress value={percentage} className="h-2.5" />
            </div>
          ))}
        </div>
      </div>

      {/* Areas of Strength */}
      <div className="mb-8">
        <h4 className="text-lg font-medium text-gray-800 mb-3">Areas of Strength</h4>
        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
          {scores.strengths.map((strength, index) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </div>

      {/* Areas for Growth */}
      <div className="mb-8">
        <h4 className="text-lg font-medium text-gray-800 mb-3">Areas for Growth</h4>
        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
          {scores.improvementAreas.map((area, index) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
      </div>

      {/* Email Results Section */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="text-md font-medium text-gray-800 mb-2">Send Your Results</h4>
        <p className="text-sm text-gray-600 mb-3">
          Enter your email to receive a detailed PDF report. A copy will also be sent to la@lawrenceadjah.com.
        </p>
        
        <div className="flex">
          <Input
            type="email"
            placeholder="Your email address"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="flex-1 rounded-r-none"
          />
          <Button 
            className="rounded-l-none"
            onClick={onSendEmail}
            disabled={!userEmail || emailSending}
          >
            {emailSending ? "Sending..." : "Send Report"}
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="outline" className="px-4 py-2 text-sm font-medium">
          Review Your Answers
        </Button>
        <Button 
          variant="outline" 
          className="px-4 py-2 text-sm font-medium border-primary-300 text-primary-700 hover:bg-primary-50"
          onClick={onRetakeAssessment}
        >
          Retake Assessment
        </Button>
        <Button className="px-4 py-2 text-sm font-medium">
          Schedule Consultation
        </Button>
      </div>
    </div>
  );
}
