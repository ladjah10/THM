import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface EmailSentConfirmationProps {
  onBackToResults: () => void;
}

export default function EmailSentConfirmation({ onBackToResults }: EmailSentConfirmationProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6 text-center">
      <div className="mb-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="mt-3 text-lg font-medium text-gray-900">Email Sent Successfully!</h3>
        <p className="mt-2 text-sm text-gray-500">
          Your detailed assessment report has been sent to your email. A copy has also been sent to la@lawrenceadjah.com.
        </p>
      </div>
      <Button 
        onClick={onBackToResults}
        className="px-4 py-2 text-sm font-medium"
      >
        Return to Results
      </Button>
    </div>
  );
}
