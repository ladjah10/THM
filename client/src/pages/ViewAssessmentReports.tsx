import React from 'react';

export default function ViewAssessmentReports() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Assessment Reports Preview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Individual Assessment</h2>
          <p className="mb-4">View the updated individual assessment with the new gender comparison format and psychographic profiles section.</p>
          <div className="aspect-w-8 aspect-h-11 mb-4 border border-gray-200">
            <iframe src="/individual-assessment.pdf" className="w-full h-full" />
          </div>
          <div className="flex justify-center">
            <a href="/individual-assessment.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Open PDF in New Tab
            </a>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Couple Assessment</h2>
          <p className="mb-4">View the updated couple assessment with proper name centering and improved formatting.</p>
          <div className="aspect-w-8 aspect-h-11 mb-4 border border-gray-200">
            <iframe src="/realistic-couple-assessment.pdf" className="w-full h-full" />
          </div>
          <div className="flex justify-center">
            <a href="/realistic-couple-assessment.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
              Open PDF in New Tab
            </a>
          </div>
        </div>
      </div>
      
      <div className="mt-12 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Changes Made</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Updated gender comparison section to match the sample report format</li>
          <li>Improved psychographic profiles section with proper icons and match information</li>
          <li>Updated "Continue Your Journey" text with requested wording</li>
          <li>Ensured all content is properly positioned and sized for readability</li>
          <li>Added clear separation between elements to prevent text overlap</li>
        </ul>
      </div>
    </div>
  );
}