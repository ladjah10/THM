import { useState, useEffect } from "react";
import QuestionnaireProgress from "@/components/assessment/QuestionnaireProgress";
import QuestionnaireNavigation from "@/components/assessment/QuestionnaireNavigation";
import QuestionnaireView from "@/components/assessment/QuestionnaireView";
import DemographicView from "@/components/assessment/DemographicView";
import PaywallView from "@/components/assessment/PaywallView";
import ResultsView from "@/components/assessment/ResultsView";
import EmailSentConfirmation from "@/components/assessment/EmailSentConfirmation";
import { questions, sections } from "@/data/questionsData";
import { calculateScores, determineProfile } from "@/utils/scoringUtils";
import { sendEmailReport } from "@/utils/emailUtils";
import { 
  Question, 
  UserResponse, 
  DemographicData, 
  AssessmentScores,
  UserProfile 
} from "@/types/assessment";
import { toast } from "@/hooks/use-toast";
import { initializeProtection } from "@/utils/protectionUtils";

type View = "paywall" | "demographics" | "questionnaire" | "results" | "emailSent";

export default function MarriageAssessment() {
  // Force paywall to appear first
  const [currentView, setCurrentView] = useState<View>("paywall");
  const [currentSection, setCurrentSection] = useState(sections[0]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState<Record<number, UserResponse>>({});
  const [demographicData, setDemographicData] = useState<DemographicData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    marriageStatus: "",
    desireChildren: "",
    ethnicity: "",
    hasPurchasedBook: "",
    purchaseDate: "",
    promoCode: "",
    hasPaid: false
  });
  const [scores, setScores] = useState<AssessmentScores | null>(null);
  const [primaryProfile, setPrimaryProfile] = useState<UserProfile | null>(null);
  const [genderProfile, setGenderProfile] = useState<UserProfile | null>(null);
  const [emailSending, setEmailSending] = useState(false);

  // Initialize protection utilities and show paywall first
  useEffect(() => {
    console.log("Setting up assessment with paywall first");
    initializeProtection();
    setCurrentView("paywall");
  }, []);

  // Filter questions by current section
  const sectionQuestions = questions.filter(q => q.section === currentSection);
  const currentQuestion = sectionQuestions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const answeredQuestions = Object.keys(userResponses).length;
  const progress = Math.round((answeredQuestions / totalQuestions) * 100);

  // Handle navigation between sections
  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
    setCurrentQuestionIndex(0);
  };

  // Handle selection of an answer option
  const handleOptionSelect = (questionId: number, option: string, value: number) => {
    setUserResponses(prev => ({
      ...prev,
      [questionId]: { option, value }
    }));
  };

  // Navigate to next question or section
  const handleNextQuestion = () => {
    if (currentQuestionIndex < sectionQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Find next section
      const nextSectionIndex = sections.indexOf(currentSection) + 1;
      if (nextSectionIndex < sections.length) {
        setCurrentSection(sections[nextSectionIndex]);
        setCurrentQuestionIndex(0);
      } else {
        // If we've gone through all sections, move to results
        calculateAssessmentResults();
        setCurrentView("results");
      }
    }
  };

  // Navigate to previous question or section
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      // Go to previous section if at first question of current section
      const prevSectionIndex = sections.indexOf(currentSection) - 1;
      if (prevSectionIndex >= 0) {
        const prevSection = sections[prevSectionIndex];
        const prevSectionQuestions = questions.filter(q => q.section === prevSection);
        setCurrentSection(prevSection);
        setCurrentQuestionIndex(prevSectionQuestions.length - 1);
      }
    }
  };

  // Handle demographic data changes
  const handleDemographicChange = (field: keyof DemographicData, value: string | boolean) => {
    setDemographicData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle demographic form submission
  const handleDemographicSubmit = () => {
    setCurrentView("questionnaire");
  };

  // Calculate scores and determine profiles
  const calculateAssessmentResults = () => {
    const calculatedScores = calculateScores(questions, userResponses);
    const { primaryProfile, genderProfile } = determineProfiles(calculatedScores, demographicData.gender);
    
    setScores(calculatedScores);
    setPrimaryProfile(primaryProfile);
    setGenderProfile(genderProfile);
  };

  // Handle sending email report
  const handleSendEmail = async () => {
    if (!demographicData.email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to receive the report.",
        variant: "destructive"
      });
      return;
    }

    setEmailSending(true);

    try {
      await sendEmailReport({
        to: demographicData.email,
        name: `${demographicData.firstName} ${demographicData.lastName}`,
        scores: scores!,
        profile: primaryProfile!,
        genderProfile: genderProfile,
        responses: userResponses,
        demographics: demographicData
      });
      
      setCurrentView("emailSent");
    } catch (error) {
      toast({
        title: "Error Sending Email",
        description: "There was a problem sending your report. Please try again.",
        variant: "destructive"
      });
      console.error("Email sending error:", error);
    } finally {
      setEmailSending(false);
    }
  };

  // Handle returning to results from email confirmation
  const handleBackToResults = () => {
    setCurrentView("results");
  };

  // Handle retaking the assessment
  const handleRetakeAssessment = () => {
    setUserResponses({});
    setCurrentSection(sections[0]);
    setCurrentQuestionIndex(0);
    
    // Reset payment status and return to paywall
    setDemographicData(prev => ({
      ...prev,
      hasPaid: false
    }));
    setCurrentView("paywall");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">The 100 Marriage Assessment - Series 1</h1>
          </div>
          <div className="hidden sm:block">
            <span className="text-sm text-gray-500">© 2025 Lawrence E. Adjah</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Paywall comes first */}
        {currentView === "paywall" && (
          <PaywallView 
            demographicData={demographicData}
            onChange={handleDemographicChange}
            onPaymentComplete={() => setCurrentView("demographics")}
          />
        )}
        
        {/* Demographics comes after payment */}
        {currentView === "demographics" && (
          <DemographicView 
            demographicData={demographicData}
            onChange={handleDemographicChange}
            onSubmit={handleDemographicSubmit}
            onBack={() => setCurrentView("questionnaire")}
          />
        )}

        {/* Questionnaire view */}
        {currentView === "questionnaire" && (
          <>
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
            
            {currentQuestion && (
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
            )}
          </>
        )}

        {/* Results view */}
        {currentView === "results" && scores && primaryProfile && (
          <ResultsView 
            scores={scores}
            primaryProfile={primaryProfile}
            genderProfile={genderProfile}
            demographics={demographicData}
            onSendEmail={handleSendEmail}
            onRetakeAssessment={handleRetakeAssessment}
            emailSending={emailSending}
          />
        )}

        {/* Email sent confirmation */}
        {currentView === "emailSent" && (
          <EmailSentConfirmation onBackToResults={handleBackToResults} />
        )}
      </main>
    </div>
  );
}
