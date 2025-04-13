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
  isFirstQuestion: boolean;
  questionIndex: number;
  totalQuestions: number;
}

export default function QuestionnaireView({
  question,
  selectedOption,
  onOptionSelect,
  onNextQuestion,
  onPreviousQuestion,
  isFirstQuestion,
  questionIndex,
  totalQuestions
}: QuestionnaireViewProps) {
  // Handle option selection
  const handleOptionChange = (option: string) => {
    // For multiple choice questions, the value is fixed (1)
    // For declarations, we use the weight provided
    const value = question.type === "M" ? 1 : question.weight || 1;
    onOptionSelect(question.id, option, value);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {question.subsection ? `${question.section}: ${question.subsection}` : question.section}
        </h3>
        <p className="text-sm text-gray-500">Question {questionIndex + 1} of {totalQuestions}</p>
      </div>

      <div className="mb-6">
        <p className="text-base mb-4">{question.text}</p>

        <RadioGroup 
          value={selectedOption} 
          onValueChange={handleOptionChange} 
          className="space-y-3"
        >
          {question.options.map((option, index) => (
            <div key={index} className="flex items-start space-x-2">
              <RadioGroupItem id={`option-${index}`} value={option} className="mt-1" />
              <Label htmlFor={`option-${index}`} className="font-normal text-sm text-gray-700">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPreviousQuestion}
          disabled={isFirstQuestion}
          className="px-4 py-2 text-sm font-medium"
        >
          Previous
        </Button>
        <Button
          onClick={onNextQuestion}
          disabled={!selectedOption}
          className="px-4 py-2 text-sm font-medium"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
