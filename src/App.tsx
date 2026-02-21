import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "@/context/ScoresContext";
import InstallPrompt from "@/components/InstallPrompt";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import ReviewerLoginPage from "./pages/ReviewerLoginPage";
import OrganizerLoginPage from "./pages/OrganizerLoginPage";
import ReviewerPage from "./pages/ReviewerPage";
import OrganizerPage from "./pages/OrganizerPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DataProvider>
        <Toaster />
        <Sonner />
        <InstallPrompt />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reviewer/login" element={<ReviewerLoginPage />} />
            <Route path="/organizer/login" element={<OrganizerLoginPage />} />
            <Route path="/reviewer" element={<ReviewerPage />} />
            <Route path="/organizer" element={<OrganizerPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
