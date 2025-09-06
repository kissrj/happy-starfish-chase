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
        <CardTitle>Calendário de Progresso</CardTitle>
        <CardDescription>Clique em uma data para marcar/desmarcar a conclusão do hábito.</CardDescription>
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
              Marcar {format(selectedCalendarDate, 'dd/MM/yyyy')}
            </Button>
            <Button
              variant="outline"
              onClick={() => onUnmarkDate(selectedCalendarDate)}
              disabled={!isSelectedDateCompleted || isSelectedDateFuture}
            >
              Desmarcar {format(selectedCalendarDate, 'dd/MM/yyyy')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HabitCalendar;