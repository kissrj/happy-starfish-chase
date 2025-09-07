"use client";

import React, { useState, useMemo } from 'react';
import HabitFilters from '@/components/HabitFilters';
import HabitList from '@/components/HabitList';
import QuickStart from '@/components/QuickStart';
import { Habit } from '@/hooks/useHabits';

interface HabitListSectionProps {
  habits: Habit[];
  loading: boolean;
  onHabitAdded: () => void;
  onToggleCompletion: (habit: Habit) => void;
  onDeleteHabit: (habit: Habit) => void;
}

const HabitListSection = ({
  habits,
  loading,
  onHabitAdded,
  onToggleCompletion,
  onDeleteHabit,
}: HabitListSectionProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(habits.map(h => h.category).filter(Boolean))) as string[];
    return ['all', ...cats];
  }, [habits]);

  return (
    <>
      {habits.length === 0 && <QuickStart onHabitAdded={onHabitAdded} />}

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Your Habits</h2>
        <HabitFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          onHabitAdded={onHabitAdded}
        />
      </div>

      <HabitList
        habits={habits}
        loading={loading}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        onToggleCompletion={onToggleCompletion}
        onDeleteHabit={onDeleteHabit}
      />
    </>
  );
};

export default HabitListSection;