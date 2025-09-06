"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Habit } from '@/hooks/useCalendar';

interface HabitFilterProps {
  habits: Habit[];
  selectedHabit: string;
  onHabitChange: (habitId: string) => void;
}

const HabitFilter = ({ habits, selectedHabit, onHabitChange }: HabitFilterProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Filter by Habit</CardTitle>
      </CardHeader>
      <CardContent>
        <select
          value={selectedHabit}
          onChange={(e) => onHabitChange(e.target.value)}
          className="w-full p-2 border rounded-md bg-white"
        >
          <option value="all">All Habits</option>
          {habits.map(habit => (
            <option key={habit.id} value={habit.id}>
              {habit.name} {habit.category ? `(${habit.category})` : ''}
            </option>
          ))}
        </select>
      </CardContent>
    </Card>
  );
};

export default HabitFilter;