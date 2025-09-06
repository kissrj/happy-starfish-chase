"use client";

import { useState, useEffect } from 'react';
import { Habit } from './useHabits';

export const useDailySummary = (habits: Habit[]) => {
  const [dailySummary, setDailySummary] = useState({ total: 0, completed: 0, remaining: 0 });

  useEffect(() => {
    const totalHabits = habits.length;
    const completedTodayCount = habits.filter(h => h.completed_today).length;
    const remainingTodayCount = totalHabits - completedTodayCount;

    setDailySummary({
      total: totalHabits,
      completed: completedTodayCount,
      remaining: remainingTodayCount,
    });
  }, [habits]);

  const updateSummary = (updatedHabits: Habit[]) => {
    const totalHabits = updatedHabits.length;
    const completedTodayCount = updatedHabits.filter(h => h.completed_today).length;
    const remainingTodayCount = totalHabits - completedTodayCount;

    setDailySummary({
      total: totalHabits,
      completed: completedTodayCount,
      remaining: remainingTodayCount,
    });
  };

  return {
    dailySummary,
    updateSummary,
  };
};