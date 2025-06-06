import React from 'react';

export default function SamplesPage() {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold text-primary mb-8 pb-2 border-b">The 100 Marriage Assessment - Sample Templates</h1>
      
      <p className="text-gray-700 mb-4">
        These samples showcase the updated design including psychographic profile icons, 
        dual profile display (both unisex and gender-specific), and enhanced score explanations
        across different formats.
      </p>
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-8">
        <h3 className="text-blue-800 font-medium mb-2">✨ New: Visual Psychographic Profiles</h3>
        <p className="text-gray-700">
          We've enhanced the assessment with visual profile icons that symbolize each psychographic profile type.
          These icons appear alongside profile descriptions in assessment results, emails, and PDF reports,
          creating a more engaging and memorable user experience.
        </p>
      </div>
      
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 mb-8">
        <h3 className="text-purple-800 font-medium mb-2">✨ New: Couple Assessment with Discussion Guide</h3>
        <p className="text-gray-700">
          The couple assessment now includes a special discussion guide section highlighting areas where spouses have
          different responses. This section is integrated with "The 100 Marriage" book promotion to facilitate more
          meaningful discussions between couples.
        </p>
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Individual Assessment Samples</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Sample Results */}
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-all">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Results Page Sample</h2>
          <p className="text-gray-600 mb-4">
            This shows how assessment results appear to users on the website after completing the questionnaire.
          </p>
          <iframe 
            src="/sample-results.html" 
            className="w-full h-96 border border-gray-200 rounded-md mb-4" 
            title="Results Page Sample"
          />
          <a 
            href="/sample-results.html" 
            target="_blank" 
            className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Open in New Tab
          </a>
        </div>
        
        {/* Sample Email */}
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-all">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Email Report Sample</h2>
          <p className="text-gray-600 mb-4">
            This is an example of the email report sent to users (and CC'd to administrators) after assessment completion.
          </p>
          <iframe 
            src="/sample-email.html" 
            className="w-full h-96 border border-gray-200 rounded-md mb-4" 
            title="Email Report Sample"
          />
          <a 
            href="/sample-email.html" 
            target="_blank" 
            className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Open in New Tab
          </a>
        </div>
        
        {/* Sample PDF */}
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-all">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">PDF Report Sample</h2>
          <p className="text-gray-600 mb-4">
            This is a visual representation of the PDF report generated and attached to assessment emails.
          </p>
          <iframe 
            src="/sample-pdf.html" 
            className="w-full h-96 border border-gray-200 rounded-md mb-4" 
            title="PDF Report Sample"
          />
          <a 
            href="/sample-pdf.html" 
            target="_blank" 
            className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Open in New Tab
          </a>
        </div>
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Couple Assessment Sample</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Couple Assessment Report */}
        <div className="md:col-span-2 bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-all">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Couple Assessment Report Sample</h2>
          <p className="text-gray-600 mb-4">
            This shows how the couple assessment report appears, highlighting the compatibility between spouses and areas for discussion.
            Note the new discussion guide section that helps couples use the book to address their differences.
          </p>
          <iframe 
            src="/sample-couple-report.html" 
            className="w-full h-[600px] border border-gray-200 rounded-md mb-4" 
            title="Couple Assessment Report Sample"
          />
          <a 
            href="/sample-couple-report.html" 
            target="_blank" 
            className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Open in New Tab
          </a>
        </div>
      </div>
      
      <p className="text-gray-700 mb-4">
        <strong>Note about score explanations:</strong> We've updated all templates to clarify that:
      </p>
      <ul className="list-disc pl-8 mb-8 text-gray-700 space-y-2">
        <li>Higher percentages indicate more traditional marriage viewpoints</li>
        <li>Lower percentages suggest less traditional approaches</li>
        <li>Neither is inherently better—just different expectations</li>
        <li>The most important consideration is how your assessment compares with your spouse</li>
        <li>Closer percentages indicate better alignment between spouses</li>
      </ul>
    </div>
  );
}