"use client";

import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, isSameDay, isFuture } from 'date-fns';

interface HabitCalendarProps {
  selectedCalendarDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  completedDates: Date[];
  onMarkDate: (date: Date) => void;
  onUnmarkDate: (date: Date) => void;
}

const HabitCalendar = ({
  selectedCalendarDate,
  onSelectDate,
  completedDates,
  onMarkDate,
  onUnmarkDate
}: HabitCalendarProps) => {
  const isSelectedDateCompleted = selectedCalendarDate ? completedDates.some(d => isSameDay(d, selectedCalendarDate)) : false;
  const isSelectedDateFuture = selectedCalendarDate ? isFuture(selectedCalendarDate) : false;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Calendar</CardTitle>
        <CardDescription>Click a date to mark/unmark habit completion.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <Calendar
          mode="single"
          selected={selectedCalendarDate}
          onSelect={onSelectDate}
          disabled={(date) => isFuture(date)} // Disable future dates
          initialFocus
          className="rounded-md border"
        />
        {selectedCalendarDate && (
          <div className="mt-4 flex gap-2">
            <Button
              onClick={() => onMarkDate(selectedCalendarDate)}
              disabled={isSelectedDateCompleted || isSelectedDateFuture}
            >
              Mark {format(selectedCalendarDate, 'MM/dd/yyyy')}
            </Button>
            <Button
              variant="outline"
              onClick={() => onUnmarkDate(selectedCalendarDate)}
              disabled={!isSelectedDateCompleted || isSelectedDateFuture}
            >
              Unmark {format(selectedCalendarDate, 'MM/dd/yyyy')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HabitCalendar;