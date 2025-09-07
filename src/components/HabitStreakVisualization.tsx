"use client";

import { useEffect, useState } from 'react';
import { Flame, TrendingUp, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HabitStreakVisualizationProps {
  currentStreak: number;
  longestStreak: number;
  habitName?: string;
}

const HabitStreakVisualization = ({ currentStreak, longestStreak, habitName }: HabitStreakVisualizationProps) => {
  const [animatedStreak, setAnimatedStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // Animate the streak number
    const timer = setTimeout(() => {
      setAnimatedStreak(currentStreak);
    }, 500);

    // Show celebration for milestones
    if (currentStreak > 0 && currentStreak % 7 === 0) {
      setShowCelebration(true);
      const celebrationTimer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(celebrationTimer);
    }

    return () => clearTimeout(timer);
  }, [currentStreak]);

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-red-500';
    if (streak >= 14) return 'text-orange-500';
    if (streak >= 7) return 'text-yellow-500';
    return 'text-gray-500';
  };

  const getStreakSize = (streak: number) => {
    if (streak >= 30) return 'text-6xl';
    if (streak >= 14) return 'text-5xl';
    if (streak >= 7) return 'text-4xl';
    return 'text-3xl';
  };

  const getFlameIntensity = (streak: number) => {
    if (streak >= 30) return 'animate-pulse';
    if (streak >= 14) return 'animate-bounce';
    if (streak >= 7) return 'animate-ping';
    return '';
  };

  return (
    <Card className="relative overflow-hidden">
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 opacity-20 animate-pulse" />
      )}
      
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Flame className={`h-6 w-6 ${getStreakColor(currentStreak)} ${getFlameIntensity(currentStreak)}`} />
          Current Streak
        </CardTitle>
        {habitName && (
          <p className="text-sm text-muted-foreground">{habitName}</p>
        )}
      </CardHeader>
      
      <CardContent className="text-center space-y-4">
        <div className={`font-bold ${getStreakColor(currentStreak)} ${getStreakSize(currentStreak)} transition-all duration-1000`}>
          {animatedStreak}
        </div>
        
        <div className="text-sm text-muted-foreground">
          days in a row
        </div>

        {currentStreak > 0 && (
          <div className="flex justify-center items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>Current: {currentStreak}</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="h-4 w-4 text-blue-500" />
              <span>Best: {longestStreak}</span>
            </div>
          </div>
        )}

        {currentStreak === 0 && (
          <div className="text-sm text-muted-foreground">
            Start your streak today! 🔥
          </div>
        )}

        {/* Streak milestones */}
        <div className="flex justify-center gap-2 mt-4">
          {[7, 14, 30, 60, 100].map(milestone => (
            <div
              key={milestone}
              className={`px-2 py-1 rounded-full text-xs ${
                currentStreak >= milestone
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              {milestone}
            </div>
          ))}
        </div>

        {/* Progress to next milestone */}
        {currentStreak > 0 && (
          <div className="mt-4">
            <div className="text-xs text-muted-foreground mb-1">
              Progress to next milestone
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div
                className="bg-gradient-to-r from-yellow-400 to-red-500 h-2 rounded-full transition-all duration-1000"
                style={{
                  width: `${Math.min((currentStreak % 7) / 7 * 100, 100)}%`
                }}
              />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {7 - (currentStreak % 7)} days to next milestone
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HabitStreakVisualization;