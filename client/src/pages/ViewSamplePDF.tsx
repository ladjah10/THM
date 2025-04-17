import React from 'react';

export default function ViewSamplePDF() {
  return (
    <div className="flex flex-col items-center p-5">
      <h1 className="text-2xl font-bold text-purple-700 mb-5">
        Sample Couple Assessment PDF Report
      </h1>
      <p className="text-gray-700 mb-5">
        This is a sample of the improved couple assessment PDF report with:
      </p>
      <ul className="list-disc ml-5 mb-5 text-gray-600">
        <li>Fixed percentage displays (whole numbers only)</li>
        <li>Improved layout with better spacing</li>
        <li>Enhanced compatibility score section</li>
        <li>Better profile visualization</li>
        <li>Improved book promotion section</li>
      </ul>
      <div className="border border-gray-300 shadow-lg rounded-lg overflow-hidden w-full max-w-4xl h-[800px]">
        <object
          data="/couple-assessment-sample.pdf"
          type="application/pdf"
          width="100%"
          height="100%"
        >
          <p>
            Your browser doesn't support PDF preview. 
            <a href="/couple-assessment-sample.pdf" className="text-blue-600 underline" download>
              Download the PDF
            </a> instead.
          </p>
        </object>
      </div>
      <a 
        href="/couple-assessment-sample.pdf" 
        className="mt-5 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        download
      >
        Download PDF
      </a>
    </div>
  );
}