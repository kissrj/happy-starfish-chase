import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Calendar, Target } from 'lucide-react';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  totalHabits: number;
  completedToday: number;
  unlockedAchievementsCount: number;
  totalAchievementsCount: number;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ 
  currentStreak, 
  longestStreak, 
  totalHabits,
  completedToday,
  unlockedAchievementsCount,
  totalAchievementsCount
}) => {
  const completionPercentage = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="text-center">
        <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
          <Flame className="h-4 w-4 text-orange-500" />
          <CardTitle className="text-sm font-medium ml-2">Current Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentStreak} days</div>
          <p className="text-xs text-muted-foreground">Keep it up!</p>
        </CardContent>
      </Card>
      
      <Card className="text-center">
        <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
          <Calendar className="h-4 w-4 text-blue-500" />
          <CardTitle className="text-sm font-medium ml-2">Longest Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{longestStreak} days</div>
          <p className="text-xs text-muted-foreground">Personal best</p>
        </CardContent>
      </Card>
      
      <Card className="text-center">
        <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
          <Target className="h-4 w-4 text-green-500" />
          <CardTitle className="text-sm font-medium ml-2">Today's Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedToday}/{totalHabits}</div>
          <p className="text-xs text-muted-foreground">{completionPercentage}% complete</p>
        </CardContent>
      </Card>
      
      <Card className="text-center">
        <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
          <div className="h-4 w-4 text-purple-500">🏆</div>
          <CardTitle className="text-sm font-medium ml-2">Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{unlockedAchievementsCount}/{totalAchievementsCount}</div>
          <p className="text-xs text-muted-foreground">Unlock more</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StreakCounter;