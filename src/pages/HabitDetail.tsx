"use client";

import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Skeleton } from '@/components/ui/skeleton';
import { useHabitDetail } from '@/hooks/useHabitDetail';
import HabitHeader from '@/components/HabitHeader';
import HabitInfo from '@/components/HabitInfo';
import HabitGoalProgress from '@/components/HabitGoalProgress';
import HabitStreakDisplay from '@/components/HabitStreakDisplay';
import HabitCalendar from '@/components/HabitCalendar';
import HabitCompletionChart from '@/components/HabitCompletionChart';
import HabitDetailStats from '@/components/HabitDetailStats';

const HabitDetail = () => {
  const { id } = useParams<{ id: string }>();
  const {
    habit,
    completedDates,
    loading,
    currentStreak,
    longestStreak,
    handleMarkDate,
    handleUnmarkDate,
    fetchHabitDetails,
  } = useHabitDetail(id);

  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | undefined>(undefined);

  // Mock data for demonstration
  const completionRate = 85;
  const totalCompletions = 25;
  const goal = {
    type: 'daily' as const,
    target: 1,
    current: habit?.completed_today ? 1 : 0
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
            <Skeleton className="h-8 w-32" />
          </div>
        </header>
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-64 mb-8" />
          <Skeleton className="h-[300px] w-full" />
        </main>
      </div>
    );
  }

  if (!habit) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Habit not found</h2>
              <a href="/" className="text-blue-500 hover:text-blue-700 underline">
                Return to dashboard
              </a>
            </div>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HabitHeader habit={habit} onHabitUpdated={fetchHabitDetails} />

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <HabitInfo habit={habit} />
        
        <HabitDetailStats
          habitName={habit.name}
          currentStreak={currentStreak}
          longestStreak={longestStreak}
          completionRate={completionRate}
          totalCompletions={totalCompletions}
          goal={goal}
        />

        {/* Goal Progress */}
        {habit.goal_type && habit.goal_type !== 'none' && habit.goal_target && (
          <HabitGoalProgress habit={habit as { id: string; name: string; goal_type: string; goal_target: number }} />
        )}

        <HabitStreakDisplay currentStreak={currentStreak} longestStreak={longestStreak} />

        <div className="max-w-2xl mx-auto space-y-6">
          <HabitCalendar
            selectedCalendarDate={selectedCalendarDate}
            onSelectDate={setSelectedCalendarDate}
            completedDates={completedDates}
            onMarkDate={handleMarkDate}
            onUnmarkDate={handleUnmarkDate}
          />

          <HabitCompletionChart completedDates={completedDates} />
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default HabitDetail;