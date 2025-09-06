export type AchievementType = 'STREAK' | 'TOTAL_COMPLETIONS' | 'CATEGORY_COMPLETIONS';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: AchievementType;
  threshold: number;
  icon: string;
  meta?: {
    category?: string;
  };
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  achievements: Achievement; // This will be used for joined data
}