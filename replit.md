# The 100 Marriage Assessment - Series 1

## Overview
The 100 Marriage Assessment is a comprehensive relationship compatibility and marriage readiness evaluation platform developed by Lawrence E. Adjah. This system provides scientifically-based assessment tools that analyze individual readiness for marriage and compatibility between couples. The platform offers three main services: Individual Assessment ($49), Couple Assessment ($79), and Arranged Marriage Pool matching service ($25).

## System Architecture
The application follows a full-stack architecture with clear separation between frontend and backend components:

- **Frontend**: React-based single-page application built with Vite
- **Backend**: Node.js/Express server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Deployment**: Replit-hosted with autoscale deployment target

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with Radix UI components for consistent design
- **State Management**: TanStack React Query for server state management
- **Payment Integration**: Stripe React components for secure payments
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Session-based with secure session secrets
- **Email Service**: SendGrid for transactional emails
- **PDF Generation**: PDFKit for assessment report generation
- **Payment Processing**: Stripe webhook integration

### Assessment Engine
The core assessment system processes 99 authentic questions from Lawrence Adjah's book:
- **Question Types**: Declaration (D), Multiple Choice (M), and Input (I) questions
- **Scoring System**: Weighted scoring with section-based calculations
- **Profile Matching**: 13 psychographic profiles with gender-specific variations
- **Report Generation**: Professional PDF reports with detailed analysis

### Data Flow
1. **User Registration**: Demographics collection and payment processing
2. **Assessment Taking**: Progressive question answering with response storage
3. **Score Calculation**: Weighted scoring algorithm with section breakdowns
4. **Profile Determination**: Psychographic profile matching based on scores
5. **Report Generation**: PDF creation with personalized insights
6. **Email Delivery**: Automated report distribution via SendGrid

## External Dependencies

### Payment Processing
- **Stripe**: Complete payment infrastructure including webhooks for secure transaction handling
- **Configuration**: Separate test and production keys with webhook signature verification

### Email Service
- **SendGrid**: Transactional email service for report delivery
- **Templates**: Custom HTML templates for individual and couple assessments
- **Attachments**: PDF report delivery with professional formatting

### Database Infrastructure
- **PostgreSQL**: Primary data store for all assessment data
- **Connection**: Environment-based connection string configuration
- **Migrations**: Drizzle Kit for schema management and migrations

### Development Tools
- **TypeScript**: Full-stack type safety
- **ESBuild**: Fast production builds
- **Jest**: Testing framework for backend logic
- **Tailwind CSS**: Utility-first styling framework

## Deployment Strategy
The application uses Replit's deployment infrastructure:
- **Target**: Autoscale deployment for handling variable traffic
- **Build Process**: Automated builds with `npm run build`
- **Runtime**: Production mode with `npm run start`
- **Port Configuration**: Frontend on port 3000, backend on port 5000 (external port 80)
- **Environment**: Production environment variables for security

### Workflow Configuration
- **Development**: `npm run dev` for local development with hot reload
- **Production**: Multi-step build and deploy process
- **Dependencies**: Automatic package installation for all environments

