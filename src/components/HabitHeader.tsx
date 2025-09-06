"use client";

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EditHabitDialog } from '@/components/EditHabitDialog';
import { HabitDetail } from '@/hooks/useHabitDetail';

interface HabitHeaderProps {
  habit: HabitDetail;
  onHabitUpdated: () => void;
}

const HabitHeader = ({ habit, onHabitUpdated }: HabitHeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Button asChild variant="outline" size="sm">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold text-gray-800">{habit.name}</h2>
          {habit.category && (
            <Badge variant="secondary">{habit.category}</Badge>
          )}
        </div>
        <EditHabitDialog habit={habit} onHabitUpdated={onHabitUpdated} />
      </div>
    </header>
  );
};

export default HabitHeader;