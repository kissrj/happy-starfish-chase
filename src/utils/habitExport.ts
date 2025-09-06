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
    showError('Falha ao carregar dados de hábitos para exportação.');
    return;
  }

  const exportData = habits.map(habit => {
    const completions = completionsData?.filter(c => c.habit_id === habit.id) || [];
    return {
      Nome: habit.name,
      Descrição: habit.description || '',
      Categoria: habit.category || '',
      'Data de Criação': habit.created_at.split('T')[0],
      'Total de Conclusões': completions.length,
      'Última Conclusão': completions.length > 0 ? completions[0].completed_at : '',
    };
  });

  exportToCSV(exportData, `habitos_${format(new Date(), 'yyyy-MM-dd')}`);
};