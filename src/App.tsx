import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import HabitDetail from "./pages/HabitDetail";
import FinancePage from "./pages/Finance";
import Settings from "./pages/Settings";
import Calendar from "./pages/Calendar";
import HabitInsights from "./pages/HabitInsights";
import Notifications from "./pages/Notifications";
import FinancialSummary from './components/FinancialSummary';
import AchievementsPage from './pages/Achievements';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Index />} />
              <Route path="/habit/:id" element={<HabitDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/finance" element={<FinancePage />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/insights" element={<HabitInsights />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/achievements" element={<AchievementsPage />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;