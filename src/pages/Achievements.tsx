import React from 'react';
import { useAchievements } from '@/hooks/useAchievements';
import AchievementCard from '@/components/AchievementCard';
import { Skeleton } from '@/components/ui/skeleton';

const AchievementsPage = () => {
  const { achievements, unlockedAchievementIds, isLoading } = useAchievements();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Achievements</h1>
      <p className="text-muted-foreground mb-8">
        Unlock achievements by completing your habits and staying consistent.
      </p>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map(achievement => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              isUnlocked={unlockedAchievementIds.has(achievement.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AchievementsPage;