## Recent Changes
- June 25, 2025: Fixed critical assessment submission issue - resolved question ID validation logic that prevented users from submitting completed assessments, ensuring proper handling of Q1-Q99 question format and response validation
- June 25, 2025: Fully implemented simulation endpoint with PDF generation and email delivery - /api/simulate now generates complete assessment reports, sends PDFs to la@lawrenceadjah.com via SendGrid, and provides comprehensive testing of the 660-point scoring algorithm with realistic score ranges
- June 25, 2025: Enhanced PDF generation with live scoring (generatePDFWithLiveScore) - couple PDFs now use real-time improved 660-point algorithm instead of cached scores, ensuring most accurate compatibility analysis and proper Lawrence Adjah methodology integration
- June 25, 2025: Created couple analysis utilities (server/utils/coupleAnalysisUtils.ts) to ensure couple assessments use improved scoring algorithm - includes prepareAndCompareCoupleAssessments function for recalculating scores with 660-point system and comprehensive compatibility analysis
- June 25, 2025: Enhanced assessment submission validation in handleSubmitAssessment - added comprehensive demographic validation (name, email, gender), response completeness check, and improved error handling with user-friendly toast messages to prevent submission hangs
- June 25, 2025: Fixed parent component (MarriageAssessment.tsx) to properly pass isLastQuestion={questionIndex === totalQuestions - 1} and simplified component structure to ensure proper assessment submission flow
- June 25, 2025: Fixed assessment submission button in QuestionnaireView.tsx - ensures onSubmitAssessment() is called on the last question instead of onNextQuestion(), with proper Submit/Next button text based on question position
- June 25, 2025: Created comprehensive recalculation system (server/recalculateAssessments.ts) with improved scoring algorithm integration - supports individual assessment recalculation and batch processing of all assessments with proper error handling and database integration
- June 25, 2025: Updated section weights to final values (660 total) with accurate proportional contributions - Your Foundation: 82 (12.42%), Your Faith Life: 21 (3.18%), Your Marriage Life: 216 (32.73%), Your Marriage Life with Children: 126 (19.09%), Your Family/Home Life: 34 (5.15%), Your Finances: 58 (8.79%), Your Health and Wellness: 49 (7.42%), Your Marriage and Boundaries: 74 (11.21%)
- June 25, 2025: Implemented improved scoring algorithm with proper response scaling (100%/75%/40%/15% based on option selection), section weight normalization, and weighted overall percentage calculation - replaces simple totalEarned += response.value pattern
- June 25, 2025: Restored essential subsection data containing Lawrence Adjah's authentic categorization (e.g., "Marriage Mindset: Happiness", "Sex (Frequency)", "Children (Discipline Style)") - critical for maintaining book authenticity and granular question classification
- June 25, 2025: Updated question dataset format with structured JSON-exportable format including string IDs (Q1-Q99), faith flags, baseWeight/adjustedWeight separation, and proper type definitions for enhanced data management
- June 25, 2025: Implemented final scoring algorithm patch with proper section weighting (623 total points), standardized response percentages (100%/75%/40%/15%), and weighted category contributions ensuring accurate profile correlation and compatibility scoring
- June 25, 2025: Implemented contextual scoring system that analyzes faith and traditional content in options, applies content-aware scoring with bonus multipliers for faith questions, and properly weights traditional marriage responses regardless of option position
- June 25, 2025: Fixed critical scoring algorithm issues - corrected multiple choice scoring from 5x inflated denominators to proper weight-based scoring, implemented graduated point distribution, and adjusted psychographic profile criteria to realistic ranges
- June 25, 2025: Fixed assessment hanging issue for male respondents - added timeout protection and emergency fallbacks in profile determination logic
- June 24, 2025: Fixed Question 99 options structure - removed repeated question text from option 1, now has proper 3-option format for digital media with past relationships
- June 24, 2025: Fixed Question 98 options structure - removed repeated question text from option 1, now has proper 4-option format for past relationship boundaries
- June 24, 2025: Fixed Question 97 options structure - removed repeated question text from option 1, now has proper 3-option format for social media boundaries
- June 24, 2025: Fixed Question 95 options structure - integrated sub-bullets (options 3-5) into main option 2 for opposite sex interaction boundaries
- June 24, 2025: Fixed Question 79 structure - added "[one designated spouse]" placeholder to food preparation responsibility question and options 1-2
- June 24, 2025: Verified Question 76 - no changes needed as it addresses joint payment behavior, not individual responsibility assignment
- June 24, 2025: Fixed Question 75 formatting - removed all dollar signs from question text and options for clean percentage display
- June 24, 2025: Fixed Question 74 structure - added "[one designated spouse]" placeholder to financial management responsibility question and first option
- June 24, 2025: Fixed Question 67 structure - added "[one designated spouse]" placeholder, integrated sub-bullet into main option, created 3-option format with antithesis and Godly counsel options
- June 24, 2025: Fixed Question 61 text clarity - replaced incomplete "by age" with "by age [your preferred age]" to clarify user input requirement
- June 24, 2025: Fixed Question 53 options structure - integrated sub-bullets into main options, now has proper 2-option format plus "Not Applicable" for child discipline approaches
- June 24, 2025: Fixed Question 52 text formatting - replaced mathematical symbols with proper "1st trimester" and "2nd trimester" text
- June 24, 2025: Fixed Question 46 options structure - removed repeated question text from option 1, now has proper 3-option format for birth location preferences
- June 24, 2025: Fixed Question 45 options structure - removed repeated question text from option 1, added "(Out of Water)" clarification to vaginal delivery option
- June 24, 2025: Fixed Question 39 options structure - integrated sub-bullets into main option and created 3-option format with antithesis and Godly counsel options
- June 24, 2025: Fixed Question 28 options structure - integrated sub-bullet content into main option and created proper antithesis option for communication approach
- June 24, 2025: Fixed Question 27 options structure - integrated sub-bullet content into main option and created proper antithesis option
- June 24, 2025: Added 4th option "Other: (Please detail)" to Question 14 (Family Name) for custom arrangements
- June 24, 2025: Fixed Question 13 options structure - converted from 4 options (with sub-bullets) to proper 2-option multiple choice format with antithesis options
- June 24, 2025: Fixed Question 7 options structure - converted from 5 options (with sub-bullets) to proper 2-option multiple choice format with antithesis options
- June 24, 2025: Completed PDF appendix authenticity fix - replaced all fictitious psychographic profiles with authentic Lawrence Adjah content
- June 24, 2025: Verified all 13 psychographic profiles match official specifications exactly

## Changelog
- June 24, 2025. Initial setup

## User Preferences
Preferred communication style: Simple, everyday language.