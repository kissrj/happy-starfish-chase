import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Achievement } from '@/types/achievements';

interface AchievementCardProps {
  achievement: Achievement;
  isUnlocked: boolean;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, isUnlocked }) => {
  const Icon = LucideIcons[achievement.icon] || LucideIcons.Award;

  return (
    <Card className={cn('transition-all', isUnlocked ? 'border-green-500 bg-green-50' : 'opacity-60')}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Icon className={cn('h-10 w-10', isUnlocked ? 'text-green-600' : 'text-gray-400')} />
            <div>
              <CardTitle>{achievement.name}</CardTitle>
              <CardDescription>{achievement.description}</CardDescription>
            </div>
          </div>
          {isUnlocked && <Badge variant="secondary">Desbloqueado</Badge>}
        </div>
      </CardHeader>
    </Card>
  );
};

export default AchievementCard;