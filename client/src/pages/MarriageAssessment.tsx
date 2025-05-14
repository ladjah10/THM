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
  
  // AUTOSAVE DISABLED: Previously caused problems overwriting unique user responses with default data
  // For reference, the autosave code has been commented out but preserved
  /*
  useEffect(() => {
    // Only start autosave if we have an email and we're in questionnaire view
    if (!demographicData.email || currentView !== "questionnaire") {
      return;
    }
    
    console.log('Starting autosave timer for assessment progress');
    
    // Create autosave function
    const autoSaveProgress = async () => {
      try {
        // Don't save if we don't have an email or responses
        if (!demographicData.email || Object.keys(userResponses).length === 0) {
          return;
        }
        
        console.log('Auto-saving assessment progress...');
        
        // Save current progress
        await apiRequest('POST', '/api/assessment/save-progress', {
          email: demographicData.email,
          demographicData,
          responses: userResponses,
          assessmentType,
          timestamp: new Date().toISOString()
        });
        
        console.log('Assessment progress auto-saved');
      } catch (error) {
        console.error('Error auto-saving assessment progress:', error);
      }
    };
    
    // Set up interval for every 2 minutes (120000 ms)
    const autoSaveInterval = setInterval(autoSaveProgress, 120000);
    
    // Clean up interval on component unmount or when view changes
    return () => {
      clearInterval(autoSaveInterval);
      console.log('Autosave timer cleared');
    };
  }, [currentView, demographicData.email, userResponses, assessmentType]);
  */

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
  const handleOptionSelect = async (questionId: number, option: string, value: number) => {
    // Update state with the new response
    setUserResponses(prev => ({
      ...prev,
      [questionId]: { option, value }
    }));
    
    // If we have demographic data with email, save progress after each response
    if (demographicData.email) {
      try {
        // Create updated responses with the new selection
        const updatedResponses = {
          ...userResponses,
          [questionId]: { option, value }
        };
        
        // Save progress immediately after each response
        await apiRequest('POST', '/api/assessment/save-progress', {
          email: demographicData.email,
          demographicData,
          responses: updatedResponses,
          assessmentType,
          timestamp: new Date().toISOString()
        });
        
        console.log(`Response saved for question ${questionId}`);
      } catch (error) {
        console.error('Error saving response:', error);
        // Continue even if save fails - don't block the user
      }
    }
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
    
    // Special handling for promo code - record it immediately when entered
    if (field === 'promoCode' && typeof value === 'string' && value.trim() !== '') {
      try {
        // Verify promo code validity
        apiRequest('POST', '/api/verify-promo-code', {
          promoCode: value,
          assessmentType
        }).then(res => res.json())
          .then(data => {
            if (data.valid) {
              console.log(`Valid promo code entered: ${value}`);
              
              // Save demographic data with promo code
              if (demographicData.email) {
                apiRequest('POST', '/api/assessment/save-progress', {
                  email: demographicData.email,
                  demographicData: {
                    ...demographicData,
                    promoCode: value
                  },
                  timestamp: new Date().toISOString()
                }).catch(error => {
                  console.error('Error saving promo code data:', error);
                });
              }
            } else {
              console.log(`Invalid promo code attempted: ${value}`);
            }
          }).catch(error => {
            console.error('Error verifying promo code:', error);
          });
      } catch (error) {
        console.error('Error handling promo code:', error);
      }
    }
  };

  // Handle demographic form submission
  const handleDemographicSubmit = async () => {
    // Save initial demographic data to database
    if (demographicData.email) {
      try {
        // Save initial data
        await apiRequest('POST', '/api/assessment/save-progress', {
          email: demographicData.email,
          demographicData,
          timestamp: new Date().toISOString()
        });
        console.log('Initial demographic data saved to database');
      } catch (error) {
        console.error('Error saving initial demographic data:', error);
      }
    }
    
    setCurrentView("questionnaire");
  };

  // Calculate scores and determine profiles
  const calculateAssessmentResults = async () => {
    const calculatedScores = calculateScores(questions, userResponses);
    
    // Normalize gender for consistent profile determination
    const normalizedGender = demographicData.gender ? demographicData.gender.toLowerCase().trim() : undefined;
    console.log(`Original gender value: "${demographicData.gender}", normalized to: "${normalizedGender}"`);
    
    const { primaryProfile, genderProfile } = determineProfiles(calculatedScores, normalizedGender);
    
    setScores(calculatedScores);
    setPrimaryProfile(primaryProfile);
    setGenderProfile(genderProfile);
    
    // Save assessment data to the database right away when results are calculated
    if (demographicData.email) {
      try {
        // Send data to server to save assessment even without sending email
        await apiRequest('POST', '/api/assessment/save', {
          to: demographicData.email,
          name: `${demographicData.firstName} ${demographicData.lastName}`,
          scores: calculatedScores,
          profile: primaryProfile,
          genderProfile: genderProfile,
          responses: userResponses,
          demographics: demographicData
        });
        console.log('Assessment data saved to database');
      } catch (error) {
        console.error('Error saving assessment data:', error);
      }
    }
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
      console.error("Email sending error:", error);
      
      // Extract more detailed error message if available
      let errorMessage = "There was a problem sending your report. Please try again.";
      
      if (error instanceof Error) {
        // If we have a more specific error message, use it
        errorMessage = error.message;
        
        // If the error has response data, try to extract detailed error
        if ('response' in error && (error as any).response?.data?.errorDetails) {
          errorMessage = (error as any).response.data.errorDetails;
        }
      }
      
      toast({
        title: "Error Sending Email",
        description: errorMessage,
        variant: "destructive"
      });
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
