import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { AssessmentScores, DemographicData, UserProfile } from "@/types/assessment";
import { ComparativeStats } from "./ComparativeStats";

interface ResultsViewProps {
  scores: AssessmentScores;
  primaryProfile: UserProfile;
  genderProfile: UserProfile | null;
  demographics: DemographicData;
  onSendEmail: () => void;
  onRetakeAssessment: () => void;
  emailSending: boolean;
}

export default function ResultsView({
  scores,
  primaryProfile,
  genderProfile,
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
        <h4 className="text-xl font-medium text-blue-900 mb-5 text-center">Overall Assessment Score</h4>
        <div className="flex items-center justify-center">
          <div className="w-52 h-52 rounded-full flex flex-col items-center justify-center border-8 border-blue-500 relative shadow-lg">
            <div className="text-5xl font-bold text-blue-600">{scores.overallPercentage}%</div>
            <div className="text-base font-medium text-gray-700 mt-1">
              {scores.overallPercentage >= 80 
                ? "Traditional Approach" 
                : scores.overallPercentage >= 60 
                ? "Balanced Approach"
                : scores.overallPercentage >= 40
                ? "Less Traditional Approach"
                : "Highly Non-Traditional"}
            </div>
          </div>
        </div>
        
        <div className="max-w-2xl mx-auto mt-6 text-center text-gray-600 text-sm">
          <p className="mb-2">Your score reflects how you responded to the assessment questions, not a judgment of readiness. 
          Higher percentages indicate alignment with traditional marriage values, while lower percentages suggest 
          less traditional approaches. Neither is inherently better—just different expectations.</p>
          
          <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mt-4 text-left">
            <h5 className="font-medium text-blue-800 mb-2">For Couples: The Value of Comparison</h5>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>The most important consideration is how your assessment compares with your spouse or someone you're discerning marriage with.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Both spouses should take their own individual assessment and compare overall percentages.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>The closer your percentage scores align, the more aligned your expectations will be in marriage.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Using your individual results, you can discuss areas of difference and find common ground.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Psychographic Profiles */}
      <div className="mb-10">
        <h4 className="text-xl font-medium text-blue-900 mb-4">Your Psychographic Profiles</h4>
        
        {/* Primary Profile */}
        <div className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-lg border border-blue-100 shadow-sm mb-6">
          <div className="flex items-start mb-4">
            {primaryProfile.iconPath && (
              <div className="mr-4 flex-shrink-0">
                <img 
                  src={primaryProfile.iconPath} 
                  alt={primaryProfile.name}
                  className="w-24 h-24 object-contain rounded-full border-2 border-blue-100"
                />
              </div>
            )}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-3">
                <p className="font-semibold text-lg text-blue-800">{primaryProfile.name}</p>
                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">General Profile</span>
              </div>
              <p className="text-gray-700 leading-relaxed">{primaryProfile.description}</p>
            </div>
          </div>
        </div>
        
        {/* Gender-Specific Profile (if available) */}
        {genderProfile && (
          <div className="bg-gradient-to-r from-purple-50 to-white p-6 rounded-lg border border-purple-100 shadow-sm">
            <div className="flex items-start mb-4">
              {genderProfile.iconPath && (
                <div className="mr-4 flex-shrink-0">
                  <img 
                    src={genderProfile.iconPath} 
                    alt={genderProfile.name}
                    className="w-24 h-24 object-contain rounded-full border-2 border-purple-100"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-3">
                  <p className="font-semibold text-lg text-purple-800">{genderProfile.name}</p>
                  <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full">
                    {demographics.gender === 'male' ? 'Male-Specific Profile' : 'Female-Specific Profile'}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">{genderProfile.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section Scores */}
      <div className="mb-10 p-6 bg-white rounded-lg border border-gray-100 shadow-sm">
        <h4 className="text-xl font-medium text-blue-900 mb-5">Section Scores</h4>
        <p className="mb-4 text-gray-600 text-sm">
          Each section score reflects your perspective in a specific relationship area. These scores provide insights 
          into your relationship approach and help determine your psychographic profiles. Higher percentages typically 
          indicate traditional views, while lower percentages suggest less traditional approaches.
        </p>
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

      {/* Compatibility Match Section */}
      <div className="mb-10 bg-gradient-to-r from-slate-50 to-white p-6 rounded-lg border border-slate-100 shadow-sm">
        <h4 className="text-xl font-medium text-blue-900 mb-4">Your Compatibility Profile</h4>
        
        <p className="text-gray-700 mb-4">
          Based on your psychographic profile, we've identified the types of people you'd likely be most compatible with. 
          Closer alignment in expectations suggests better compatibility, but isn't mandatory for a successful relationship.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse mb-4">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-200 px-3 py-2 text-left text-sm text-slate-700">Compatibility Type</th>
                <th className="border border-slate-200 px-3 py-2 text-left text-sm text-slate-700">Ideal Match</th>
                <th className="border border-slate-200 px-3 py-2 text-left text-sm text-slate-700">Next-Best Matches</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-200 px-3 py-2 font-medium">Unisex Profile Match</td>
                <td className="border border-slate-200 px-3 py-2">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {primaryProfile.name}
                  </span>
                </td>
                <td className="border border-slate-200 px-3 py-2">
                  {primaryProfile.name === "Steadfast Believers" && (
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-full">Harmonious Planners</span>
                      <span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-full">Balanced Visionaries</span>
                    </div>
                  )}
                  {primaryProfile.name === "Harmonious Planners" && (
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-full">Steadfast Believers</span>
                      <span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-full">Balanced Visionaries</span>
                    </div>
                  )}
                  {primaryProfile.name === "Flexible Faithful" && (
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-full">Balanced Visionaries</span>
                      <span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-full">Pragmatic Partners</span>
                    </div>
                  )}
                  {primaryProfile.name === "Pragmatic Partners" && (
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-full">Flexible Faithful</span>
                      <span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-full">Individualist Seekers</span>
                    </div>
                  )}
                  {primaryProfile.name === "Individualist Seekers" && (
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-full">Pragmatic Partners</span>
                      <span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-full">Flexible Faithful</span>
                    </div>
                  )}
                  {primaryProfile.name === "Balanced Visionaries" && (
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-full">Harmonious Planners</span>
                      <span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-full">Flexible Faithful</span>
                    </div>
                  )}
                </td>
              </tr>
              {genderProfile && (
                <tr>
                  <td className="border border-slate-200 px-3 py-2 font-medium">
                    {demographics.gender === 'female' ? 'Female-Specific Match' : 'Male-Specific Match'}
                  </td>
                  <td className="border border-slate-200 px-3 py-2">
                    {demographics.gender === 'female' && genderProfile.name === "Relational Nurturers" && (
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Faithful Protectors</span>
                    )}
                    {demographics.gender === 'female' && genderProfile.name === "Adaptive Communicators" && (
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Structured Leaders</span>
                    )}
                    {demographics.gender === 'female' && genderProfile.name === "Independent Traditionalists" && (
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Balanced Providers</span>
                    )}
                    {demographics.gender === 'female' && genderProfile.name === "Faith-Centered Homemakers" && (
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Faithful Protectors</span>
                    )}
                    {demographics.gender === 'male' && genderProfile.name === "Faithful Protectors" && (
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Faith-Centered Homemakers</span>
                    )}
                    {demographics.gender === 'male' && genderProfile.name === "Structured Leaders" && (
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Adaptive Communicators</span>
                    )}
                    {demographics.gender === 'male' && genderProfile.name === "Balanced Providers" && (
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Independent Traditionalists</span>
                    )}
                  </td>
                  <td className="border border-slate-200 px-3 py-2">
                    {demographics.gender === 'female' && genderProfile.name === "Relational Nurturers" && (
                      <div className="flex flex-wrap gap-1">
                        <span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-full">Balanced Providers</span>
                        <span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-full">Structured Leaders</span>
                      </div>
                    )}
                    {demographics.gender === 'female' && genderProfile.name === "Adaptive Communicators" && (
                      <div className="flex flex-wrap gap-1">
                        <span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-full">Faithful Protectors</span>
                        <span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-full">Balanced Providers</span>
                      </div>
                    )}
                    {demographics.gender === 'female' && genderProfile.name === "Independent Traditionalists" && (
                      <div className="flex flex-wrap gap-1">
                        <span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-full">Faithful Protectors</span>
                        <span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-full">Structured Leaders</span>
                      </div>
                    )}
                    {demographics.gender === 'female' && genderProfile.name === "Faith-Centered Homemakers" && (
                      <div className="flex flex-wrap gap-1">
                        <span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-full">Balanced Providers</span>
                        <span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-full">Structured Leaders</span>
                      </div>
                    )}
                    {demographics.gender === 'male' && genderProfile.name === "Faithful Protectors" && (
                      <div className="flex flex-wrap gap-1">
                        <span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-full">Relational Nurturers</span>
                        <span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-full">Independent Traditionalists</span>
                      </div>
                    )}
                    {demographics.gender === 'male' && genderProfile.name === "Structured Leaders" && (
                      <div className="flex flex-wrap gap-1">
                        <span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-full">Relational Nurturers</span>
                        <span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-full">Faith-Centered Homemakers</span>
                      </div>
                    )}
                    {demographics.gender === 'male' && genderProfile.name === "Balanced Providers" && (
                      <div className="flex flex-wrap gap-1">
                        <span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-full">Faith-Centered Homemakers</span>
                        <span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-full">Relational Nurturers</span>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
          <h5 className="font-medium text-blue-800 mb-2">Implications for Your Relationships</h5>
          {primaryProfile.name === "Steadfast Believers" && (
            <p className="text-gray-700 text-sm">
              Your strong faith and traditional values mean you'll thrive with someone who shares your spiritual commitment and family focus. 
              Expectation alignment is highest with other Steadfast Believers, but Harmonious Planners and Balanced Visionaries can 
              also complement your values if faith is openly discussed.
            </p>
          )}
          {primaryProfile.name === "Harmonious Planners" && (
            <p className="text-gray-700 text-sm">
              You value structure and faith, so you'll connect best with partners who share your planning mindset. 
              Harmonious Planners are your ideal match, while Steadfast Believers and Balanced Visionaries offer 
              similar alignment with slight variations in emphasis.
            </p>
          )}
          {primaryProfile.name === "Flexible Faithful" && (
            <p className="text-gray-700 text-sm">
              Your balance of faith and adaptability makes you a versatile partner. Flexible Faithful matches align best, 
              but Balanced Visionaries and Pragmatic Partners can complement your communication focus with mutual respect.
            </p>
          )}
          {primaryProfile.name === "Pragmatic Partners" && (
            <p className="text-gray-700 text-sm">
              You prioritize practicality and communication, so you'll thrive with partners who value fairness. 
              Pragmatic Partners are ideal, while Flexible Faithful and Individualist Seekers can align on 
              practicality with less faith intensity.
            </p>
          )}
          {primaryProfile.name === "Individualist Seekers" && (
            <p className="text-gray-700 text-sm">
              Your focus on independence means you'll connect with partners who respect autonomy. 
              Individualist Seekers are your best match, while Pragmatic Partners and Flexible Faithful 
              can offer complementary practicality and adaptability.
            </p>
          )}
          {primaryProfile.name === "Balanced Visionaries" && (
            <p className="text-gray-700 text-sm">
              Your balanced approach to faith and practicality pairs well with similar mindsets. 
              Balanced Visionaries are ideal, while Harmonious Planners and Flexible Faithful share 
              your values with slight variations.
            </p>
          )}
          {genderProfile && demographics.gender === 'female' && genderProfile.name === "Relational Nurturers" && (
            <p className="text-gray-700 text-sm mt-2">
              <span className="text-purple-800 font-medium">As a Relational Nurturer:</span> Your nurturing nature thrives with a partner 
              who values family and faith. A Faithful Protector's leadership aligns best, while Balanced Providers and 
              Structured Leaders offer stability and structure to support your family focus.
            </p>
          )}
          {genderProfile && demographics.gender === 'female' && genderProfile.name === "Adaptive Communicators" && (
            <p className="text-gray-700 text-sm mt-2">
              <span className="text-purple-800 font-medium">As an Adaptive Communicator:</span> Your communication skills pair well with a partner 
              who values clarity. Structured Leaders are ideal, while Faithful Protectors and Balanced Providers 
              complement your faith and balance.
            </p>
          )}
          {genderProfile && demographics.gender === 'female' && genderProfile.name === "Independent Traditionalists" && (
            <p className="text-gray-700 text-sm mt-2">
              <span className="text-purple-800 font-medium">As an Independent Traditionalist:</span> Your blend of tradition and independence matches with a stable partner. 
              Balanced Providers align best, while Faithful Protectors and Structured Leaders share your traditional values.
            </p>
          )}
          {genderProfile && demographics.gender === 'female' && genderProfile.name === "Faith-Centered Homemakers" && (
            <p className="text-gray-700 text-sm mt-2">
              <span className="text-purple-800 font-medium">As a Faith-Centered Homemaker:</span> Your spiritual home focus thrives with a faith-driven partner. 
              Faithful Protectors are ideal, while Balanced Providers and Structured Leaders support your family values.
            </p>
          )}
          {genderProfile && demographics.gender === 'male' && genderProfile.name === "Faithful Protectors" && (
            <p className="text-gray-700 text-sm mt-2">
              <span className="text-purple-800 font-medium">As a Faithful Protector:</span> Your leadership and faith pair well with a spiritually focused partner. 
              Faith-Centered Homemakers align best, while Relational Nurturers and Independent Traditionalists 
              share your family and traditional values.
            </p>
          )}
          {genderProfile && demographics.gender === 'male' && genderProfile.name === "Structured Leaders" && (
            <p className="text-gray-700 text-sm mt-2">
              <span className="text-purple-800 font-medium">As a Structured Leader:</span> Your clarity and structure match with a communicative partner. 
              Adaptive Communicators are ideal, while Relational Nurturers and Faith-Centered Homemakers 
              complement your family focus.
            </p>
          )}
          {genderProfile && demographics.gender === 'male' && genderProfile.name === "Balanced Providers" && (
            <p className="text-gray-700 text-sm mt-2">
              <span className="text-purple-800 font-medium">As a Balanced Provider:</span> Your stability and balance pair well with an independent partner. 
              Independent Traditionalists align best, while Faith-Centered Homemakers and Relational Nurturers 
              support your faith and family priorities.
            </p>
          )}
        </div>
      </div>
      
      {/* Comparative Statistics Section */}
      <div className="mb-10">
        <ComparativeStats scores={scores} demographics={demographics} />
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
