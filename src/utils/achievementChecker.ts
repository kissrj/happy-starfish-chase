import { supabase } from '@/integrations/supabase/client';
import { unlockAchievement } from '@/services/achievementService';
import { showSuccess } from './toast';

export const checkAndAwardAchievements = async (userId: string) => {
  try {
    // Check for streak achievements
    const { data: streakData } = await supabase
      .from('habit_completions')
      .select('completed_at')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(30);

    if (streakData) {
      const currentStreak = calculateCurrentStreak(streakData.map(s => new Date(s.completed_at)));
      
      if (currentStreak >= 7) {
        await unlockAchievement(userId, 'week-warrior-achievement-id'); // You'll need to get actual IDs
      }
      
      if (currentStreak >= 30) {
        await unlockAchievement(userId, 'habit-master-achievement-id');
      }
    }

    // Check for total completions
    const { count: totalCompletions } = await supabase
      .from('habit_completions')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    if (totalCompletions && totalCompletions >= 100) {
      await unlockAchievement(userId, 'consistency-king-achievement-id');
    }

    // You can add more checks for category-specific achievements here

  } catch (error) {
    console.error('Error checking achievements:', error);
  }
};

const calculateCurrentStreak = (completionDates: Date[]): number => {
  if (completionDates.length === 0) return 0;
  
  let streak = 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 1; i < completionDates.length; i++) {
    const prevDate = new Date(completionDates[i - 1]);
    const currentDate = new Date(completionDates[i]);
    prevDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    
    const diffTime = Math.abs(prevDate.getTime() - currentDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};