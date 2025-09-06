import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Achievement } from '@/types/achievements';
import Icon from '@/components/Icon';

interface AchievementCardProps {
  achievement: Achievement;
  isUnlocked: boolean;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, isUnlocked }) => {
  return (
    <Card className={cn('transition-all', isUnlocked ? 'border-green-500 bg-green-50' : 'opacity-60')}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Icon name={achievement.icon} className={cn('h-10 w-10', isUnlocked ? 'text-green-600' : 'text-gray-400')} />
            <div>
              <CardTitle>{achievement.name}</CardTitle>
              <CardDescription>{achievement.description}</CardDescription>
            </div>
          </div>
          {isUnlocked && <Badge variant="secondary">Unlocked</Badge>}
        </div>
      </CardHeader>
    </Card>
  );
};

export default AchievementCard;