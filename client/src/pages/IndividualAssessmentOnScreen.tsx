import React from 'react';
import { AssessmentResult } from '@shared/schema';

/**
 * This component displays an individual assessment on screen
 * with the enhanced compatibility match information in the profiles
 */
const IndividualAssessmentOnScreen: React.FC = () => {
  // Sample data matching what we used in our email test
  const assessment: AssessmentResult = {
    email: 'lawrence@lawrenceadjah.com',
    name: 'Lawrence Adjah',
    timestamp: new Date().toISOString(),
    demographics: {
      firstName: 'Lawrence',
      lastName: 'Adjah',
      email: 'lawrence@lawrenceadjah.com',
      lifeStage: 'adult',
      birthday: '1985-06-15',
      gender: 'male',
      marriageStatus: 'married',
      desireChildren: 'yes',
      ethnicity: 'Black/African American',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      hasPurchasedBook: 'yes',
      purchaseDate: '2022-10-15'
    },
    profile: {
      id: 1,
      name: 'Balanced Visionary',
      description: 'You have a thoughtful, balanced approach to marriage. You value both tradition and modern perspectives, seeking harmony between stability and flexibility. Your approach to relationships is both grounded and forward-thinking. You demonstrate wisdom in balancing competing priorities and can typically find common ground with a wide range of personalities.',
      genderSpecific: null,
      criteria: [
        { section: 'Your Foundation', min: 75 },
        { section: 'Your Faith Life', min: 80 }
      ]
    },
    genderProfile: {
      id: 5, 
      name: 'Steadfast Leader',
      description: 'As a male Steadfast Leader, you bring strength, vision, and stability to your relationships. You value commitment deeply and approach marriage with a sense of responsibility and purpose. You tend to be protective of your loved ones and strive to provide security and guidance. Your leadership style is principled yet adaptive to your partner\'s needs.',
      genderSpecific: 'male',
      criteria: [
        { section: 'Your Faith Life', min: 85 },
        { section: 'Your Family Life', min: 80 }
      ],
      iconPath: 'public/icons/steadfast-leader.png'
    },
    scores: {
      overallPercentage: 87,
      totalEarned: 435,
      totalPossible: 500,
      strengths: [
        'Strong faith foundation',
        'Clear communication style',
        'Financial management',
        'Family prioritization',
        'Long-term commitment'
      ],
      improvementAreas: [
        'Work-life balance',
        'Patience during conflicts',
        'Quality time management'
      ],
      sections: {
        'Your Foundation': { earned: 90, possible: 100, percentage: 90 },
        'Your Faith Life': { earned: 95, possible: 100, percentage: 95 },
        'Your Family Life': { earned: 85, possible: 100, percentage: 85 },
        'Your Finances': { earned: 80, possible: 100, percentage: 80 },
        'Your Future': { earned: 85, possible: 100, percentage: 85 }
      }
    },
    responses: {}
  };

  // Calculate score color
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Function to render progress bar
  const renderProgressBar = (percentage: number) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
      <div 
        className="bg-blue-600 h-2.5 rounded-full" 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row items-center mb-8">
          <div className="mb-4 md:mb-0 md:mr-6">
            <img 
              src="https://lawrenceadjah.com/wp-content/uploads/2023/12/The-100-Marriage-Lawrence-Adjah-Christian-Faith-Based-Books-Marriage-Books-on-Amazon-Relationship-Books-Best-Sellers.png" 
              alt="The 100 Marriage" 
              className="w-32"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Individual Assessment Results</h1>
            <p className="text-lg text-gray-600">
              {assessment.demographics.firstName} {assessment.demographics.lastName}
            </p>
            <p className="text-sm text-gray-500">
              Assessment Date: {new Date(assessment.timestamp).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Overall Score */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-32 h-32 rounded-full border-8 border-blue-600 flex flex-col items-center justify-center mb-4">
            <span className={`text-4xl font-bold ${getScoreColor(assessment.scores.overallPercentage)}`}>
              {assessment.scores.overallPercentage}%
            </span>
            <span className="text-sm text-gray-600">Overall Score</span>
          </div>
        </div>

        {/* Primary Profile */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Psychographic Profile</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">{assessment.profile.name}</h3>
            <p className="text-gray-700 mb-4">{assessment.profile.description}</p>
            
            {/* New compatibility information */}
            <div className="bg-blue-100 rounded-md p-4 mt-2">
              <h4 className="font-bold text-blue-800 mb-2">Compatibility Information</h4>
              <p><span className="font-semibold">Ideal Match:</span> {assessment.profile.name}</p>
              <p><span className="font-semibold">Next Best Matches:</span> Harmonious Planners, Balanced Visionaries</p>
            </div>
          </div>
        </section>

        {/* Gender-Specific Profile */}
        {assessment.genderProfile && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {assessment.demographics.gender === 'male' ? 'Male' : 'Female'}-Specific Profile
            </h2>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-purple-700 mb-2">{assessment.genderProfile.name}</h3>
              <p className="text-gray-700 mb-4">{assessment.genderProfile.description}</p>
              
              {/* New compatibility information */}
              <div className="bg-purple-100 rounded-md p-4 mt-2">
                <h4 className="font-bold text-purple-800 mb-2">Compatibility Information</h4>
                <p><span className="font-semibold">Ideal Match:</span> {assessment.genderProfile.name}</p>
                <p><span className="font-semibold">Next Best Matches:</span> Flexible Faithful, Pragmatic Partners</p>
              </div>
            </div>
          </section>
        )}

        {/* Section Scores */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Section Scores</h2>
          <div className="grid gap-4">
            {Object.entries(assessment.scores.sections).map(([section, score]) => (
              <div key={section} className="mb-2">
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-gray-700">{section}</span>
                  <span className="font-semibold text-gray-700">{score.percentage}%</span>
                </div>
                {renderProgressBar(score.percentage)}
              </div>
            ))}
          </div>
        </section>

        {/* Strengths */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Strengths</h2>
          <ul className="list-disc pl-5 space-y-2">
            {assessment.scores.strengths.map((strength, index) => (
              <li key={index} className="text-gray-700">{strength}</li>
            ))}
          </ul>
        </section>

        {/* Areas for Growth */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Areas for Growth</h2>
          <ul className="list-disc pl-5 space-y-2">
            {assessment.scores.improvementAreas.map((area, index) => (
              <li key={index} className="text-gray-700">{area}</li>
            ))}
          </ul>
        </section>

        {/* Continue Your Journey */}
        <section className="mt-10 border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Continue Your Journey with The 100 Marriage
          </h2>
          <p className="text-gray-700 mb-6">
            Thank you for completing The 100 Marriage Assessment. Your journey towards a fulfilling 
            relationship is just beginning. Here are some ways to continue:
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-3">The 100 Marriage Book</h3>
              <p className="text-gray-700 mb-4">
                Deepen your understanding with Lawrence Adjah's bestselling book, 
                available on Amazon and other retailers.
              </p>
              <a 
                href="https://lawrenceadjah.com/the100marriagebook" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white font-semibold px-5 py-3 rounded-md hover:bg-blue-700 transition"
              >
                Get the Book
              </a>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Relationship Counseling</h3>
              <p className="text-gray-700 mb-4">
                For personalized guidance, schedule a consultation with Lawrence Adjah 
                to discuss your assessment results.
              </p>
              <a 
                href="https://lawrence-adjah.clientsecure.me" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-purple-600 text-white font-semibold px-5 py-3 rounded-md hover:bg-purple-700 transition"
              >
                Book a Consultation
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t border-gray-200 text-center text-gray-600 text-sm">
          <p>The 100 Marriage | <a href="mailto:hello@wgodw.com" className="text-blue-600">hello@wgodw.com</a> | <a href="https://lawrenceadjah.com" className="text-blue-600">lawrenceadjah.com</a></p>
        </footer>
      </div>
    </div>
  );
};

export default IndividualAssessmentOnScreen;