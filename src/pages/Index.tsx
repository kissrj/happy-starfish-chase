"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useHabits } from '@/hooks/useHabits';
import { useDailySummary } from '@/hooks/useDailySummary';
import { useHabitActions } from '@/hooks/useHabitActions';
import DeleteHabitDialog from '@/components/DeleteHabitDialog';
import { exportHabitsData } from '@/utils/habitExport';
import { useStreak } from '@/hooks/useStreak';
import { useAchievements } from '@/hooks/useAchievements';
import DashboardSummarySection from '@/components/DashboardSummarySection';
import HabitListSection from '@/components/HabitListSection';
import WeeklyOverview from '@/components/WeeklyOverview';
import MotivationalQuotes from '@/components/MotivationalQuotes';
import QuickActions from '@/components/QuickActions';

const Index = () => {
  const { user } = useAuth();
  const { habits, loading, fetchHabits, updateHabits } = useHabits();
  const { dailySummary } = useDailySummary(habits);
  const { 
    habitToDelete, 
    setHabitToDelete, 
    showConfetti, 
    showCompletionAnimation,
    setShowCompletionAnimation,
    handleToggleCompletion, 
    handleDeleteHabit 
  } = useHabitActions(habits, updateHabits);
  const { currentStreak, longestStreak } = useStreak();
  const { achievements, userAchievements } = useAchievements();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleExportHabits = () => {
    if (!user?.id) return;
    exportHabitsData(habits, user.id);
  };

  const handleAnimationComplete = () => {
    setShowCompletionAnimation(false);
  };

  const totalHabits = habits.length;
  const completedToday = habits.filter(habit => habit.completed_today).length;

  return (
    <div className="min-h-screen bg-background">
      {showConfetti && <Confetti recycle={false} onConfettiComplete={() => {}} />}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">My Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={handleExportHabits} disabled={habits.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export Habits
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/templates">
                🎯 Templates
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/archive">
                📦 Archive
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/insights">
                📊 Insights
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/notifications">
                🔔 Notifications
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/finance">Finance</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/profile">Profile</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/settings">Settings</Link>
            </Button>
            <Button onClick={handleLogout} variant="outline" size="sm">Logout</Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <MotivationalQuotes />

        <DashboardSummarySection
          totalHabits={totalHabits}
          completedToday={completedToday}
          dailySummary={dailySummary}
          currentStreak={currentStreak}
          longestStreak={longestStreak}
          achievements={achievements}
          userAchievements={userAchievements}
        />

        <QuickActions 
          habits={habits} 
          onToggleCompletion={handleToggleCompletion}
          showCompletionAnimation={showCompletionAnimation}
          onAnimationComplete={handleAnimationComplete}
        />

        <WeeklyOverview habits={habits} />

        <HabitListSection
          habits={habits}
          loading={loading}
          onHabitAdded={fetchHabits}
          onToggleCompletion={handleToggleCompletion}
          onDeleteHabit={setHabitToDelete}
          showCompletionAnimation={showCompletionAnimation}
          onAnimationComplete={handleAnimationComplete}
        />
      </main>
      <MadeWithDyad />

      <DeleteHabitDialog
        habitToDelete={habitToDelete}
        onClose={() => setHabitToDelete(null)}
        onConfirm={handleDeleteHabit}
      />
    </div>
  );
};

export default Index;