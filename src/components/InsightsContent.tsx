"use client";

import HabitInsightsSummary from '@/components/HabitInsightsSummary';
import HabitInsightsCard from '@/components/HabitInsightsCard';
import { HabitInsight } from '@/hooks/useHabitInsights';

interface InsightsContentProps {
  insights: HabitInsight[];
}

const InsightsContent = ({ insights }: InsightsContentProps) => {
  return (
    <>
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
            <h3 className="text-lg font-semibold mb-2">No insights available</h3>
            <p className="text-gray-600 mb-4">
              Add some habits and start tracking to see detailed insights.
            </p>
            <a href="/" className="text-blue-500 hover:text-blue-700 underline">
              Add Habits
            </a>
          </div>
        ) : (
          insights.map((insight) => (
            <HabitInsightsCard key={insight.id} insight={insight} />
          ))
        )}
      </div>
    </>
  );
};

export default InsightsContent;