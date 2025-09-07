"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';
import { format, subDays, eachDayOfInterval } from 'date-fns';

export interface HabitDetail {
  id: string;
  name: string;
  description: string | null;
  goal_type?: string;
  goal_target?: number;
  category?: string;
  completed_today: boolean;
  reminder_time?: string;
}

export const useHabitDetail = (habitId: string | undefined) => {
  const { user } = useAuth();
  const [habit, setHabit] = useState<HabitDetail | null>(null);
  const [completedDates, setCompletedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  const fetchHabitDetails = async () => {
    if (!habitId || !user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch habit details
      const { data: habitData, error: habitError } = await supabase
        .from('habits')
        .select('*')
        .eq('id', habitId)
        .eq('user_id', user.id)
        .single();

      if (habitError) {
        showError('Failed to load habit details.');
        console.error(habitError);
        setLoading(false);
        return;
      }

      // Fetch completion data for the last 90 days
      const ninetyDaysAgo = subDays(new Date(), 90);
      const { data: completionsData, error: completionsError } = await supabase
        .from('habit_completions')
        .select('completed_at')
        .eq('habit_id', habitId)
        .eq('user_id', user.id)
        .gte('completed_at', format(ninetyDaysAgo, 'yyyy-MM-dd'))
        .order('completed_at', { ascending: true });

      if (completionsError) {
        showError('Failed to load habit completion data.');
        console.error(completionsError);
      }

      // Check if completed today
      const today = new Date().toISOString().split('T')[0];
      const completedToday = completionsData?.some(c => c.completed_at === today) || false;

      // Set habit with completion status
      const habitWithCompletion = {
        ...habitData,
        completed_today: completedToday,
      };

      setHabit(habitWithCompletion);

      // Process completion dates
      const dates = completionsData?.map(c => new Date(c.completed_at + 'T00:00:00')) || [];
      setCompletedDates(dates);

      // Calculate streaks
      const { currentStreak: calculatedCurrentStreak, longestStreak: calculatedLongestStreak } = calculateStreaks(dates);
      setCurrentStreak(calculatedCurrentStreak);
      setLongestStreak(calculatedLongestStreak);

    } catch (error) {
      showError('Failed to load habit details.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStreaks = (dates: Date[]) => {
    if (!dates || dates.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());
    let longest = 0;
    let current = 0;
    let tempStreak = 1;

    // Calculate longest streak
    for (let i = 1; i < sortedDates.length; i++) {
      const diffTime = sortedDates[i].getTime() - sortedDates[i - 1].getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        tempStreak++;
      } else {
        longest = Math.max(longest, tempStreak);
        tempStreak = 1;
      }
    }
    longest = Math.max(longest, tempStreak);

    // Calculate current streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastDate = sortedDates[sortedDates.length - 1];
    if (!lastDate) {
      return { currentStreak: 0, longestStreak: longest };
    }

    // Check if last completion was today or yesterday
    const isToday = lastDate.getTime() === today.getTime();
    const isYesterday = lastDate.getTime() === yesterday.getTime();

    if (!isToday && !isYesterday) {
      return { currentStreak: 0, longestStreak: longest };
    }

    current = 1;
    for (let i = sortedDates.length - 2; i >= 0; i--) {
      const diffTime = sortedDates[i + 1].getTime() - sortedDates[i].getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        current++;
      } else {
        break;
      }
    }

    return { currentStreak: current, longestStreak: longest };
  };

  const handleMarkDate = async (date: Date) => {
    if (!habit || !user) return;

    const dateString = format(date, 'yyyy-MM-dd');

    try {
      const { error } = await supabase
        .from('habit_completions')
        .insert({
          habit_id: habit.id,
          user_id: user.id,
          completed_at: dateString,
        });

      if (error) {
        showError('Failed to mark date as completed.');
        console.error(error);
        return;
      }

      // Update local state
      const newDate = new Date(dateString + 'T00:00:00');
      setCompletedDates(prev => [...prev, newDate].sort((a, b) => a.getTime() - b.getTime()));

      // Recalculate streaks
      const updatedDates = [...completedDates, newDate];
      const { currentStreak: newCurrent, longestStreak: newLongest } = calculateStreaks(updatedDates);
      setCurrentStreak(newCurrent);
      setLongestStreak(newLongest);

      // Update habit completion status if marking today
      const today = new Date().toISOString().split('T')[0];
      if (dateString === today) {
        setHabit(prev => prev ? { ...prev, completed_today: true } : null);
      }

    } catch (error) {
      showError('Failed to mark date as completed.');
      console.error(error);
    }
  };

  const handleUnmarkDate = async (date: Date) => {
    if (!habit || !user) return;

    const dateString = format(date, 'yyyy-MM-dd');

    try {
      const { error } = await supabase
        .from('habit_completions')
        .delete()
        .match({
          habit_id: habit.id,
          user_id: user.id,
          completed_at: dateString,
        });

      if (error) {
        showError('Failed to unmark date.');
        console.error(error);
        return;
      }

      // Update local state
      setCompletedDates(prev => prev.filter(d => 
        format(d, 'yyyy-MM-dd') !== dateString
      ));

      // Recalculate streaks
      const updatedDates = completedDates.filter(d => 
        format(d, 'yyyy-MM-dd') !== dateString
      );
      const { currentStreak: newCurrent, longestStreak: newLongest } = calculateStreaks(updatedDates);
      setCurrentStreak(newCurrent);
      setLongestStreak(newLongest);

      // Update habit completion status if unmarking today
      const today = new Date().toISOString().split('T')[0];
      if (dateString === today) {
        setHabit(prev => prev ? { ...prev, completed_today: false } : null);
      }

    } catch (error) {
      showError('Failed to unmark date.');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHabitDetails();
  }, [habitId, user]);

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