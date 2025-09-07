"use client";

import React from 'react';
import StreakCounter from '@/components/StreakCounter';
import AchievementsPanel from '@/components/AchievementsPanel';
import HabitTrendsChart from '@/components/HabitTrendsChart';
import DailySummary from '@/components/DailySummary';
import { Habit } from '@/hooks/useHabits';
import { DailySummaryData } from '@/hooks/useDailySummary';
import { Achievement, UserAchievement } from '@/types/achievements';

interface DashboardSummarySectionProps {
  totalHabits: number;
  completedToday: number;
  dailySummary: DailySummaryData;
  currentStreak: number;
  longestStreak: number;
  achievements: Achievement[];
  userAchievements: UserAchievement[];
}

const DashboardSummarySection = ({
  totalHabits,
  completedToday,
  dailySummary,
  currentStreak,
  longestStreak,
  achievements,
  userAchievements,
}: DashboardSummarySectionProps) => {
  return (
    <>
      <StreakCounter
        currentStreak={currentStreak}
        longestStreak={longestStreak}
        totalHabits={totalHabits}
        completedToday={completedToday}
        unlockedAchievementsCount={userAchievements.length}
        totalAchievementsCount={achievements.length}
      />

      <AchievementsPanel />

      <HabitTrendsChart />

      <DailySummary
        total={dailySummary.total}
        completed={dailySummary.completed}
        remaining={dailySummary.remaining}
      />
    </>
  );
};

export default DashboardSummarySection;