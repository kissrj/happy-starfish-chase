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
import DailySummary from '@/components/DailySummary';
import HabitFilters from '@/components/HabitFilters';
import HabitList from '@/components/HabitList';
import QuickStart from '@/components/QuickStart';
import DeleteHabitDialog from '@/components/DeleteHabitDialog';
import { exportHabitsData } from '@/utils/habitExport';
import StreakCounter from '@/components/StreakCounter';
import AchievementsPanel from '@/components/AchievementsPanel';
import HabitTrendsChart from '@/components/HabitTrendsChart';

const Index = () => {
  const { user } = useAuth();
  const { habits, loading, fetchHabits, updateHabits } = useHabits();
  const { dailySummary } = useDailySummary(habits);
  const { habitToDelete, setHabitToDelete, showConfetti, handleToggleCompletion, handleDeleteHabit } = useHabitActions(habits, updateHabits);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleExportHabits = () => {
    if (!user?.id) return;
    exportHabitsData(habits, user.id);
  };

  const categories = ['all', ...Array.from(new Set(habits.map(h => h.category).filter(Boolean)))];

  // Mock data for streaks and achievements
  const currentStreak = 7;
  const longestStreak = 14;
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
        <StreakCounter 
          currentStreak={currentStreak}
          longestStreak={longestStreak}
          totalHabits={totalHabits}
          completedToday={completedToday}
        />
        
        <AchievementsPanel />
        
        <HabitTrendsChart />
        
        <DailySummary
          total={dailySummary.total}
          completed={dailySummary.completed}
          remaining={dailySummary.remaining}
        />

        {habits.length === 0 && <QuickStart onHabitAdded={fetchHabits} />}

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Your Habits</h2>
          <HabitFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            onHabitAdded={fetchHabits}
          />
        </div>

        <HabitList
          habits={habits}
          loading={loading}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          onToggleCompletion={handleToggleCompletion}
          onDeleteHabit={setHabitToDelete}
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