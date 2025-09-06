"use client";

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface TrendData {
  day: string;
  completed: number;
  total: number;
}

export const useHabitTrends = () => {
  const { user } = useAuth();
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrends = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const today = new Date();
    const sevenDaysAgo = subDays(today, 6);
    const dateInterval = eachDayOfInterval({ start: sevenDaysAgo, end: today });

    // Get all habits for the user
    const { data: habitsData, error: habitsError } = await supabase
      .from('habits')
      .select('id, created_at')
      .eq('user_id', user.id);

    if (habitsError) {
      console.error('Error fetching habits for trends:', habitsError);
      setLoading(false);
      return;
    }

    // Get completions for the last 7 days
    const { data: completionsData, error: completionsError } = await supabase
      .from('habit_completions')
      .select('completed_at, habit_id')
      .eq('user_id', user.id)
      .gte('completed_at', format(sevenDaysAgo, 'yyyy-MM-dd'));

    if (completionsError) {
      console.error('Error fetching completions for trends:', completionsError);
      setLoading(false);
      return;
    }

    const processedData = dateInterval.map(date => {
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      // Count how many habits were active on this day
      const totalHabitsOnDay = habitsData?.filter(h => new Date(h.created_at) <= date).length || 0;
      
      // Count how many were completed on this day
      const completedCount = completionsData?.filter(c => c.completed_at === formattedDate).length || 0;

      return {
        day: format(date, 'EEE', { locale: ptBR }), // e.g., 'Seg'
        completed: completedCount,
        total: totalHabitsOnDay,
      };
    });

    setTrendData(processedData);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTrends();
  }, [fetchTrends]);

  return { trendData, loading };
};