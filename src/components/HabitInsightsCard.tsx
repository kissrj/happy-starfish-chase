"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus, Target, Flame, Calendar, Award } from 'lucide-react';
import { HabitInsight } from '@/hooks/useHabitInsights';

interface HabitInsightsCardProps {
  insight: HabitInsight;
}

const HabitInsightsCard = ({ insight }: HabitInsightsCardProps) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{insight.name}</CardTitle>
          {insight.category && (
            <Badge variant="secondary">{insight.category}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Completion Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Taxa de Conclusão
            </span>
            <span className="font-medium">{insight.completionRate}%</span>
          </div>
          <Progress value={insight.completionRate} className="h-2" />
        </div>

        {/* Streaks */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Flame className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Sequência Atual</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">{insight.currentStreak}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Award className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Maior Sequência</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">{insight.longestStreak}</p>
          </div>
        </div>

        {/* Trends */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Tendência Semanal</span>
            <div className="flex items-center gap-1">
              {getTrendIcon(insight.weeklyTrend)}
              <span className={`text-sm font-medium ${getTrendColor(insight.weeklyTrend)}`}>
                {insight.weeklyTrend === 'up' ? 'Melhorando' :
                 insight.weeklyTrend === 'down' ? 'Diminuindo' : 'Estável'}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Tendência Mensal</span>
            <div className="flex items-center gap-1">
              {getTrendIcon(insight.monthlyTrend)}
              <span className={`text-sm font-medium ${getTrendColor(insight.monthlyTrend)}`}>
                {insight.monthlyTrend === 'up' ? 'Melhorando' :
                 insight.monthlyTrend === 'down' ? 'Diminuindo' : 'Estável'}
              </span>
            </div>
          </div>
        </div>

        {/* Best/Worst Days */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Melhor dia:</span>
            <p className="font-medium text-green-600">{insight.bestDay}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Pior dia:</span>
            <p className="font-medium text-red-600">{insight.worstDay}</p>
          </div>
        </div>

        {/* Total Completions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Total de Conclusões
          </span>
          <span className="font-medium">{insight.totalCompletions}</span>
        </div>

        {/* Recommendation */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-800">{insight.recommendation}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitInsightsCard;