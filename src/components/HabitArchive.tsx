"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Archive, Search, RotateCcw } from 'lucide-react';
import { ArchivedHabit } from '@/hooks/useHabitArchive';
import { showSuccess } from '@/utils/toast';

interface HabitArchiveProps {
  archivedHabits: ArchivedHabit[];
  loading: boolean;
  onReactivateHabit: (habitId: string) => Promise<boolean>;
}

const HabitArchive = ({ archivedHabits, loading, onReactivateHabit }: HabitArchiveProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(archivedHabits.map(h => h.category).filter(Boolean)))];

  const filteredHabits = archivedHabits.filter(habit => {
    const matchesSearch = habit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (habit.description && habit.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || habit.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleReactivate = async (habit: ArchivedHabit) => {
    const success = await onReactivateHabit(habit.id);
    if (success) {
      showSuccess(`Habit "${habit.name}" reactivated!`);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search archived habits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border rounded-md bg-white"
        >
          <option value="all">All Categories</option>
          {categories.filter(cat => cat !== 'all').map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {filteredHabits.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No archived habits</h3>
            <p className="text-muted-foreground">
              Habits you haven't completed in the last 30 days will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredHabits.map((habit) => (
            <Card key={habit.id} className="flex flex-col h-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg leading-tight pr-2">{habit.name}</CardTitle>
                  {habit.category && (
                    <Badge variant="secondary">{habit.category}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground mb-4">
                  {habit.description || "No description provided."}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Completions:</span>
                    <span className="font-medium">{habit.totalCompletions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Longest Streak:</span>
                    <span className="font-medium">{habit.longestStreak} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Completion:</span>
                    <span className="font-medium">
                      {habit.lastCompletion ? new Date(habit.lastCompletion).toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Days Since:</span>
                    <span className="font-medium">{habit.daysSinceLastCompletion} days</span>
                  </div>
                </div>
              </CardContent>
              <div className="p-4 pt-0">
                <Button
                  onClick={() => handleReactivate(habit)}
                  className="w-full"
                  variant="outline"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reactivate Habit
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HabitArchive;