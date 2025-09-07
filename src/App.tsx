import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import HabitDetail from "./pages/HabitDetail";
import FinanceTracker from "./pages/FinanceTracker";
import Settings from "./pages/Settings";
import Calendar from "./pages/Calendar";
import HabitInsights from "./pages/HabitInsights";
import Notifications from "./pages/Notifications";
import AchievementsPage from './pages/Achievements';
import HabitTemplates from './pages/HabitTemplates';
import HabitArchivePage from './pages/HabitArchive';
import ShareProgress from './pages/ShareProgress';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="habit-tracker-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/share/:shareId" element={<ShareProgress />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Index />} />
                <Route path="/habit/:id" element={<HabitDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/finance" element={<FinanceTracker />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/insights" element={<HabitInsights />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/achievements" element={<AchievementsPage />} />
                <Route path="/templates" element={<HabitTemplates />} />
                <Route path="/archive" element={<HabitArchivePage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;