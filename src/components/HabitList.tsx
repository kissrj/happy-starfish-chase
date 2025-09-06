"use client";

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Habit } from '@/hooks/useHabits';

interface HabitListProps {
  habits: Habit[];
  loading: boolean;
  searchTerm: string;
  selectedCategory: string;
  onToggleCompletion: (habit: Habit) => void;
  onDeleteHabit: (habit: Habit) => void;
}

const HabitList = ({
  habits,
  loading,
  searchTerm,
  selectedCategory,
  onToggleCompletion,
  onDeleteHabit
}: HabitListProps) => {
  const filteredHabits = habits.filter(habit => {
    const matchesSearch = habit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (habit.description && habit.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || habit.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-6 w-28" />
              </CardFooter>
            </Card>
          ))}
        </div>
      );
    }

    if (filteredHabits.length === 0 && searchTerm === '' && selectedCategory === 'all') {
      return (
        <div className="text-center py-16 border-2 border-dashed rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">No habits found</h2>
          <p className="text-gray-600">
            Click "Add Habit" to start tracking.
          </p>
        </div>
      );
    }

    if (filteredHabits.length === 0) {
      return (
        <div className="text-center py-16 border-2 border-dashed rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">No habits match the filters.</h2>
          <p className="text-gray-600">
            Try adjusting your search or category.
          </p>
        </div>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredHabits.map((habit) => (
          <Link to={`/habit/${habit.id}`} key={habit.id} className="block hover:no-underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
            <Card className="flex flex-col h-full transition-all border-2 border-transparent hover:border-primary">
              <CardHeader className="flex-row items-start justify-between">
                <CardTitle className="pr-2">{habit.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDeleteHabit(habit);
                  }}
                  aria-label={`Delete habit ${habit.name}`}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-center gap-2 mb-2">
                  {habit.category && (
                    <Badge variant="secondary" className="text-xs">
                      {habit.category}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {habit.description || "No description provided."}
                </p>
                {habit.reminder_time && (
                  <p className="text-xs text-muted-foreground mt-2">
                    🔔 Reminder: {habit.reminder_time}
                  </p>
                )}
                {habit.goal_type && habit.goal_type !== 'none' && habit.goal_target && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Goal {habit.goal_type === 'daily' ? 'daily' : habit.goal_type === 'weekly' ? 'weekly' : 'monthly'}
                      </span>
                      <span className="font-medium">
                        {habit.goal_target} {habit.goal_type === 'daily' ? 'times/day' : habit.goal_type === 'weekly' ? 'times/week' : 'times/month'}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <div
                  className="flex items-center space-x-2"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <Checkbox
                    id={`habit-${habit.id}`}
                    checked={habit.completed_today}
                    onCheckedChange={() => onToggleCompletion(habit)}
                    aria-label={`Mark ${habit.name} as done today`}
                  />
                  <label
                    htmlFor={`habit-${habit.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Done today
                  </label>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    );
  };

  return renderContent();
};

export default HabitList;