import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/Icon';
import { Achievement } from '@/types/achievements';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AchievementCardProps {
  achievement: Achievement;
  unlocked: boolean;
  unlockedAt?: string | null;
}

const AchievementCard = ({ achievement, unlocked, unlockedAt }: AchievementCardProps) => {
  const unlockedDate = unlockedAt ? format(new Date(unlockedAt), "d 'de' MMMM 'de' yyyy", { locale: ptBR }) : null;

  return (
    <Card className={`transition-all ${unlocked ? 'border-green-500' : 'opacity-50'}`}>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
        <div className={`p-3 rounded-full ${unlocked ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-800'}`}>
          <Icon name={achievement.icon} className={`h-6 w-6 ${unlocked ? 'text-green-500' : 'text-gray-500'}`} />
        </div>
        <div className="flex-1">
          <CardTitle>{achievement.name}</CardTitle>
          <CardDescription>{achievement.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {unlocked && unlockedDate ? (
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            Desbloqueado em {unlockedDate}
          </Badge>
        ) : (
          <Badge variant="outline">Bloqueado</Badge>
        )}
      </CardContent>
    </Card>
  );
};

export default AchievementCard;