"use client";

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';
import { subDays, format, differenceInCalendarDays } from 'date-fns';

export interface ArchivedHabit {
  id: string;
  name: string;
  description: string | null;
  category?: string;
  totalCompletions: number;
  longestStreak: number;
  lastCompletion: string | null;
  daysSinceLastCompletion: number;
}

export const useHabitArchive = () => {
  const { user } = useAuth();
  const [archivedHabits, setArchivedHabits] = useState<ArchivedHabit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArchivedHabits = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Get all habits for the user
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id);

      if (habitsError) {
        showError('Failed to load habits.');
        console.error(habitsError);
        setLoading(false);
        return;
      }

      // Get all completions for the last 30 days
      const thirtyDaysAgo = subDays(new Date(), 30);
      const { data: completionsData, error: completionsError } = await supabase
        .from('habit_completions')
        .select('habit_id, completed_at')
        .eq('user_id', user.id)
        .gte('completed_at', format(thirtyDaysAgo, 'yyyy-MM-dd'));

      if (completionsError) {
        showError('Failed to load habit completions.');
        console.error(completionsError);
        setLoading(false);
        return;
      }

      // Group completions by habit
      const completionsByHabit: { [habitId: string]: string[] } = {};
      completionsData?.forEach(completion => {
        if (!completionsByHabit[completion.habit_id]) {
          completionsByHabit[completion.habit_id] = [];
        }
        completionsByHabit[completion.habit_id].push(completion.completed_at);
      });

      // Filter habits that haven't been completed in the last 30 days
      const archivedHabitsData: ArchivedHabit[] = [];

      for (const habit of habitsData || []) {
        const habitCompletions = completionsByHabit[habit.id] || [];
        
        if (habitCompletions.length === 0) {
          // Habit has never been completed
          archivedHabitsData.push({
            id: habit.id,
            name: habit.name,
            description: habit.description,
            category: habit.category,
            totalCompletions: 0,
            longestStreak: 0,
            lastCompletion: null,
            daysSinceLastCompletion: differenceInCalendarDays(new Date(), new Date(habit.created_at)),
          });
        } else {
          // Check if the last completion was more than 30 days ago
          const lastCompletion = new Date(Math.max(...habitCompletions.map(d => new Date(d).getTime())));
          const daysSinceLastCompletion = differenceInCalendarDays(new Date(), lastCompletion);

          if (daysSinceLastCompletion > 30) {
            // Calculate stats
            const totalCompletions = habitCompletions.length;
            const longestStreak = calculateLongestStreak(habitCompletions);

            archivedHabitsData.push({
              id: habit.id,
              name: habit.name,
              description: habit.description,
              category: habit.category,
              totalCompletions,
              longestStreak,
              lastCompletion: format(lastCompletion, 'yyyy-MM-dd'),
              daysSinceLastCompletion,
            });
          }
        }
      }

      setArchivedHabits(archivedHabitsData);
    } catch (error) {
      showError('Failed to load archived habits.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const calculateLongestStreak = (completionDates: string[]): number => {
    if (completionDates.length === 0) return 0;

    const dates = [...new Set(completionDates)]
      .map(d => new Date(d))
      .sort((a, b) => a.getTime() - b.getTime());

    let longest = 0;
    let current = 0;

    for (let i = 0; i < dates.length; i++) {
      if (i === 0) {
        current = 1;
      } else {
        const prevDate = dates[i - 1];
        const currentDate = dates[i];
        if (differenceInCalendarDays(currentDate, prevDate) === 1) {
          current++;
        } else {
          current = 1;
        }
      }
      if (current > longest) {
        longest = current;
      }
    }

    return longest;
  };

  const reactivateHabit = useCallback(async (habitId: string) => {
    if (!user) return false;

    try {
      // Mark the habit as completed today to reactivate it
      const today = format(new Date(), 'yyyy-MM-dd');
      const { error } = await supabase
        .from('habit_completions')
        .insert({
          habit_id: habitId,
          user_id: user.id,
          completed_at: today,
        });

      if (error) {
        showError('Failed to reactivate habit.');
        console.error(error);
        return false;
      }

      // Remove from archived habits
      setArchivedHabits(prev => prev.filter(h => h.id !== habitId));
      return true;
    } catch (error) {
      showError('Failed to reactivate habit.');
      console.error(error);
      return false;
    }
  }, [user]);

  useEffect(() => {
    fetchArchivedHabits();
  }, [fetchArchivedHabits]);

  return {
    archivedHabits,
    loading,
    reactivateHabit,
    fetchArchivedHabits,
  };
};