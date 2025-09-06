"use client";

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';
import { loadAndScheduleReminders, requestNotificationPermission } from '@/utils/notifications';

export interface Habit {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  completed_today: boolean;
  reminder_time?: string;
  goal_type?: string;
  goal_target?: number;
  category?: string;
}

export const useHabits = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHabits = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const today = new Date().toISOString().split('T')[0];

    const { data: habitsData, error: habitsError } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: false });

    if (habitsError) {
      showError('Failed to load habits.');
      console.error(habitsError);
      setLoading(false);
      return;
    }

    const { data: completionsData, error: completionsError } = await supabase
      .from('habit_completions')
      .select('habit_id')
      .eq('completed_at', today);

    if (completionsError) {
      showError('Failed to load habit status.');
      console.error(completionsError);
    }

    const completedHabitIds = new Set(completionsData?.map(c => c.habit_id) || []);

    const habitsWithCompletion = habitsData.map(habit => ({
      ...habit,
      completed_today: completedHabitIds.has(habit.id),
    }));

    setHabits(habitsWithCompletion);

    // Schedule reminders for habits that have them
    loadAndScheduleReminders(habitsWithCompletion);

    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  // Request notification permission on app load
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const updateHabits = useCallback((newHabits: Habit[]) => {
    setHabits(newHabits);
  }, []);

  return {
    habits,
    loading,
    fetchHabits,
    updateHabits,
  };
};