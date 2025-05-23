import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import MarriageAssessment from "@/pages/MarriageAssessment";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminDashboardBasic from "@/pages/AdminDashboardBasic";
import SamplesPage from "@/pages/SamplesPage";
import CoupleAssessmentInvite from "@/pages/CoupleAssessmentInvite";
import CoupleAssessmentReport from "@/pages/CoupleAssessmentReport";
import AssessmentTest from "@/pages/AssessmentTest";
import ViewSamplePDF from "@/pages/ViewSamplePDF";
import SampleCoupleAssessment from "@/pages/SampleCoupleAssessment";
import IndividualAssessmentOnScreen from "@/pages/IndividualAssessmentOnScreen";
import ViewAssessmentReports from "@/pages/ViewAssessmentReports";
import InviteFriends from "@/pages/InviteFriends";
import AdminPaymentsSimple from "@/pages/AdminPaymentsSimple";
import SimpleAssessmentResults from "@/pages/SimpleAssessmentResults";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/assessment" component={MarriageAssessment} />
      <Route path="/admin" component={AdminDashboardBasic} />
      <Route path="/samples" component={SamplesPage} />
      <Route path="/couple-assessment/invite/:coupleId" component={CoupleAssessmentInvite} />
      <Route path="/couple-assessment/report/:coupleId" component={CoupleAssessmentReport} />
      <Route path="/test" component={AssessmentTest} />
      <Route path="/sample-pdf" component={ViewSamplePDF} />
      <Route path="/sample-couple-assessment" component={SampleCoupleAssessment} />
      <Route path="/individual-assessment" component={IndividualAssessmentOnScreen} />
      <Route path="/real-pdf" component={() => {
        window.location.href = "/realistic-couple-assessment.html";
        return null;
      }} />
      <Route path="/view-reports" component={ViewAssessmentReports} />
      <Route path="/invite" component={InviteFriends} />
      <Route path="/admin/payments" component={AdminPaymentsSimple} />
      <Route path="/admin/assessments" component={SimpleAssessmentResults} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
