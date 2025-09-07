"use client";

import { useState } from 'react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { useCalendar } from '@/hooks/useCalendar';
import CalendarHeader from '@/components/CalendarHeader';
import CalendarView from '@/components/CalendarView';

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

      <CalendarView
        habits={habits}
        completionData={completionData}
        loading={loading}
        selectedHabit={selectedHabit}
        setSelectedHabit={setSelectedHabit}
        days={days}
        getCompletionStatus={getCompletionStatus}
        getCompletionCount={getCompletionCount}
        stats={stats}
      />

      <MadeWithDyad />
    </div>
  );
};

export default Calendar;