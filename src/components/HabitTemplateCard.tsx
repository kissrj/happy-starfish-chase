"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, TrendingUp, Star, Plus } from 'lucide-react';
import { HabitTemplate } from '@/hooks/useHabitTemplates';

interface HabitTemplateCardProps {
  template: HabitTemplate;
  onSelect: (template: HabitTemplate) => void;
  isSelected?: boolean;
}

const HabitTemplateCard = ({ template, onSelect, isSelected }: HabitTemplateCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Médio';
      case 'hard': return 'Difícil';
      default: return 'Desconhecido';
    }
  };

  return (
    <Card className={`flex flex-col h-full transition-all border-2 ${
      isSelected ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg leading-tight pr-2">{template.name}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {template.category}
              </Badge>
              <Badge className={`text-xs border ${getDifficultyColor(template.difficulty)}`}>
                {getDifficultyText(template.difficulty)}
              </Badge>
              {template.is_popular && (
                <Badge variant="outline" className="text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-green-600">
              {template.success_rate}% sucesso
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <Clock className="h-3 w-3" />
              {template.estimated_time}min
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-sm mb-3">
          {template.description}
        </CardDescription>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs">
            <Target className="h-3 w-3 text-primary" />
            <span>Meta: {template.goal_target} {template.goal_type === 'daily' ? 'vezes/dia' :
              template.goal_type === 'weekly' ? 'vezes/semana' : 'vezes/mês'}</span>
          </div>

          {template.reminder_time && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Lembrete: {template.reminder_time}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-1">
            {template.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t">
          <h4 className="text-xs font-medium mb-2 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Benefícios:
          </h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            {template.benefits.slice(0, 2).map((benefit, index) => (
              <li key={index} className="flex items-start gap-1">
                <span className="text-primary mt-0.5">•</span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <div className="p-4 pt-0">
        <Button
          onClick={() => onSelect(template)}
          className="w-full"
          size="sm"
          disabled={isSelected}
        >
          <Plus className="mr-2 h-4 w-4" />
          {isSelected ? 'Selecionado' : 'Usar Este Modelo'}
        </Button>
      </div>
    </Card>
  );
};

export default HabitTemplateCard;