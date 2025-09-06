import { supabase } from '@/integrations/supabase/client';
import { unlockAchievement } from '@/services/achievementService';
import { showSuccess } from './toast';

export const checkAndAwardAchievements = async (userId: string) => {
  try {
    // Get all achievements
    const { data: achievements } = await supabase
      .from('achievements')
      .select('*');

    if (!achievements) return;

    // Check for streak achievements
    const { data: streakData } = await supabase
      .from('habit_completions')
      .select('completed_at')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(30);

    if (streakData) {
      const currentStreak = calculateCurrentStreak(streakData.map(s => new Date(s.completed_at)));
      
      // Find streak achievements
      const weekWarrior = achievements.find(a => a.name === 'Week Warrior');
      const habitMaster = achievements.find(a => a.name === 'Habit Master');
      
      if (weekWarrior && currentStreak >= weekWarrior.threshold) {
        const unlocked = await unlockAchievement(userId, weekWarrior.id);
        if (unlocked) {
          showSuccess(`🏆 Conquista desbloqueada: ${weekWarrior.name}!`);
        }
      }
      
      if (habitMaster && currentStreak >= habitMaster.threshold) {
        const unlocked = await unlockAchievement(userId, habitMaster.id);
        if (unlocked) {
          showSuccess(`🏆 Conquista desbloqueada: ${habitMaster.name}!`);
        }
      }
    }

    // Check for total completions
    const { count: totalCompletions } = await supabase
      .from('habit_completions')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    if (totalCompletions) {
      const consistencyKing = achievements.find(a => a.name === 'Consistency King');
      const firstSteps = achievements.find(a => a.name === 'First Steps');
      
      if (firstSteps && totalCompletions >= firstSteps.threshold) {
        const unlocked = await unlockAchievement(userId, firstSteps.id);
        if (unlocked) {
          showSuccess(`🏆 Conquista desbloqueada: ${firstSteps.name}!`);
        }
      }
      
      if (consistencyKing && totalCompletions >= consistencyKing.threshold) {
        const unlocked = await unlockAchievement(userId, consistencyKing.id);
        if (unlocked) {
          showSuccess(`🏆 Conquista desbloqueada: ${consistencyKing.name}!`);
        }
      }
    }

    // Check for category-specific achievements
    const { data: categoryData } = await supabase
      .from('habit_completions')
      .select(`
        habits!inner(category)
      `)
      .eq('user_id', userId);

    if (categoryData) {
      const categoryCounts: { [key: string]: number } = {};
      
      categoryData.forEach(completion => {
        const category = completion.habits.category;
        if (category) {
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        }
      });

      // Check each category achievement
      const categoryAchievements = achievements.filter(a => a.type === 'CATEGORY_COMPLETIONS');
      
      for (const achievement of categoryAchievements) {
        const category = achievement.meta?.category;
        if (category && categoryCounts[category] >= achievement.threshold) {
          const unlocked = await unlockAchievement(userId, achievement.id);
          if (unlocked) {
            showSuccess(`🏆 Conquista desbloqueada: ${achievement.name}!`);
          }
        }
      }
    }

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