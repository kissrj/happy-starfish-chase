"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, Plus, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';

interface HabitGoal {
  id: string;
  habit_id: string;
  type: 'daily' | 'weekly' | 'monthly';
  target: number;
  current: number;
  deadline?: string;
  created_at: string;
}

interface HabitGoalsSystemProps {
  habitId: string;
  habitName: string;
  onGoalUpdate?: () => void;
}

const HabitGoalsSystem = ({ habitId, habitName, onGoalUpdate }: HabitGoalsSystemProps) => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<HabitGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    type: 'daily' as 'daily' | 'weekly' | 'monthly',
    target: 1,
    deadline: ''
  });

  useEffect(() => {
    fetchGoals();
  }, [habitId]);

  const fetchGoals = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('habit_goals')
        .select('*')
        .eq('habit_id', habitId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('habit_goals')
        .insert({
          habit_id: habitId,
          user_id: user.id,
          type: newGoal.type,
          target: newGoal.target,
          current: 0,
          deadline: newGoal.deadline || null
        })
        .select()
        .single();

      if (error) throw error;

      setGoals([data, ...goals]);
      setNewGoal({ type: 'daily', target: 1, deadline: '' });
      setShowAddGoal(false);
      showSuccess('Goal added successfully!');
      onGoalUpdate?.();
    } catch (error) {
      showError('Failed to add goal');
      console.error(error);
    }
  };

  const updateGoalProgress = async (goalId: string, increment: number) => {
    try {
      const goal = goals.find(g => g.id === goalId);
      if (!goal) return;

      const newCurrent = Math.max(0, goal.current + increment);

      const { error } = await supabase
        .from('habit_goals')
        .update({ current: newCurrent })
        .eq('id', goalId);

      if (error) throw error;

      setGoals(goals.map(g => 
        g.id === goalId ? { ...g, current: newCurrent } : g
      ));

      if (newCurrent >= goal.target) {
        showSuccess('🎉 Goal achieved! Congratulations!');
      }

      onGoalUpdate?.();
    } catch (error) {
      showError('Failed to update goal progress');
      console.error(error);
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      const { error } = await supabase
        .from('habit_goals')
        .delete()
        .eq('id', goalId);

      if (error) throw error;

      setGoals(goals.filter(g => g.id !== goalId));
      showSuccess('Goal deleted');
      onGoalUpdate?.();
    } catch (error) {
      showError('Failed to delete goal');
      console.error(error);
    }
  };

  const getGoalProgress = (goal: HabitGoal) => {
    return Math.min((goal.current / goal.target) * 100, 100);
  };

  const getGoalStatus = (goal: HabitGoal) => {
    if (goal.current >= goal.target) return 'completed';
    if (goal.current > 0) return 'in-progress';
    return 'not-started';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Goals for {habitName}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddGoal(!showAddGoal)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Goal
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAddGoal && (
          <div className="border rounded-lg p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
            <h4 className="font-medium">Add New Goal</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Type</label>
                <Select
                  value={newGoal.type}
                  onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                    setNewGoal({ ...newGoal, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Target</label>
                <Input
                  type="number"
                  min="1"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({ ...newGoal, target: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Deadline (Optional)</label>
                <Input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={addGoal}>Add Goal</Button>
              <Button variant="outline" onClick={() => setShowAddGoal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {goals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No goals set yet.</p>
            <p className="text-sm">Set specific targets to stay motivated!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = getGoalProgress(goal);
              const status = getGoalStatus(goal);
              
              return (
                <div key={goal.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(status)}>
                        {status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {status === 'in-progress' && <Clock className="h-3 w-3 mr-1" />}
                        {status === 'not-started' && <Target className="h-3 w-3 mr-1" />}
                        {goal.type.charAt(0).toUpperCase() + goal.type.slice(1)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {goal.current}/{goal.target}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteGoal(goal.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      Delete
                    </Button>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateGoalProgress(goal.id, -1)}
                        disabled={goal.current <= 0}
                      >
                        -1
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateGoalProgress(goal.id, 1)}
                      >
                        +1
                      </Button>
                    </div>
                    {goal.deadline && (
                      <span className="text-muted-foreground">
                        Due: {new Date(goal.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {status === 'completed' && (
                    <div className="bg-green-50 border border-green-200 rounded p-2 text-center">
                      <p className="text-sm text-green-800 font-medium">
                        🎉 Goal achieved! Well done!
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {goals.length > 0 && (
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>
                {goals.filter(g => getGoalStatus(g) === 'completed').length} of {goals.length} goals completed
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HabitGoalsSystem;