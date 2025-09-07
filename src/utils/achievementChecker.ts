import { supabase } from '@/integrations/supabase/client';
import { getAchievements, unlockAchievement } from '@/services/achievementService';
import { showSuccess } from './toast';
import { differenceInCalendarDays, isToday, isYesterday } from 'date-fns';

const calculateCurrentStreak = (completions: { completed_at: string }[]): number => {
  if (!completions || completions.length === 0) {
    return 0;
  }

  const dates = [...new Set(completions.map(d => d.completed_at))]
    .map(d => new Date(d))
    .sort((a, b) => a.getTime() - b.getTime());

  if (dates.length === 0) {
    return 0;
  }

  const lastDate = dates[dates.length - 1];
  // Streak is broken if the last completion was not today or yesterday.
  if (!isToday(lastDate) && !isYesterday(lastDate)) {
    return 0;
  }

  let currentStreak = 1;
  for (let i = dates.length - 2; i >= 0; i--) {
    if (differenceInCalendarDays(dates[i + 1], dates[i]) === 1) {
      currentStreak++;
    } else {
      break;
    }
  }
  
  return currentStreak;
};

export const checkAndAwardAchievements = async (userId: string) => {
  try {
    // 1. Get all achievements and user's unlocked achievements
    const allAchievements = await getAchievements();
    const { data: userAchievementsData, error: userAchievementsError } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId);

    if (userAchievementsError) throw userAchievementsError;

    const unlockedAchievementIds = new Set(userAchievementsData.map(ua => ua.achievement_id));
    const achievementsToCheck = allAchievements.filter(a => !unlockedAchievementIds.has(a.id));

    if (achievementsToCheck.length === 0) {
      return; // No new achievements to check
    }

    // 2. Get user stats
    const { count: totalCompletions } = await supabase
      .from('habit_completions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    const { data: streakData } = await supabase
      .from('habit_completions')
      .select('completed_at')
      .eq('user_id', userId)
      .order('completed_at', { ascending: true });

    const currentStreak = calculateCurrentStreak(streakData || []);

    // 3. Check each achievement
    for (const achievement of achievementsToCheck) {
      let shouldUnlock = false;
      switch (achievement.type) {
        case 'STREAK':
          if (currentStreak >= achievement.threshold) {
            shouldUnlock = true;
          }
          break;
        case 'TOTAL_COMPLETIONS':
          if ((totalCompletions ?? 0) >= achievement.threshold) {
            shouldUnlock = true;
          }
          break;
      }

      if (shouldUnlock) {
        const unlocked = await unlockAchievement(userId, achievement.id);
        if (unlocked && unlocked.achievements) {
          showSuccess(`Achievement Unlocked: ${unlocked.achievements.name}!`);
        }
      }
    }
  } catch (error) {
    console.error('Error checking and awarding achievements:', error);
  }
};