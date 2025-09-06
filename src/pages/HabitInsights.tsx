"use client";

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Skeleton } from '@/components/ui/skeleton';
import { useHabitInsights } from '@/hooks/useHabitInsights';
import HabitInsightsSummary from '@/components/HabitInsightsSummary';
import HabitInsightsCard from '@/components/HabitInsightsCard';

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
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Performance Analysis</h2>
          <p className="text-gray-600">
            Detailed insights into your habits, trends, and personalized recommendations.
          </p>
        </div>

        <HabitInsightsSummary insights={insights} />

        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Individual Analysis</h3>
          {insights.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed rounded-lg bg-gray-50">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No insights available</h3>
              <p className="text-gray-600 mb-4">
                Add some habits and start tracking to see detailed insights.
              </p>
              <Button asChild>
                <Link to="/">Add Habits</Link>
              </Button>
            </div>
          ) : (
            insights.map((insight) => (
              <HabitInsightsCard key={insight.id} insight={insight} />
            ))
          )}
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default HabitInsights;