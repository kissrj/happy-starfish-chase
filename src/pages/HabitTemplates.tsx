"use client";

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Target } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { useHabitTemplates } from '@/hooks/useHabitTemplates';
import HabitTemplatesGrid from '@/components/HabitTemplatesGrid';
import { showSuccess } from '@/utils/toast';

const HabitTemplates = () => {
  const { templates, createHabitFromTemplate } = useHabitTemplates();

  const handleSelectTemplate = async (template: any) => {
    const success = await createHabitFromTemplate(template);
    if (success) {
      showSuccess(`Habit "${template.name}" created successfully!`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Habit Templates
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Habit</h2>
          <p className="text-gray-600">
            Start with proven habit templates or create your own. Each template includes goals, reminders, and success tips.
          </p>
        </div>

        <HabitTemplatesGrid templates={templates} onSelectTemplate={handleSelectTemplate} />
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default HabitTemplates;