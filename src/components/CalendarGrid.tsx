"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle } from 'lucide-react';
import { format, isSameDay } from 'date-fns';

interface CalendarGridProps {
  loading: boolean;
  days: Date[];
  getCompletionStatus: (date: Date, habitId: string) => boolean;
  getCompletionCount: (date: Date) => number;
  selectedHabit: string;
  completionData: any;
}

const CalendarGrid = ({
  loading,
  days,
  getCompletionStatus,
  getCompletionCount,
  selectedHabit,
  completionData
}: CalendarGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-7 gap-2">
        {[...Array(35)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  const firstDayOfMonth = days[0].getDay();
  const emptyCells = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center font-semibold text-sm text-muted-foreground">
              {day}
            </div>
          ))}

          {/* Empty cells for days before the first day of the month */}
          {emptyCells.map(i => (
            <div key={`empty-${i}`} className="h-20 border rounded-lg bg-gray-50"></div>
          ))}

          {/* Calendar days */}
          {days.map(day => {
            const isCompleted = getCompletionStatus(day, selectedHabit);
            const completionCount = getCompletionCount(day);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toISOString()}
                className={`h-20 border rounded-lg p-2 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  isToday ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'
                } ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}
              >
                <span className={`text-sm font-medium ${isToday ? 'text-primary' : ''}`}>
                  {format(day, 'd')}
                </span>
                {isCompleted && (
                  <div className="mt-1 flex items-center gap-1">
                    {selectedHabit === 'all' ? (
                      <>
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-600 font-medium">{completionCount}</span>
                      </>
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarGrid;