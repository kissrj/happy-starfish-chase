import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Flame, Target } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
  total?: number;
}

const AchievementsPanel: React.FC = () => {
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first habit',
      icon: <Star className="h-4 w-4" />,
      unlocked: true,
    },
    {
      id: '2',
      title: 'Week Warrior',
      description: 'Complete 7 days in a row',
      icon: <Flame className="h-4 w-4" />,
      unlocked: true,
      progress: 5,
      total: 7,
    },
    {
      id: '3',
      title: 'Habit Master',
      description: 'Maintain a 30-day streak',
      icon: <Trophy className="h-4 w-4" />,
      unlocked: false,
      progress: 15,
      total: 30,
    },
    {
      id: '4',
      title: 'Perfectionist',
      description: 'Complete all habits for a week',
      icon: <Target className="h-4 w-4" />,
      unlocked: false,
    },
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`p-4 rounded-lg border ${
                achievement.unlocked 
                  ? 'bg-yellow-50 border-yellow-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start">
                <div className={`p-2 rounded-md mr-3 ${
                  achievement.unlocked 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold flex items-center">
                    {achievement.title}
                    {achievement.unlocked && (
                      <Badge className="ml-2 bg-yellow-500 hover:bg-yellow-600">Unlocked</Badge>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                  {achievement.progress !== undefined && achievement.total && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress}/{achievement.total}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementsPanel;