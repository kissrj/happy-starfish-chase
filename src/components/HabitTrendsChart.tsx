import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useHabitTrends } from '@/hooks/useHabitTrends';
import { Skeleton } from '@/components/ui/skeleton';

const HabitTrendsChart: React.FC = () => {
  const { trendData, loading } = useHabitTrends();

  if (loading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Weekly Completion Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Weekly Completion Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={trendData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'completed') return [value, 'Completed'];
                  if (name === 'total') return [value, 'Total Habits'];
                  return [value, name];
                }}
              />
              <Legend />
              <Bar dataKey="completed" name="Completed" fill="#10b981" />
              <Bar dataKey="total" name="Total Habits" fill="#94a3b8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitTrendsChart;