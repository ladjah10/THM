import { Question, UserResponse } from "@/types/assessment";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useCallback, useMemo } from "react";
import { Progress } from "@/components/ui/progress";

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
  // Memoized option selection handler to prevent re-renders
  const handleOptionChange = useCallback((option: string) => {
    // Find the option index for consistent scoring
    const optionIndex = (question.options || []).indexOf(option);
    let value: number;
    
    if (question.type === "M") {
      // Multiple choice questions use option index + 1 for consistent scoring
      value = optionIndex + 1;
    } else if (question.type === "D") {
      // Declaration questions: affirmative gets full weight, antithesis gets 0
      if (option === "I do not agree with this statement") {
        value = 0;
      } else {
        value = question.weight || 1;
      }
    } else {
      value = question.weight || 1;
    }
    
    // Pass the question ID directly as it is (Q1, Q2, etc.)
    onOptionSelect(question.id, option, value);
  }, [question.id, question.type, question.weight, question.options, onOptionSelect]);

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    return Math.round(((questionIndex + 1) / totalQuestions) * 100);
  }, [questionIndex, totalQuestions]);

  // Memoized options to prevent unnecessary re-renders with null safety
  const memoizedOptions = useMemo(() => 
    (question.options || []).map((option, index) => {
      const uniqueOptionId = `q${question.id}-opt${index}`;
      return { option, index, uniqueOptionId };
    }), 
    [question.options, question.id]
  );

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
        <div className="flex items-center justify-between mt-2 mb-3">
          <p className="text-sm text-gray-600">Question {questionIndex + 1} of {totalQuestions}</p>
          <div className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
            {question.type === "M" ? "Multiple Choice" : "Declaration"}
          </div>
        </div>
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Progress</span>
            <span>{progressPercentage}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      <div className="mb-8">
        <p className="text-lg mb-6 text-gray-800 leading-relaxed">{question.text}</p>

        <RadioGroup 
          value={selectedOption} 
          onValueChange={handleOptionChange} 
          className="space-y-4"
        >
          {memoizedOptions.map(({ option, index, uniqueOptionId }) => (
            <div 
              key={uniqueOptionId} 
              className="flex items-start space-x-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
            >
              <RadioGroupItem id={uniqueOptionId} value={option} className="mt-0.5" />
              <Label 
                htmlFor={uniqueOptionId} 
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
          onClick={() => {
            if (isLastQuestion) {
              if (typeof onSubmitAssessment === "function") {
                onSubmitAssessment();
              } else {
                console.warn("onSubmitAssessment not defined");
              }
            } else {
              onNextQuestion();
            }
          }}
          disabled={!selectedOption}
          className="px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white"
        >
          {isLastQuestion ? "Submit" : "Next →"}
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
