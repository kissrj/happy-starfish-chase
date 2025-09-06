"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Target, Flame, Award } from 'lucide-react';
import { HabitInsight } from '@/hooks/useHabitInsights';

interface HabitInsightsSummaryProps {
  insights: HabitInsight[];
}

const HabitInsightsSummary = ({ insights }: HabitInsightsSummaryProps) => {
  if (insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Insights Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No insights available.</p>
        </CardContent>
      </Card>
    );
  }

  const avgCompletionRate = Math.round(
    insights.reduce((sum, insight) => sum + insight.completionRate, 0) / insights.length
  );

  const totalCurrentStreaks = insights.reduce((sum, insight) => sum + insight.currentStreak, 0);
  const avgCurrentStreak = Math.round(totalCurrentStreaks / insights.length);

  const bestPerformingHabit = insights.reduce((best, current) =>
    current.completionRate > best.completionRate ? current : best
  );

  const improvingHabits = insights.filter(i => i.weeklyTrend === 'up').length;
  const decliningHabits = insights.filter(i => i.weeklyTrend === 'down').length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Completion Rate</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgCompletionRate}%</div>
          <p className="text-xs text-muted-foreground">
            Average of all habits
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Current Streak</CardTitle>
          <Flame className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgCurrentStreak}</div>
          <p className="text-xs text-muted-foreground">
            Consecutive days
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Improving Habits</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{improvingHabits}</div>
          <p className="text-xs text-muted-foreground">
            Positive weekly trend
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Best Performance</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{bestPerformingHabit.completionRate}%</div>
          <p className="text-xs text-muted-foreground truncate">
            {bestPerformingHabit.name}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HabitInsightsSummary;