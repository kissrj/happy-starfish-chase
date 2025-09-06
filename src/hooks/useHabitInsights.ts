"use client";

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay } from 'date-fns';

export interface HabitInsight {
  id: string;
  name: string;
  category?: string;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  weeklyTrend: 'up' | 'down' | 'stable';
  monthlyTrend: 'up' | 'down' | 'stable';
  bestDay: string;
  worstDay: string;
  recommendation: string;
}

export const useHabitInsights = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<HabitInsight[]>([]);
  const [loading, setLoading] = useState(true);

  const analyzeHabit = useCallback(async (habit: any) => {
    if (!user) return null;

    // Get completion data for the last 30 days
    const thirtyDaysAgo = subDays(new Date(), 30);
    const { data: completions, error } = await supabase
      .from('habit_completions')
      .select('completed_at')
      .eq('habit_id', habit.id)
      .gte('completed_at', format(thirtyDaysAgo, 'yyyy-MM-dd'))
      .order('completed_at', { ascending: true });

    if (error) {
      console.error('Error fetching completions for habit:', habit.id, error);
      return null;
    }

    const completionDates = completions?.map(c => new Date(c.completed_at + 'T00:00:00')) || [];

    // Calculate completion rate
    const totalDays = 30;
    const completionRate = (completionDates.length / totalDays) * 100;

    // Calculate streaks
    const currentStreak = calculateCurrentStreak(completionDates);
    const longestStreak = calculateLongestStreak(completionDates);

    // Calculate trends
    const weeklyTrend = calculateTrend(completionDates, 7);
    const monthlyTrend = calculateTrend(completionDates, 30);

    // Find best and worst days
    const { bestDay, worstDay } = findBestWorstDays(completionDates);

    // Generate recommendation
    const recommendation = generateRecommendation(habit, completionRate, currentStreak, weeklyTrend);

    return {
      id: habit.id,
      name: habit.name,
      category: habit.category,
      completionRate: Math.round(completionRate),
      currentStreak,
      longestStreak,
      totalCompletions: completionDates.length,
      weeklyTrend,
      monthlyTrend,
      bestDay,
      worstDay,
      recommendation,
    };
  }, [user]);

  const calculateCurrentStreak = (dates: Date[]): number => {
    if (dates.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = subDays(today, 1);

    let streak = 0;
    let checkDate = today;

    // Check if today or yesterday is completed
    const todayCompleted = dates.some(d => isSameDay(d, today));
    const yesterdayCompleted = dates.some(d => isSameDay(d, yesterday));

    if (todayCompleted) {
      streak = 1;
      checkDate = yesterday;
    } else if (yesterdayCompleted) {
      streak = 1;
      checkDate = subDays(yesterday, 1);
    } else {
      return 0;
    }

    // Count consecutive days
    while (true) {
      const isCompleted = dates.some(d => isSameDay(d, checkDate));
      if (isCompleted) {
        streak++;
        checkDate = subDays(checkDate, 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const calculateLongestStreak = (dates: Date[]): number => {
    if (dates.length === 0) return 0;

    let longest = 0;
    let current = 0;

    for (let i = 0; i < dates.length; i++) {
      if (i === 0) {
        current = 1;
      } else {
        const prevDate = dates[i - 1];
        const currentDate = dates[i];
        if (isSameDay(currentDate, subDays(prevDate, -1))) {
          current++;
        } else {
          current = 1;
        }
      }
      if (current > longest) {
        longest = current;
      }
    }

    return longest;
  };

  const calculateTrend = (dates: Date[], days: number): 'up' | 'down' | 'stable' => {
    const halfPoint = Math.floor(dates.length / 2);
    const firstHalf = dates.slice(0, halfPoint).length;
    const secondHalf = dates.slice(halfPoint).length;

    const firstHalfRate = firstHalf / (days / 2);
    const secondHalfRate = secondHalf / (days / 2);

    if (secondHalfRate > firstHalfRate * 1.1) return 'up';
    if (secondHalfRate < firstHalfRate * 0.9) return 'down';
    return 'stable';
  };

  const findBestWorstDays = (dates: Date[]) => {
    const dayCounts: { [key: string]: number } = {};
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    dates.forEach(date => {
      const dayName = dayNames[date.getDay()];
      dayCounts[dayName] = (dayCounts[dayName] || 0) + 1;
    });

    const sortedDays = Object.entries(dayCounts).sort(([,a], [,b]) => b - a);
    const bestDay = sortedDays[0]?.[0] || 'N/A';
    const worstDay = sortedDays[sortedDays.length - 1]?.[0] || 'N/A';

    return { bestDay, worstDay };
  };

  const generateRecommendation = (habit: any, completionRate: number, currentStreak: number, trend: string): string => {
    if (completionRate >= 80) {
      return `Excellent! You are maintaining ${habit.name} consistently. Keep it up!`;
    } else if (currentStreak >= 7) {
      return `You are on a good streak with ${habit.name}. Try to keep the momentum!`;
    } else if (trend === 'up') {
      return `Your trend with ${habit.name} is improving. Keep up the good work!`;
    } else if (trend === 'down') {
      return `Your frequency with ${habit.name} has decreased. How about setting a daily reminder?`;
    } else {
      return `To improve with ${habit.name}, try to establish a consistent routine.`;
    }
  };

  const fetchInsights = useCallback(async () => {
    if (!user) return;

    setLoading(true);

    const { data: habits, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      showError('Failed to load habits for analysis.');
      console.error(error);
      setLoading(false);
      return;
    }

    const insightsPromises = habits?.map(analyzeHabit) || [];
    const insightsResults = await Promise.all(insightsPromises);
    const validInsights = insightsResults.filter(insight => insight !== null) as HabitInsight[];

    setInsights(validInsights);
    setLoading(false);
  }, [user, analyzeHabit]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return {
    insights,
    loading,
    fetchInsights,
  };
};