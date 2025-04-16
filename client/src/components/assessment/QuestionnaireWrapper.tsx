import React, { useState } from 'react';
import { questions, sections } from '@/data/questionsData';
import { calculateScores, determineProfiles } from '@/utils/scoringUtils';
import { DemographicData } from '@/types/assessment';
import QuestionnaireView from './QuestionnaireView';
import QuestionnaireNavigation from './QuestionnaireNavigation';
import QuestionnaireProgress from './QuestionnaireProgress';

interface QuestionnaireWrapperProps {
  demographics: DemographicData;
  onComplete: (
    responses: Record<number, { option: string, value: number }>,
    calculatedScores: any,
    mainProfile: any,
    genderSpecificProfile: any
  ) => void;
}

export default function QuestionnaireWrapper({
  demographics,
  onComplete
}: QuestionnaireWrapperProps) {
  // State management for questionnaire
  const [userResponses, setUserResponses] = useState<Record<number, { option: string, value: number }>>({});
  const [currentSection, setCurrentSection] = useState(sections[0]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Calculate derived state
  const sectionsQuestions = questions.filter(q => q.section === currentSection);
  const currentQuestion = sectionsQuestions[currentQuestionIndex];
  const answeredQuestions = Object.keys(userResponses).length;
  const totalQuestions = questions.length;
  const progress = Math.round((answeredQuestions / totalQuestions) * 100);
  
  // Handle option selection
  const handleOptionSelect = (questionId: number, option: string, value: number) => {
    setUserResponses({
      ...userResponses,
      [questionId]: { option, value }
    });
  };
  
  // Handle navigation between questions
  const handleNextQuestion = () => {
    if (currentQuestionIndex < sectionsQuestions.length - 1) {
      // Move to next question in current section
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Find the next section or finish
      const currentSectionIndex = sections.indexOf(currentSection);
      
      if (currentSectionIndex < sections.length - 1) {
        // Move to first question of next section
        setCurrentSection(sections[currentSectionIndex + 1]);
        setCurrentQuestionIndex(0);
      } else {
        // Finished with all sections, calculate results
        const scores = calculateScores(questions, userResponses);
        const { primaryProfile, genderProfile } = determineProfiles(scores, demographics.gender);
        
        // Call the onComplete callback with results
        onComplete(userResponses, scores, primaryProfile, genderProfile);
      }
    }
  };
  
  // Handle going back to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      // Go back to previous question in current section
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      // Find the previous section
      const currentSectionIndex = sections.indexOf(currentSection);
      
      if (currentSectionIndex > 0) {
        // Move to last question of previous section
        const prevSection = sections[currentSectionIndex - 1];
        setCurrentSection(prevSection);
        
        // Get the questions of previous section and set index to last question
        const prevSectionQuestions = questions.filter(q => q.section === prevSection);
        setCurrentQuestionIndex(prevSectionQuestions.length - 1);
      }
      // If it's the first question of the first section, there's no previous
    }
  };
  
  // Handle section change
  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
    setCurrentQuestionIndex(0);
  };
  
  if (!currentQuestion) {
    return <div>Loading questions...</div>;
  }
  
  return (
    <div className="space-y-8">
      <QuestionnaireProgress 
        current={answeredQuestions} 
        total={totalQuestions} 
        percent={progress} 
      />
      
      <QuestionnaireNavigation 
        sections={sections} 
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
      />
      
      <QuestionnaireView 
        question={currentQuestion}
        onOptionSelect={handleOptionSelect}
        onNextQuestion={handleNextQuestion}
        onPreviousQuestion={handlePreviousQuestion}
        selectedOption={userResponses[currentQuestion.id]?.option}
        isFirstQuestion={currentQuestionIndex === 0 && sections.indexOf(currentSection) === 0}
        questionIndex={questions.findIndex(q => q.id === currentQuestion.id)}
        totalQuestions={totalQuestions}
      />
    </div>
  );
}