"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

interface HabitGoalProgressProps {
  habit: {
    id: string;
    name: string;
    goal_type: string;
    goal_target: number;
  };
}

const HabitGoalProgress = ({ habit }: HabitGoalProgressProps) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoalProgress = async () => {
      if (!user || !habit.goal_type || habit.goal_type === 'none') return;

      setLoading(true);
      const now = new Date();
      let startDate: Date;
      let endDate: Date;

      switch (habit.goal_type) {
        case 'daily':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
          break;
        case 'weekly':
          startDate = startOfWeek(now, { weekStartsOn: 1 }); // Monday
          endDate = endOfWeek(now, { weekStartsOn: 1 });
          break;
        case 'monthly':
          startDate = startOfMonth(now);
          endDate = endOfMonth(now);
          break;
        default:
          return;
      }

      const { data, error } = await supabase
        .from('habit_completions')
        .select('completed_at')
        .eq('habit_id', habit.id)
        .gte('completed_at', format(startDate, 'yyyy-MM-dd'))
        .lte('completed_at', format(endDate, 'yyyy-MM-dd'));

      if (error) {
        console.error('Error fetching goal progress:', error);
        setLoading(false);
        return;
      }

      const count = data?.length || 0;
      setCurrentCount(count);
      setProgress(Math.min((count / habit.goal_target) * 100, 100));
      setLoading(false);
    };

    fetchGoalProgress();
  }, [habit, user]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Target className="h-4 w-4" />
        <span>Loading progress...</span>
      </div>
    );
  }

  if (!habit.goal_type || habit.goal_type === 'none') {
    return null;
  }

  const isCompleted = currentCount >= habit.goal_target;
  const goalTypeText = habit.goal_type === 'daily' ? 'today' : habit.goal_type === 'weekly' ? 'this week' : 'this month';

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Goal Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="font-medium">Goal {goalTypeText}</span>
            </div>
            <Badge variant={isCompleted ? "default" : "secondary"} className={isCompleted ? "bg-green-600" : ""}>
              {isCompleted ? (
                <CheckCircle className="h-3 w-3 mr-1" />
              ) : (
                <Clock className="h-3 w-3 mr-1" />
              )}
              {currentCount}/{habit.goal_target}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
          {isCompleted && (
            <p className="text-xs text-green-600 font-medium">
              🎉 Goal achieved! Congratulations!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitGoalProgress;