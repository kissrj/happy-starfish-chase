import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { differenceInCalendarDays, isToday, isYesterday } from 'date-fns';

const calculateStreaks = (completionDates: string[]): { currentStreak: number; longestStreak: number } => {
  if (!completionDates || completionDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const dates = [...new Set(completionDates)]
    .map(d => new Date(d))
    .sort((a, b) => a.getTime() - b.getTime());

  if (dates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  let longestStreak = 0;
  let currentStreak = 0;

  if (dates.length > 0) {
    longestStreak = 1;
    currentStreak = 1;
  }

  for (let i = 1; i < dates.length; i++) {
    if (differenceInCalendarDays(dates[i], dates[i - 1]) === 1) {
      currentStreak++;
    } else {
      longestStreak = Math.max(longestStreak, currentStreak);
      currentStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, currentStreak);

  const lastDate = dates[dates.length - 1];
  if (!isToday(lastDate) && !isYesterday(lastDate)) {
    currentStreak = 0;
  } else {
    currentStreak = 1;
    for (let i = dates.length - 2; i >= 0; i--) {
      if (differenceInCalendarDays(dates[i + 1], dates[i]) === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  return { currentStreak, longestStreak };
};

export const useStreak = () => {
  const { user } = useAuth();

  const { data: streaks, isLoading } = useQuery({
    queryKey: ['streaks', user?.id],
    queryFn: async () => {
      if (!user) return { currentStreak: 0, longestStreak: 0 };

      const { data, error } = await supabase
        .from('habit_completions')
        .select('completed_at')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: true });

      if (error) {
        console.error('Error fetching habit completions for streak:', error);
        return { currentStreak: 0, longestStreak: 0 };
      }

      const completionDates = data.map(item => item.completed_at);
      return calculateStreaks(completionDates);
    },
    enabled: !!user,
  });

  return {
    currentStreak: streaks?.currentStreak ?? 0,
    longestStreak: streaks?.longestStreak ?? 0,
    isLoading,
  };
};