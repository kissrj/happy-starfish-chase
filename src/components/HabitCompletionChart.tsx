"use client";

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, subDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface HabitCompletionChartProps {
  completedDates: Date[];
}

const HabitCompletionChart: React.FC<HabitCompletionChartProps> = ({ completedDates }) => {
  const chartData = React.useMemo(() => {
    const data = [];
    const today = new Date();
    // Convert completedDates to a Set of formatted strings for efficient lookup
    const completedDatesSet = new Set(completedDates.map(date => format(date, 'yyyy-MM-dd')));

    // Generate data for the last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = subDays(today, i);
      const formattedDate = format(date, 'yyyy-MM-dd');
      data.push({
        date: format(date, 'MMM dd'), // Format for X-axis display (e.g., "Oct 01")
        completed: completedDatesSet.has(formattedDate) ? 1 : 0, // 1 for completed, 0 for not
      });
    }
    return data;
  }, [completedDates]);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Histórico de Conclusão (Últimos 30 Dias)</CardTitle>
        <CardDescription>Visualização do seu progresso diário.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis
              domain={[0, 1]}
              ticks={[0, 1]}
              tickFormatter={(value: number) => (value === 1 ? 'Feito' : 'Não Feito')}
            />
            <Tooltip
              formatter={(value: number) => (value === 1 ? 'Feito' : 'Não Feito')}
              labelFormatter={(label: string) => `Data: ${label}`}
            />
            <Line
              type="stepAfter" // Use stepAfter to show clear daily states
              dataKey="completed"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default HabitCompletionChart;