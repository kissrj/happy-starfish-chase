"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const CalendarLegend = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Legend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border rounded bg-green-50 border-green-200"></div>
            <span className="text-sm">Day with completion</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border rounded border-primary bg-primary/5"></div>
            <span className="text-sm">Today</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm">Habit completed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarLegend;