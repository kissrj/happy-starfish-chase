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
  
  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-red-600';
    if (streak >= 14) return 'text-orange-600';
    if (streak >= 7) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getStreakIcon = (streak: number) => {
    if (streak >= 30) return '🔥🔥🔥';
    if (streak >= 14) return '🔥🔥';
    if (streak >= 7) return '🔥';
    return '✨';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="text-center">
        <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
          <Flame className={`h-4 w-4 ${getStreakColor(currentStreak)}`} />
          <CardTitle className="text-sm font-medium ml-2">Current Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getStreakColor(currentStreak)}`}>
            {currentStreak} days
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {getStreakIcon(currentStreak)}
          </div>
          <p className="text-xs text-muted-foreground">Keep it up!</p>
        </CardContent>
      </Card>
      
      <Card className="text-center">
        <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
          <Calendar className={`h-4 w-4 ${getStreakColor(longestStreak)}`} />
          <CardTitle className="text-sm font-medium ml-2">Longest Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getStreakColor(longestStreak)}`}>
            {longestStreak} days
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {getStreakIcon(longestStreak)}
          </div>
          <p className="text-xs text-muted-foreground">Personal best</p>
        </CardContent>
      </Card>
      
      <Card className="text-center">
        <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
          <Target className="h-4 w-4 text-green-500" />
          <CardTitle className="text-sm font-medium ml-2">Today's Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{completedToday}/{totalHabits}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {completionPercentage}% complete
          </div>
          <p className="text-xs text-muted-foreground">Great work!</p>
        </CardContent>
      </Card>
      
      <Card className="text-center">
        <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
          <div className="h-4 w-4 text-purple-500">🏆</div>
          <CardTitle className="text-sm font-medium ml-2">Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{unlockedAchievementsCount}/{totalAchievementsCount}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {unlockedAchievementsCount === totalAchievementsCount ? 'All unlocked!' : 'Keep going!'}
          </div>
          <p className="text-xs text-muted-foreground">Unlock more</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StreakCounter;