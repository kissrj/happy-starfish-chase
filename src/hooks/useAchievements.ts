import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthProvider';
import { getAchievements, getUserAchievements } from '@/services/achievementService';
import { Achievement, UserAchievement } from '@/types/achievements';
import { showError } from '@/utils/toast';

export const useAchievements = () => {
  const { user } = useAuth();

  const { data: achievements = [], isLoading: isLoadingAchievements } = useQuery<Achievement[]>({
    queryKey: ['achievements'],
    queryFn: async () => {
      try {
        return await getAchievements();
      } catch (error) {
        showError('Could not load achievements.');
        return [];
      }
    },
  });

  const { data: userAchievements = [], isLoading: isLoadingUserAchievements } = useQuery<UserAchievement[]>({
    queryKey: ['userAchievements', user?.id],
    queryFn: async () => {
      if (!user) return [];
      try {
        return await getUserAchievements(user.id);
      } catch (error) {
        showError('Could not load your unlocked achievements.');
        return [];
      }
    },
    enabled: !!user,
  });

  const unlockedAchievementIds = new Set(userAchievements.map(ua => ua.achievement_id));

  return {
    achievements,
    userAchievements,
    unlockedAchievementIds,
    isLoading: isLoadingAchievements || isLoadingUserAchievements,
  };
};