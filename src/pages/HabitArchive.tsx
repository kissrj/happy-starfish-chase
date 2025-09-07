"use client";

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Archive } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { useHabitArchive } from '@/hooks/useHabitArchive';
import HabitArchive from '@/components/HabitArchive';

const HabitArchivePage = () => {
  const { archivedHabits, loading, reactivateHabit } = useHabitArchive();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Habit Archive
          </h1>
          <Button asChild variant="outline" size="sm">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Archived Habits</h2>
          <p className="text-gray-600">
            Habits you haven't completed in the last 30 days. Reactivate them to get back on track!
          </p>
        </div>

        <HabitArchive
          archivedHabits={archivedHabits}
          loading={loading}
          onReactivateHabit={reactivateHabit}
        />
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default HabitArchivePage;