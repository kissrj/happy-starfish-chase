"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Star, TrendingUp, Clock } from 'lucide-react';
import { HabitTemplate } from '@/hooks/useHabitTemplates';

interface HabitTemplateStatsProps {
  templates: HabitTemplate[];
}

const HabitTemplateStats = ({ templates }: HabitTemplateStatsProps) => {
  const popularTemplates = templates.filter(t => t.is_popular);
  const avgSuccessRate = templates.length > 0 ? Math.round(templates.reduce((sum, t) => sum + t.success_rate, 0) / templates.length) : 0;
  const avgEstimatedTime = templates.length > 0 ? Math.round(templates.reduce((sum, t) => sum + t.estimated_time, 0) / templates.length) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{templates.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Popular</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{popularTemplates.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgSuccessRate}%</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgEstimatedTime}min</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HabitTemplateStats;