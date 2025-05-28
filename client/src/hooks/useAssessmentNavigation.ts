import { useCallback } from 'react';

interface UseAssessmentNavigationProps {
  currentIndex: number;
  totalQuestions: number;
  onNext: () => void;
  onPrevious: () => void;
  onSave?: () => void;
  onSubmit?: () => void;
}

export function useAssessmentNavigation({
  currentIndex,
  totalQuestions,
  onNext,
  onPrevious,
  onSave,
  onSubmit
}: UseAssessmentNavigationProps) {
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const progressPercentage = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const handleNext = useCallback(() => {
    if (isLastQuestion) {
      onSubmit?.();
    } else {
      onNext();
    }
  }, [isLastQuestion, onNext, onSubmit]);

  const handlePrevious = useCallback(() => {
    if (!isFirstQuestion) {
      onPrevious();
    }
  }, [isFirstQuestion, onPrevious]);

  const handleSave = useCallback(() => {
    onSave?.();
  }, [onSave]);

  return {
    isFirstQuestion,
    isLastQuestion,
    progressPercentage,
    handleNext,
    handlePrevious,
    handleSave
  };
}