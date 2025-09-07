"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar, TrendingUp } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface WeeklyOverviewProps {
  habits: Array<{ id: string; name: string }>;
}

const WeeklyOverview = ({ habits }: WeeklyOverviewProps) => {
  const { user } = useAuth();
  const [weeklyData, setWeeklyData] = useState<{
    totalHabits: number;
    completedThisWeek: number;
    completionRate: number;
    dailyProgress: Array<{ day: string; completed: number; total: number }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      if (!user || habits.length === 0) {
        setLoading(false);
        return;
      }

      const now = new Date();
      const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
      const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

      const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

      // Fetch completions for this week
      const { data: completions, error } = await supabase
        .from('habit_completions')
        .select('completed_at, habit_id')
        .eq('user_id', user.id)
        .gte('completed_at', format(weekStart, 'yyyy-MM-dd'))
        .lte('completed_at', format(weekEnd, 'yyyy-MM-dd'));

      if (error) {
        console.error('Error fetching weekly data:', error);
        setLoading(false);
        return;
      }

      const totalHabits = habits.length;
      const completedThisWeek = new Set(completions?.map(c => `${c.completed_at}-${c.habit_id}`)).size;

      // Calculate daily progress
      const dailyProgress = weekDays.map(day => {
        const dayCompletions = completions?.filter(c => isSameDay(new Date(c.completed_at), day)) || [];
        const uniqueCompletions = new Set(dayCompletions.map(c => c.habit_id)).size;
        return {
          day: format(day, 'EEE'),
          completed: uniqueCompletions,
          total: totalHabits,
        };
      });

      const completionRate = totalHabits > 0 ? Math.round((completedThisWeek / (totalHabits * 7)) * 100) : 0;

      setWeeklyData({
        totalHabits,
        completedThisWeek,
        completionRate,
        dailyProgress,
      });
      setLoading(false);
    };

    fetchWeeklyData();
  }, [user, habits]);

  if (loading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-blue-500" />
            Weekly Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-4" />
          <div className="grid grid-cols-7 gap-2">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weeklyData) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-blue-500" />
          Weekly Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">This Week's Progress</p>
              <p className="text-2xl font-bold text-blue-600">
                {weeklyData.completedThisWeek} / {weeklyData.totalHabits * 7}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Completion Rate</p>
              <p className="text-2xl font-bold text-green-600">{weeklyData.completionRate}%</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Weekly Goal Progress</span>
              <span className="text-sm text-muted-foreground">
                {weeklyData.completionRate}% complete
              </span>
            </div>
            <Progress value={weeklyData.completionRate} className="h-2" />
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Daily Breakdown</p>
            <div className="grid grid-cols-7 gap-2">
              {weeklyData.dailyProgress.map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs font-medium text-muted-foreground mb-1">
                    {day.day}
                  </div>
                  <div className="text-sm font-bold">
                    {day.completed}/{day.total}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                    <div
                      className="bg-blue-600 h-1 rounded-full"
                      style={{ width: `${(day.completed / day.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {weeklyData.completionRate >= 80 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                <p className="text-sm text-green-800 font-medium">
                  Great job! You're on track this week! 🎉
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyOverview;