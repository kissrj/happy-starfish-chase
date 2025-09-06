"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FinancialOverview from '@/components/FinancialOverview';

interface DailySummaryProps {
  total: number;
  completed: number;
  remaining: number;
}

const DailySummary = ({ total, completed, remaining }: DailySummaryProps) => {
  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Total Habits</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-primary">{total}</p>
        </CardContent>
      </Card>
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Completed Today</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-green-600">{completed}</p>
        </CardContent>
      </Card>
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Remaining Today</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-red-600">{remaining}</p>
        </CardContent>
      </Card>
      <FinancialOverview />
    </div>
  );
};

export default DailySummary;