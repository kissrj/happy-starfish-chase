"use client";

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { format, isSameDay, subDays, addDays, isFuture } from 'date-fns';

export interface HabitDetail {
  id: string;
  name: string;
  description: string | null;
  goal_type?: string;
  goal_target?: number;
  category?: string;
}

export const useHabitDetail = (habitId: string | undefined) => {
  const { user } = useAuth();
  const [habit, setHabit] = useState<HabitDetail | null>(null);
  const [completedDates, setCompletedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  const calculateStreaks = useCallback((dates: Date[]) => {
    if (dates.length === 0) {
      setCurrentStreak(0);
      setLongestStreak(0);
      return;
    }

    const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to start of day

    let current = 0;
    let longest = 0;
    let tempStreak = 0;

    // Calculate current streak
    let checkDateForCurrentStreak = today;
    const isTodayCompleted = sortedDates.some(d => isSameDay(d, today));
    const isYesterdayCompleted = sortedDates.some(d => isSameDay(d, subDays(today, 1)));

    if (isTodayCompleted) {
      current = 1;
      checkDateForCurrentStreak = subDays(today, 1);
    } else if (isYesterdayCompleted) {
      current = 1; // Streak continues from yesterday if today is not completed
      checkDateForCurrentStreak = subDays(today, 2);
    } else {
      current = 0;
    }

    if (current > 0) {
      let i = 0;
      while (true) {
        const targetDate = subDays(checkDateForCurrentStreak, i);
        const isCompleted = sortedDates.some(d => isSameDay(d, targetDate));
        if (isCompleted) {
          current++;
          i++;
        } else {
          break;
        }
      }
    }
    setCurrentStreak(current);

    // Calculate longest streak
    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prevDate = sortedDates[i - 1];
        const currentDate = sortedDates[i];
        // Check if current date is exactly one day after previous date
        if (isSameDay(currentDate, addDays(prevDate, 1))) {
          tempStreak++;
        } else if (!isSameDay(currentDate, prevDate)) { // If not consecutive and not same day, reset
          tempStreak = 1;
        }
      }
      if (tempStreak > longest) {
        longest = tempStreak;
      }
    }
    setLongestStreak(longest);
  }, []);

  const fetchHabitDetails = useCallback(async () => {
    if (!habitId) return;
    setLoading(true);

    const { data: habitData, error: habitError } = await supabase
      .from('habits')
      .select('*')
      .eq('id', habitId)
      .single();

    if (habitError || !habitData) {
      showError('Falha ao carregar os detalhes do hábito.');
      setLoading(false);
      return;
    }
    setHabit(habitData);

    const { data: completionsData, error: completionsError } = await supabase
      .from('habit_completions')
      .select('completed_at')
      .eq('habit_id', habitId);

    if (completionsError) {
      showError('Falha ao carregar o histórico do hábito.');
    } else {
      const dates = completionsData.map(c => new Date(c.completed_at + 'T00:00:00'));
      setCompletedDates(dates);
      calculateStreaks(dates); // Calculate streaks after fetching dates
    }

    setLoading(false);
  }, [habitId, calculateStreaks]);

  useEffect(() => {
    fetchHabitDetails();
  }, [fetchHabitDetails]);

  const handleMarkDate = async (selectedCalendarDate: Date) => {
    if (!selectedCalendarDate || !user || !habit) return;

    const formattedDate = format(selectedCalendarDate, 'yyyy-MM-dd');
    const isAlreadyCompleted = completedDates.some(d => isSameDay(d, selectedCalendarDate));

    if (isAlreadyCompleted) {
      showError('Hábito já marcado como concluído nesta data.');
      return;
    }

    const { error } = await supabase.from('habit_completions').insert({
      habit_id: habit.id,
      user_id: user.id,
      completed_at: formattedDate,
    });

    if (error) {
      showError('Erro ao marcar o hábito nesta data.');
      console.error(error);
    } else {
      showSuccess('Hábito marcado como concluído nesta data!');
      const newCompletedDates = [...completedDates, selectedCalendarDate];
      setCompletedDates(newCompletedDates);
      calculateStreaks(newCompletedDates);
    }
  };

  const handleUnmarkDate = async (selectedCalendarDate: Date) => {
    if (!selectedCalendarDate || !user || !habit) return;

    const formattedDate = format(selectedCalendarDate, 'yyyy-MM-dd');
    const isAlreadyCompleted = completedDates.some(d => isSameDay(d, selectedCalendarDate));

    if (!isAlreadyCompleted) {
      showError('Hábito não está marcado como concluído nesta data.');
      return;
    }

    const { error } = await supabase
      .from('habit_completions')
      .delete()
      .match({ habit_id: habit.id, completed_at: formattedDate });

    if (error) {
      showError('Erro ao desmarcar o hábito nesta data.');
      console.error(error);
    } else {
      showSuccess('Hábito desmarcado nesta data!');
      const newCompletedDates = completedDates.filter(d => !isSameDay(d, selectedCalendarDate));
      setCompletedDates(newCompletedDates);
      calculateStreaks(newCompletedDates);
    }
  };

  return {
    habit,
    completedDates,
    loading,
    currentStreak,
    longestStreak,
    handleMarkDate,
    handleUnmarkDate,
    fetchHabitDetails,
  };
};