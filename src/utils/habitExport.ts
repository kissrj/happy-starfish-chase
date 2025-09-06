"use client";

import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';
import { exportToCSV } from './exportData';
import { format } from 'date-fns';
import { Habit } from '@/hooks/useHabits';

export const exportHabitsData = async (habits: Habit[], userId: string) => {
  // Fetch all habit completions for export
  const { data: completionsData, error: completionsError } = await supabase
    .from('habit_completions')
    .select('habit_id, completed_at')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });

  if (completionsError) {
    showError('Failed to load habit data for export.');
    return;
  }

  const exportData = habits.map(habit => {
    const completions = completionsData?.filter(c => c.habit_id === habit.id) || [];
    return {
      Name: habit.name,
      Description: habit.description || '',
      Category: habit.category || '',
      'Creation Date': habit.created_at.split('T')[0],
      'Total Completions': completions.length,
      'Last Completion': completions.length > 0 ? completions[0].completed_at : '',
    };
  });

  exportToCSV(exportData, `habits_${format(new Date(), 'yyyy-MM-dd')}`);
};