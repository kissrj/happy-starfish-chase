"use client";

import { MadeWithDyad } from '@/components/made-with-dyad';
import { useCalendar } from '@/hooks/useCalendar';
import CalendarHeader from '@/components/CalendarHeader';
import HabitFilter from '@/components/HabitFilter';
import MonthlyStats from '@/components/MonthlyStats';
import CalendarGrid from '@/components/CalendarGrid';
import CalendarLegend from '@/components/CalendarLegend';

const Calendar = () => {
  const {
    habits,
    completionData,
    loading,
    currentMonth,
    selectedHabit,
    setSelectedHabit,
    navigateMonth,
    getDaysInMonth,
    getCompletionStatus,
    getCompletionCount,
    getMonthStats,
  } = useCalendar();

  const days = getDaysInMonth();
  const stats = getMonthStats();

  return (
    <div className="min-h-screen bg-background">
      <CalendarHeader currentMonth={currentMonth} onNavigateMonth={navigateMonth} />

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
      <MadeWithDyad />
    </div>
  );
};

export default Calendar;