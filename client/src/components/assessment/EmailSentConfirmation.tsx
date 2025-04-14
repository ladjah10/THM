import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface EmailSentConfirmationProps {
  onBackToResults: () => void;
}

export default function EmailSentConfirmation({ onBackToResults }: EmailSentConfirmationProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-8 text-center max-w-2xl mx-auto border border-gray-100">
      <div className="mb-8">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-semibold text-green-700 mb-4">Email Sent Successfully!</h3>
        <p className="text-gray-600 mb-4">
          Your detailed assessment report with PDF attachment has been sent to your email. A copy has also been sent to Lawrence Adjah for consultation purposes.
        </p>
        <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-700 mb-6">
          <p>
            <span className="font-medium">Next Steps:</span> Check your inbox for your comprehensive report and consider scheduling a consultation with Lawrence Adjah to discuss your results.
          </p>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="w-24 flex-shrink-0">
            <img 
              src="/attached_assets/image_1744661653587.png" 
              alt="The 100 Marriage Book Cover" 
              className="h-auto w-full shadow-sm rounded-sm"
            />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-medium text-blue-900 mb-1">Based on the Best-Selling Book</h4>
            <p className="text-xs text-gray-600 mb-2">
              Learn more about aligning expectations in <em>The 100 Marriage</em> by Lawrence E. Adjah
            </p>
            <a 
              href="https://lawrenceadjah.com/the100marriagebook" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Purchase the book →
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button 
          onClick={onBackToResults}
          className="px-6 py-3 text-sm font-medium bg-blue-600 hover:bg-blue-500"
        >
          Return to Results
        </Button>
        <Button
          variant="outline"
          className="px-6 py-3 text-sm font-medium border-blue-200 text-blue-700"
          onClick={() => window.open('https://lawrence-adjah.clientsecure.me/request/service', '_blank')}
        >
          Schedule a Consultation
        </Button>
      </div>
    </div>
  );
}
