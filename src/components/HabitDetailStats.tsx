import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Flame, Calendar, Target, TrendingUp } from 'lucide-react';

interface HabitDetailStatsProps {
  habitName: string;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  totalCompletions: number;
  goal?: {
    type: 'daily' | 'weekly' | 'monthly';
    target: number;
    current: number;
  };
}

const HabitDetailStats: React.FC<HabitDetailStatsProps> = ({ 
  habitName,
  currentStreak,
  longestStreak,
  completionRate,
  totalCompletions,
  goal
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Flame className="mr-2 h-5 w-5 text-orange-500" />
            Streak Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Current Streak</span>
                <span className="text-sm font-bold">{currentStreak} days</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Longest Streak</span>
                <span className="text-sm font-bold">{longestStreak} days</span>
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Completion Rate</span>
                <span className="text-sm font-bold">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5 text-blue-500" />
            Habit Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Total Completions</span>
                <span className="text-sm font-bold">{totalCompletions}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Habit</span>
                <span className="text-sm font-bold">{habitName}</span>
              </div>
            </div>
            {goal && (
              <div className="pt-4 border-t">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">
                    {goal.type.charAt(0).toUpperCase() + goal.type.slice(1)} Goal
                  </span>
                  <span className="text-sm font-bold">{goal.current}/{goal.target}</span>
                </div>
                <Progress value={(goal.current / goal.target) * 100} className="h-2" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HabitDetailStats;