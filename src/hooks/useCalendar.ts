"use client";

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';

export interface Habit {
  id: string;
  name: string;
  description: string | null;
  category?: string;
}

export interface CompletionData {
  [habitId: string]: {
    [date: string]: boolean;
  };
}

export const useCalendar = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completionData, setCompletionData] = useState<CompletionData>({});
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedHabit, setSelectedHabit] = useState<string>('all');

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    // Fetch habits
    const { data: habitsData, error: habitsError } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: false });

    if (habitsError) {
      showError('Falha ao carregar os hábitos.');
      console.error(habitsError);
      setLoading(false);
      return;
    }

    setHabits(habitsData || []);

    // Fetch completion data for the current month
    const startDate = startOfMonth(currentMonth);
    const endDate = endOfMonth(currentMonth);

    const { data: completionsData, error: completionsError } = await supabase
      .from('habit_completions')
      .select('habit_id, completed_at')
      .eq('user_id', user.id)
      .gte('completed_at', format(startDate, 'yyyy-MM-dd'))
      .lte('completed_at', format(endDate, 'yyyy-MM-dd'));

    if (completionsError) {
      showError('Falha ao carregar dados de conclusão.');
      console.error(completionsError);
    } else {
      // Organize completion data by habit and date
      const organizedData: CompletionData = {};
      completionsData?.forEach(completion => {
        if (!organizedData[completion.habit_id]) {
          organizedData[completion.habit_id] = {};
        }
        organizedData[completion.habit_id][completion.completed_at] = true;
      });
      setCompletionData(organizedData);
    }

    setLoading(false);
  }, [user, currentMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1));
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  };

  const getCompletionStatus = (date: Date, habitId: string) => {
    if (selectedHabit === 'all') {
      // For "all habits" view, show if ANY habit was completed that day
      return habits.some(habit => completionData[habit.id]?.[format(date, 'yyyy-MM-dd')]);
    } else {
      // For specific habit view
      return completionData[selectedHabit]?.[format(date, 'yyyy-MM-dd')] || false;
    }
  };

  const getCompletionCount = (date: Date) => {
    if (selectedHabit === 'all') {
      return habits.filter(habit => completionData[habit.id]?.[format(date, 'yyyy-MM-dd')]).length;
    }
    return getCompletionStatus(date, selectedHabit) ? 1 : 0;
  };

  const getMonthStats = () => {
    const days = getDaysInMonth();
    let totalCompletions = 0;
    let completedDays = 0;

    days.forEach(day => {
      const count = getCompletionCount(day);
      if (count > 0) {
        totalCompletions += count;
        completedDays += 1;
      }
    });

    const totalPossible = selectedHabit === 'all' ? days.length * habits.length : days.length;
    const completionRate = totalPossible > 0 ? (totalCompletions / totalPossible) * 100 : 0;

    return {
      totalCompletions,
      completedDays,
      totalDays: days.length,
      completionRate: Math.round(completionRate)
    };
  };

  return {
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
    fetchData,
  };
};