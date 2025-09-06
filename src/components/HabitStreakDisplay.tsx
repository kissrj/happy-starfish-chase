"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HabitStreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
}

const HabitStreakDisplay = ({ currentStreak, longestStreak }: HabitStreakDisplayProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Current Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-blue-600">{currentStreak} days</p>
        </CardContent>
      </Card>
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Longest Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-purple-600">{longestStreak} days</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HabitStreakDisplay;