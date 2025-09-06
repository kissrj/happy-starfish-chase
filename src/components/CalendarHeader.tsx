"use client";

import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

interface CalendarHeaderProps {
  currentMonth: Date;
  onNavigateMonth: (direction: 'prev' | 'next') => void;
}

const CalendarHeader = ({ currentMonth, onNavigateMonth }: CalendarHeaderProps) => {
  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Button asChild variant="outline" size="sm">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Habit Calendar
          </h1>
          <div></div> {/* Spacer for flex layout */}
        </div>
      </header>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => onNavigateMonth('prev')}>
          ← Previous Month
        </Button>
        <h2 className="text-2xl font-bold text-center">
          {format(currentMonth, 'MMMM yyyy', { locale: enUS })}
        </h2>
        <Button variant="outline" onClick={() => onNavigateMonth('next')}>
          Next Month →
        </Button>
      </div>
    </>
  );
};

export default CalendarHeader;