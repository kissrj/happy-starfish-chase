"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Zap, CheckCircle } from 'lucide-react';
import { Habit } from '@/hooks/useHabits';

interface QuickActionsProps {
  habits: Habit[];
  onToggleCompletion: (habit: Habit) => void;
}

const QuickActions = ({ habits, onToggleCompletion }: QuickActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [completedHabits, setCompletedHabits] = useState<Set<string>>(new Set());

  const handleQuickComplete = (habit: Habit) => {
    onToggleCompletion(habit);
    setCompletedHabits(prev => {
      const newSet = new Set(prev);
      if (newSet.has(habit.id)) {
        newSet.delete(habit.id);
      } else {
        newSet.add(habit.id);
      }
      return newSet;
    });
  };

  const handleMarkAllCompleted = () => {
    habits.forEach(habit => {
      if (!habit.completed_today && !completedHabits.has(habit.id)) {
        onToggleCompletion(habit);
        setCompletedHabits(prev => new Set(prev).add(habit.id));
      }
    });
  };

  const handleMarkAllIncomplete = () => {
    habits.forEach(habit => {
      if (habit.completed_today || completedHabits.has(habit.id)) {
        onToggleCompletion(habit);
        setCompletedHabits(prev => {
          const newSet = new Set(prev);
          newSet.delete(habit.id);
          return newSet;
        });
      }
    });
  };

  const completedCount = habits.filter(h => h.completed_today || completedHabits.has(h.id)).length;
  const totalCount = habits.length;

  if (habits.length === 0) return null;

  return (
    <Card className="mb-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-lg">
                <Zap className="mr-2 h-5 w-5 text-yellow-500" />
                Quick Actions
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({completedCount}/{totalCount} completed)
                </span>
              </CardTitle>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllCompleted}
                disabled={completedCount === totalCount}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark All Complete
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllIncomplete}
                disabled={completedCount === 0}
              >
                Mark All Incomplete
              </Button>
            </div>

            <div className="space-y-3">
              {habits.map((habit) => (
                <div key={habit.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id={`quick-${habit.id}`}
                    checked={habit.completed_today || completedHabits.has(habit.id)}
                    onCheckedChange={() => handleQuickComplete(habit)}
                  />
                  <label
                    htmlFor={`quick-${habit.id}`}
                    className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {habit.name}
                  </label>
                  {habit.category && (
                    <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded">
                      {habit.category}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {completedCount === totalCount && completedCount > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800 font-medium">
                  🎉 All habits completed for today! Great job!
                </p>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default QuickActions;