import { supabase } from '@/integrations/supabase/client';
import { Achievement, UserAchievement } from '@/types/achievements';

/**
 * Fetches all available achievements from the database.
 */
export const getAchievements = async (): Promise<Achievement[]> => {
  const { data, error } = await supabase.from('achievements').select('*');
  if (error) {
    console.error('Error fetching achievements:', error);
    throw error;
  }
  return data || [];
};

/**
 * Fetches all achievements unlocked by a specific user.
 * @param userId - The ID of the user.
 */
export const getUserAchievements = async (userId: string): Promise<UserAchievement[]> => {
  const { data, error } = await supabase
    .from('user_achievements')
    .select('*, achievements(*)')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user achievements:', error);
    throw error;
  }
  return data || [];
};

/**
 * Unlocks a new achievement for a user.
 * @param userId - The ID of the user.
 * @param achievementId - The ID of the achievement to unlock.
 */
export const unlockAchievement = async (userId: string, achievementId: string) => {
  const { data, error } = await supabase
    .from('user_achievements')
    .insert({ user_id: userId, achievement_id: achievementId })
    .select('*, achievements(*)')
    .single();

  if (error) {
    // Ignore unique constraint violation errors, as it means the achievement is already unlocked.
    if (error.code !== '23505') {
      console.error('Error unlocking achievement:', error);
      throw error;
    }
    return null;
  }
  return data as UserAchievement;
};