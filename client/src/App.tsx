import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import MarriageAssessment from "@/pages/MarriageAssessment";
import AdminDashboard from "@/pages/AdminDashboard";
import SamplesPage from "@/pages/SamplesPage";
import CoupleAssessmentInvite from "@/pages/CoupleAssessmentInvite";
import CoupleAssessmentReport from "@/pages/CoupleAssessmentReport";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/assessment" component={MarriageAssessment} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/samples" component={SamplesPage} />
      <Route path="/couple-assessment/invite/:coupleId" component={CoupleAssessmentInvite} />
      <Route path="/couple-assessment/report/:coupleId" component={CoupleAssessmentReport} />
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
