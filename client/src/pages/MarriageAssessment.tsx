import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import QuestionnaireProgress from "@/components/assessment/QuestionnaireProgress";
import QuestionnaireNavigation from "@/components/assessment/QuestionnaireNavigation";
import QuestionnaireView from "@/components/assessment/QuestionnaireView";
import DemographicView from "@/components/assessment/DemographicView";
import PaywallView from "@/components/assessment/PaywallView";
import ResultsView from "@/components/assessment/ResultsView";
import EmailSentConfirmation from "@/components/assessment/EmailSentConfirmation";
import { CoupleInviteForm } from "@/components/couple/CoupleInviteForm";
import { apiRequest } from "@/lib/queryClient";
import { questions, sections } from "@/data/questionsData";
import { calculateScores, determineProfile, determineProfiles } from "@/utils/scoringUtils";
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

type View = "paywall" | "demographics" | "questionnaire" | "results" | "emailSent" | "coupleInvite";

export default function MarriageAssessment() {
  const [_, params] = useLocation();
  
  // Get assessment type from location state or default to individual
  const [assessmentType, setAssessmentType] = useState<'individual' | 'couple'>('individual');
  
  // Force paywall to appear first
  const [currentView, setCurrentView] = useState<View>("paywall");
  const [currentSection, setCurrentSection] = useState(sections[0]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState<Record<number, UserResponse>>({});
  const [demographicData, setDemographicData] = useState<DemographicData>({
    firstName: "",
    lastName: "",
    email: "",
    lifeStage: "",
    birthday: "",
    phone: "",
    gender: "",
    marriageStatus: "",
    desireChildren: "",
    ethnicity: "",
    hasPurchasedBook: "",
    purchaseDate: "",
    promoCode: "",
    hasPaid: false,
    interestedInArrangedMarriage: false,
    thmPoolApplied: false,
    city: "",
    state: "",
    zipCode: ""
  });
  const [scores, setScores] = useState<AssessmentScores | null>(null);
  const [primaryProfile, setPrimaryProfile] = useState<UserProfile | null>(null);
  const [genderProfile, setGenderProfile] = useState<UserProfile | null>(null);
  const [emailSending, setEmailSending] = useState(false);
  const [coupleId, setCoupleId] = useState<string | null>(null);

  // Initialize protection utilities and determine assessment type
  useEffect(() => {
    console.log("Setting up assessment with paywall first");
    initializeProtection();
    setCurrentView("paywall");
    
    // Try to get the assessment type from the router state
    const state = window.history.state;
    if (state && state.assessmentType) {
      setAssessmentType(state.assessmentType);
    }
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

  // Handle starting a couple assessment
  const [, setLocation] = useLocation();
  const [coupleLoading, setCoupleLoading] = useState(false);
  const [spouseEmail, setSpouseEmail] = useState("");
  
  const handleStartCoupleAssessment = async () => {
    if (!demographicData.email) {
      toast({
        title: "Email Required",
        description: "Please ensure your email is provided in demographics.",
        variant: "destructive"
      });
      return;
    }
    
    if (!spouseEmail) {
      toast({
        title: "Spouse Email Required",
        description: "Please enter your spouse's email address to send the invitation.",
        variant: "destructive"
      });
      return;
    }
    
    setCoupleLoading(true);
    
    try {
      // Create an assessment result object
      const assessmentResult = {
        email: demographicData.email,
        name: `${demographicData.firstName} ${demographicData.lastName}`,
        scores: scores!,
        profile: primaryProfile!,
        genderProfile: genderProfile,
        responses: userResponses,
        demographics: demographicData,
        timestamp: new Date().toISOString()
      };
      
      // Start a couple assessment
      const response = await apiRequest("POST", "/api/couple-assessment/start", {
        primaryAssessment: assessmentResult,
        spouseEmail: spouseEmail
      });
      
      if (!response.ok) {
        throw new Error("Failed to start couple assessment");
      }
      
      const { coupleId } = await response.json();
      
      toast({
        title: "Couple Assessment Started",
        description: "An invitation has been sent to your spouse to complete their assessment."
      });
      
      // Redirect to the couple assessment report page
      setLocation(`/couple-assessment/report/${coupleId}`);
    } catch (error) {
      console.error("Error starting couple assessment:", error);
      toast({
        title: "Error",
        description: "There was a problem starting the couple assessment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setCoupleLoading(false);
    }
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
            assessmentType={assessmentType}
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
            emailSending={emailSending}
            onStartCoupleAssessment={() => setCurrentView("coupleInvite")}
            assessmentType={assessmentType}
          />
        )}

        {/* Email sent confirmation */}
        {currentView === "emailSent" && (
          <EmailSentConfirmation onBackToResults={handleBackToResults} />
        )}
        
        {/* Couple invite view */}
        {currentView === "coupleInvite" && (
          <CoupleInviteForm
            primaryEmail={demographicData.email}
            onSpouseEmailChange={setSpouseEmail}
            spouseEmail={spouseEmail}
            onSubmit={handleStartCoupleAssessment}
            onCancel={() => setCurrentView("results")}
            loading={coupleLoading}
          />
        )}
      </main>
    </div>
  );
}
