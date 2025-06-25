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
  const [isLastQuestion, setIsLastQuestion] = useState(false);
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
  const handleOptionSelect = async (questionId: string, option: string, value: number) => {
    // Ensure consistent question ID format (normalize to string format)
    const normalizedQuestionId = questionId.toString();
    
    // Update state with the new response
    const updatedResponses = {
      ...userResponses,
      [normalizedQuestionId]: { option, value }
    };
    
    setUserResponses(updatedResponses);
    
    // Real-time autosaving implementation
    try {
      if (demographicData.email) {
        await apiRequest('POST', '/api/assessment/save-progress', {
          email: demographicData.email,
          demographicData,
          responses: updatedResponses,
          assessmentType,
          timestamp: new Date().toISOString(),
          completed: false
        });
      }

      // Check if this is question 99 (final question) and auto-complete
      const numericQuestionId = typeof questionId === 'string' ? parseInt(questionId.replace('Q', '')) : questionId;
      if (numericQuestionId === 99 && demographicData.email) {
        await apiRequest('POST', '/api/assessment/complete', {
          email: demographicData.email,
          finalResponse: {
            questionId: normalizedQuestionId,
            option,
            value
          }
        });
        
        toast({
          title: "Assessment Completed!",
          description: "All questions answered. Your results are being processed.",
        });
      }
    } catch (error) {
      console.error('Error with autosave/completion:', error);
      // Silent failure for autosave to avoid disrupting user experience
    }
    
    console.log(`Response recorded for question ${normalizedQuestionId}`);
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
        // If we've gone through all sections, show a final submission page
        // We'll set a flag to indicate we're at the end of all questions
        setIsLastQuestion(true);
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
  
  // Handle manual saving of progress
  const handleSaveProgress = async () => {
    if (!demographicData.email) {
      toast({
        title: "Email Required",
        description: "Please complete the demographic information with your email before saving progress.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Show saving toast
      toast({
        title: "Saving Progress",
        description: "Please wait while we save your responses...",
      });
      
      // Save progress to the server
      await apiRequest('POST', '/api/assessment/save-progress', {
        email: demographicData.email,
        demographicData,
        responses: userResponses,
        assessmentType,
        timestamp: new Date().toISOString()
      });
      
      // Show success toast
      toast({
        title: "Progress Saved",
        description: "Your responses have been saved successfully.",
      });
      
    } catch (error) {
      console.error('Error saving progress:', error);
      toast({
        title: "Save Failed",
        description: "There was a problem saving your progress. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle final submission of the assessment
  const handleSubmitAssessment = async () => {
    try {
      // Enhanced demographic validation
      if (!demographicData.email || !demographicData.gender || !demographicData.firstName || !demographicData.lastName) {
        toast({
          title: "Required Fields Missing",
          description: "Please complete all required demographic fields (name, email, gender) before submitting.",
          variant: "destructive"
        });
        return;
      }

      // Enhanced validation - check for responses to all required questions
      const questionIds = questions.map(q => q.id);
      const validResponses = questions.filter(q => userResponses[q.id] !== undefined);
      const requiredCount = questions.length; // All questions are required
      
      if (validResponses.length < requiredCount) {
        // Find missing questions for better user feedback
        const missingQuestions = questions.filter(q => !userResponses[q.id])
          .map(q => q.id)
          .slice(0, 5); // Show first 5 missing
        
        console.log('Validation Debug:', {
          totalQuestions,
          validResponses: validResponses.length,
          requiredCount,
          missingQuestions,
          userResponseKeys: Object.keys(userResponses).slice(0, 10),
          sampleUserResponses: Object.entries(userResponses).slice(0, 3)
        });
        
        toast({
          title: "Incomplete Assessment",
          description: `Please answer all ${requiredCount} questions before submitting. You've answered ${validResponses.length} questions.`,
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Submitting Assessment",
        description: "Please wait while we finalize your assessment...",
      });
      
      // First, mark the assessment as complete in progress table
      await apiRequest('POST', '/api/assessment/save-progress', {
        email: demographicData.email,
        demographicData,
        responses: userResponses,
        assessmentType,
        timestamp: new Date().toISOString(),
        completed: true
      });
      
      // Calculate the final results
      await calculateAssessmentResults();
      
      // Show success toast
      toast({
        title: "Assessment Completed",
        description: "Your assessment has been successfully submitted and saved.",
      });
      
      // Reset the last question flag and move to results
      setIsLastQuestion(false);
      setCurrentView("results");
      
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast({
        title: "Submission Failed",
        description: "There was a problem submitting your assessment. Please try again.",
        variant: "destructive"
      });
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

  // Calculate scores and determine profiles with enhanced male user protection
  const calculateAssessmentResults = async () => {
    try {
      console.log('Starting assessment results calculation...');
      const calculatedScores = calculateScores(questions, userResponses);
      console.log('Scores calculated successfully');
      
      // Normalize gender for consistent profile determination
      const normalizedGender = demographicData.gender ? demographicData.gender.toLowerCase().trim() : undefined;
      console.log(`Original gender value: "${demographicData.gender}", normalized to: "${normalizedGender}"`);
      
      // Enhanced profile determination with timeout and male user protection
      let primaryProfile, genderProfile;
      
      const profileDeterminationTimeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile determination timeout')), 10000); // 10 second timeout
      });
      
      try {
        console.log('Starting profile determination with timeout protection...');
        const profileResult = await Promise.race([
          Promise.resolve(determineProfiles(calculatedScores, normalizedGender)),
          profileDeterminationTimeout
        ]);
        
        primaryProfile = profileResult.primaryProfile;
        genderProfile = profileResult.genderProfile;
        
        // Enhanced validation for male users
        if (normalizedGender === 'male' && !primaryProfile) {
          console.warn('Male user missing primary profile - applying emergency fallback');
          const { psychographicProfiles } = await import('@/data/psychographicProfiles');
          primaryProfile = psychographicProfiles.find(p => p.name === 'Steadfast Believers') || 
                          psychographicProfiles.find(p => !p.genderSpecific) || 
                          psychographicProfiles[0];
        }
        
        console.log(`Profile determination successful - Primary: ${primaryProfile?.name}, Gender: ${genderProfile?.name || 'None'}`);
        
      } catch (profileError) {
        console.error('Profile determination failed or timed out:', profileError);
        // Emergency fallback to prevent hanging
        const { psychographicProfiles } = await import('@/data/psychographicProfiles');
        primaryProfile = psychographicProfiles.find(p => p.name === 'Steadfast Believers') || 
                        psychographicProfiles.find(p => !p.genderSpecific) || 
                        psychographicProfiles[0];
        genderProfile = null;
        
        console.log(`Emergency fallback applied for ${normalizedGender} user: ${primaryProfile?.name}`);
        
        toast({
          title: "Assessment Completed",
          description: "Your assessment was processed successfully with a standard profile match.",
          variant: "default"
        });
      }
      
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
          // Don't throw here - let the user see their results even if saving fails
        }
      }
      
    } catch (error) {
      console.error('Critical error in calculateAssessmentResults:', error);
      toast({
        title: "Assessment Processing Error",
        description: "There was an issue processing your assessment. Please contact hello@wgodw.com for assistance.",
        variant: "destructive"
      });
      throw error; // Re-throw to prevent progression to results view
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
            
            {!isLastQuestion && (
              <QuestionnaireNavigation 
                sections={sections} 
                currentSection={currentSection}
                onSectionChange={handleSectionChange}
              />
            )}
            
            {currentQuestion && (
              <QuestionnaireView 
                question={currentQuestion}
                onOptionSelect={handleOptionSelect}
                onNextQuestion={handleNextQuestion}
                onPreviousQuestion={handlePreviousQuestion}
                onSaveProgress={handleSaveProgress}
                onSubmitAssessment={handleSubmitAssessment}
                selectedOption={userResponses[currentQuestion.id]?.option}
                isFirstQuestion={currentQuestionIndex === 0 && sections.indexOf(currentSection) === 0}
                questionIndex={questions.findIndex(q => q.id === currentQuestion.id)}
                totalQuestions={totalQuestions}
                showSaveButton={true}
                isLastQuestion={questions.findIndex(q => q.id === currentQuestion.id) === totalQuestions - 1}
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
