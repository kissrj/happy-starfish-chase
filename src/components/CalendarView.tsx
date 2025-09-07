"use client";

import HabitFilter from '@/components/HabitFilter';
import MonthlyStats from '@/components/MonthlyStats';
import CalendarGrid from '@/components/CalendarGrid';
import CalendarLegend from '@/components/CalendarLegend';
import { Habit } from '@/hooks/useHabits';
import { CompletionData, CompletionStatus } from '@/hooks/useCalendar';

interface CalendarViewProps {
  habits: Habit[];
  completionData: CompletionData;
  loading: boolean;
  selectedHabit: string;
  setSelectedHabit: (habitId: string) => void;
  days: Date[];
  getCompletionStatus: (date: Date, habitId: string) => CompletionStatus;
  getCompletionCount: (date: Date) => number;
  stats: {
    totalCompletions: number;
    completedDays: number;
    totalDays: number;
    completionRate: number;
  };
}

const CalendarView = ({
  habits,
  completionData,
  loading,
  selectedHabit,
  setSelectedHabit,
  days,
  getCompletionStatus,
  getCompletionCount,
  stats,
}: CalendarViewProps) => {
  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <HabitFilter
          habits={habits}
          selectedHabit={selectedHabit}
          onHabitChange={setSelectedHabit}
        />

        <MonthlyStats stats={stats} />

        <CalendarGrid
          loading={loading}
          days={days}
          getCompletionStatus={getCompletionStatus}
          getCompletionCount={getCompletionCount}
          selectedHabit={selectedHabit}
          completionData={completionData}
        />

        <CalendarLegend />
      </div>
    </main>
  );
};

export default CalendarView;