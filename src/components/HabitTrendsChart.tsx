import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the chart
const chartData = [
  { day: 'Mon', completed: 4, total: 5 },
  { day: 'Tue', completed: 3, total: 5 },
  { day: 'Wed', completed: 5, total: 5 },
  { day: 'Thu', completed: 2, total: 5 },
  { day: 'Fri', completed: 4, total: 5 },
  { day: 'Sat', completed: 1, total: 3 },
  { day: 'Sun', completed: 3, total: 5 },
];

const HabitTrendsChart: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Weekly Completion Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'completed') return [value, 'Completed'];
                  if (name === 'total') return [value, 'Total Habits'];
                  return [value, name];
                }}
              />
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