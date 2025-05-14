import { Question, UserResponse } from "@/types/assessment";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface QuestionnaireViewProps {
  question: Question;
  selectedOption?: string;
  onOptionSelect: (questionId: number, option: string, value: number) => void;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  onSaveProgress?: () => void; // New prop for saving progress
  onSubmitAssessment?: () => void; // New prop for final submission
  isFirstQuestion: boolean;
  questionIndex: number;
  totalQuestions: number;
  showSaveButton?: boolean; // Whether to show the save progress button
  isLastQuestion?: boolean; // Whether this is the last section/question
}

export default function QuestionnaireView({
  question,
  selectedOption,
  onOptionSelect,
  onNextQuestion,
  onPreviousQuestion,
  onSaveProgress,
  onSubmitAssessment,
  isFirstQuestion,
  questionIndex,
  totalQuestions,
  showSaveButton = false,
  isLastQuestion = false
}: QuestionnaireViewProps) {
  // Handle option selection
  const handleOptionChange = (option: string) => {
    // For multiple choice questions, the value is fixed (1)
    // For declarations, we use the weight provided
    const value = question.type === "M" ? 1 : question.weight || 1;
    onOptionSelect(question.id, option, value);
  };

  // If this is the final submission screen
  if (isLastQuestion) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-100">
        <div className="mb-6 pb-4 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-blue-900">
            Assessment Complete!
          </h3>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-gray-600">You've answered all {totalQuestions} questions</p>
            <div className="text-xs px-3 py-1 bg-green-50 text-green-700 rounded-full">
              Ready to Submit
            </div>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-lg mb-6 text-gray-800 leading-relaxed">
            Congratulations! You've completed the 100 Marriage Assessment.
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
            <h4 className="font-semibold text-blue-800 mb-2">Next Steps:</h4>
            <ol className="list-decimal ml-5 text-gray-700 space-y-2">
              <li>Click the "Submit Assessment" button below to finalize your assessment</li>
              <li>We'll process your responses and generate your personalized report</li>
              <li>You'll receive your results immediately on screen</li>
              <li>A copy of your results will also be emailed to you for future reference</li>
            </ol>
          </div>
          
          <p className="text-sm text-gray-600 italic">
            This is your final opportunity to review your answers. You can click "Previous" to go back and modify any responses before submitting.
          </p>
        </div>

        <div className="flex justify-between pt-2">
          <Button
            variant="outline"
            onClick={onPreviousQuestion}
            className="px-5 py-2 text-sm font-medium border-blue-200 text-blue-700"
          >
            ← Previous
          </Button>
          
          {/* Save Progress Button */}
          {showSaveButton && onSaveProgress && (
            <Button
              variant="outline"
              onClick={onSaveProgress}
              className="px-5 py-2 text-sm font-medium border-green-200 text-green-700 mx-2"
            >
              💾 Save Progress
            </Button>
          )}
          
          <Button
            onClick={onSubmitAssessment}
            className="px-5 py-2 text-sm font-medium bg-green-600 hover:bg-green-500 text-white"
          >
            Submit Assessment ✓
          </Button>
        </div>
      </div>
    );
  }
  
  // Normal question view
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-100">
      <div className="mb-6 pb-4 border-b border-gray-100">
        <h3 className="text-xl font-semibold text-blue-900">
          {question.subsection ? `${question.section}: ${question.subsection}` : question.section}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm text-gray-600">Question {questionIndex + 1} of {totalQuestions}</p>
          <div className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
            {question.type === "M" ? "Multiple Choice" : "Declaration"}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-lg mb-6 text-gray-800 leading-relaxed">{question.text}</p>

        <RadioGroup 
          value={selectedOption} 
          onValueChange={handleOptionChange} 
          className="space-y-4"
        >
          {question.options.map((option, index) => (
            <div 
              key={index} 
              className="flex items-start space-x-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
            >
              <RadioGroupItem id={`option-${index}`} value={option} className="mt-0.5" />
              <Label 
                htmlFor={`option-${index}`} 
                className="font-normal text-gray-700 cursor-pointer"
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex justify-between pt-2">
        <Button
          variant="outline"
          onClick={onPreviousQuestion}
          disabled={isFirstQuestion}
          className="px-5 py-2 text-sm font-medium border-blue-200 text-blue-700"
        >
          ← Previous
        </Button>
        
        {/* Save Progress Button */}
        {showSaveButton && onSaveProgress && (
          <Button
            variant="outline"
            onClick={onSaveProgress}
            className="px-5 py-2 text-sm font-medium border-green-200 text-green-700 mx-2"
          >
            💾 Save Progress
          </Button>
        )}
        
        <Button
          onClick={onNextQuestion}
          disabled={!selectedOption}
          className="px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white"
        >
          Next →
        </Button>
      </div>
      
      {/* Book Reference */}
      <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center">
        <p className="text-xs text-gray-500 text-center">
          This assessment is based on <em>The 100 Marriage</em> by Lawrence E. Adjah. 
          <a 
            href="https://lawrenceadjah.com/the100marriagebook" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 ml-1"
          >
            Learn more
          </a>
        </p>
      </div>
    </div>
  );
}
