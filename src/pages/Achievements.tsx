"use client";

import React from 'react';
import { useAchievements } from '@/hooks/useAchievements';
import AchievementCard from '@/components/AchievementCard';
import { Skeleton } from '@/components/ui/skeleton';

const AchievementsPage = () => {
  const { allAchievements, userAchievements, loading } = useAchievements();

  const unlockedAchievementIds = new Set(userAchievements.map(ua => ua.achievement_id));

  const getUnlockedInfo = (achievementId: string) => {
    const userAchievement = userAchievements.find(ua => ua.achievement_id === achievementId);
    return {
      unlocked: unlockedAchievementIds.has(achievementId),
      unlockedAt: userAchievement?.unlocked_at,
    };
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Suas Conquistas</h1>
        <p className="text-muted-foreground">
          Veja as medalhas que você ganhou por manter seus hábitos.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-4 rounded-lg border p-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allAchievements.map(achievement => {
            const { unlocked, unlockedAt } = getUnlockedInfo(achievement.id);
            return (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                unlocked={unlocked}
                unlockedAt={unlockedAt}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AchievementsPage;