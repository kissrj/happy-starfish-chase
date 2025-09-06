"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MonthlyStatsProps {
  stats: {
    totalCompletions: number;
    completedDays: number;
    totalDays: number;
    completionRate: number;
  };
}

const MonthlyStats = ({ stats }: MonthlyStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Completions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-primary">{stats.totalCompletions}</p>
        </CardContent>
      </Card>
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Active Days</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-600">{stats.completedDays}</p>
        </CardContent>
      </Card>
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-blue-600">{stats.completionRate}%</p>
        </CardContent>
      </Card>
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Tracked Habits</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-purple-600">1</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyStats;