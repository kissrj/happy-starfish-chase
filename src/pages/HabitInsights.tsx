"use client";

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Skeleton } from '@/components/ui/skeleton';
import { useHabitInsights } from '@/hooks/useHabitInsights';
import InsightsContent from '@/components/InsightsContent';

const HabitInsights = () => {
  const { insights, loading } = useHabitInsights();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Button asChild variant="outline" size="sm">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Habit Insights
            </h1>
            <div></div>
          </div>
        </header>
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Button asChild variant="outline" size="sm">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Habit Insights
          </h1>
          <div></div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <InsightsContent insights={insights} />
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default HabitInsights;