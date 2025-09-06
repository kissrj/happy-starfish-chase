"use client";

import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';

export interface HabitTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  goal_type: 'daily' | 'weekly' | 'monthly';
  goal_target: number;
  reminder_time?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  benefits: string[];
  estimated_time: number; // in minutes
  tags: string[];
  is_popular: boolean;
  success_rate: number; // percentage
}

export const useHabitTemplates = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<HabitTemplate[]>([]);
  const [loading, setLoading] = useState(false);

  const habitTemplates: HabitTemplate[] = [
    // Health Category
    {
      id: 'drink-water',
      name: 'Drink 8 glasses of water',
      description: 'Staying hydrated is essential for health and energy.',
      category: 'Health',
      goal_type: 'daily',
      goal_target: 8,
      difficulty: 'easy',
      estimated_time: 5,
      benefits: ['Improves energy', 'Aids digestion', 'Reduces headaches'],
      tags: ['hydration', 'health', 'wellness'],
      is_popular: true,
      success_rate: 85
    },
    {
      id: 'morning-walk',
      name: 'Morning walk',
      description: 'A 30-minute walk in the morning to start the day right.',
      category: 'Health',
      goal_type: 'daily',
      goal_target: 1,
      reminder_time: '07:00',
      difficulty: 'easy',
      estimated_time: 30,
      benefits: ['Improves mood', 'Increases energy', 'Reduces stress'],
      tags: ['exercise', 'morning', 'nature'],
      is_popular: true,
      success_rate: 78
    },
    {
      id: 'meditation',
      name: 'Daily meditation',
      description: '10 minutes of meditation for mental clarity and stress reduction.',
      category: 'Wellness',
      goal_type: 'daily',
      goal_target: 1,
      reminder_time: '08:00',
      difficulty: 'medium',
      estimated_time: 10,
      benefits: ['Reduces anxiety', 'Improves focus', 'Increases well-being'],
      tags: ['mind', 'calm', 'focus'],
      is_popular: true,
      success_rate: 72
    },
    {
      id: 'strength-training',
      name: 'Strength training',
      description: 'Weight training session 3x a week for strength gain and health.',
      category: 'Health',
      goal_type: 'weekly',
      goal_target: 3,
      difficulty: 'hard',
      estimated_time: 60,
      benefits: ['Increases muscle strength', 'Improves bone density', 'Boosts metabolism'],
      tags: ['gym', 'strength', 'weightlifting'],
      is_popular: false,
      success_rate: 65
    },

    // Productivity Category
    {
      id: 'read-30-min',
      name: 'Read for 30 minutes',
      description: 'Dedicate daily time for reading and continuous learning.',
      category: 'Learning',
      goal_type: 'daily',
      goal_target: 1,
      reminder_time: '20:00',
      difficulty: 'medium',
      estimated_time: 30,
      benefits: ['Expands knowledge', 'Improves vocabulary', 'Reduces stress'],
      tags: ['reading', 'learning', 'knowledge'],
      is_popular: true,
      success_rate: 76
    },
    {
      id: 'plan-day',
      name: 'Plan the day',
      description: 'Create a to-do list and priorities for the day.',
      category: 'Productivity',
      goal_type: 'daily',
      goal_target: 1,
      reminder_time: '06:30',
      difficulty: 'easy',
      estimated_time: 15,
      benefits: ['Improves organization', 'Reduces procrastination', 'Increases productivity'],
      tags: ['planning', 'organization', 'productivity'],
      is_popular: true,
      success_rate: 82
    },
    {
      id: 'no-phone-hour',
      name: '1 hour without phone',
      description: 'Dedicated time without digital distractions for focus and creativity.',
      category: 'Productivity',
      goal_type: 'daily',
      goal_target: 1,
      difficulty: 'medium',
      estimated_time: 60,
      benefits: ['Improves concentration', 'Reduces anxiety', 'Increases creativity'],
      tags: ['focus', 'creativity', 'digital detox'],
      is_popular: false,
      success_rate: 68
    },
    {
      id: 'learn-new-skill',
      name: 'Learn new skill',
      description: 'Dedicate time to learn something new, like a language or instrument.',
      category: 'Learning',
      goal_type: 'weekly',
      goal_target: 3,
      difficulty: 'medium',
      estimated_time: 45,
      benefits: ['Expands skills', 'Keeps mind active', 'Increases confidence'],
      tags: ['learning', 'skills', 'growth'],
      is_popular: false,
      success_rate: 71
    },

    // Finance Category
    {
      id: 'track-expenses',
      name: 'Track expenses',
      description: 'Record all daily expenses for financial control.',
      category: 'Finances',
      goal_type: 'daily',
      goal_target: 1,
      reminder_time: '22:00',
      difficulty: 'easy',
      estimated_time: 10,
      benefits: ['Improves financial control', 'Identifies unnecessary spending', 'Helps save money'],
      tags: ['finances', 'control', 'saving'],
      is_popular: true,
      success_rate: 79
    },
    {
      id: 'save-money',
      name: 'Save money',
      description: 'Set aside a daily amount for savings or investment.',
      category: 'Finances',
      goal_type: 'daily',
      goal_target: 1,
      difficulty: 'medium',
      estimated_time: 5,
      benefits: ['Builds wealth', 'Creates financial security', 'Develops discipline'],
      tags: ['savings', 'investment', 'discipline'],
      is_popular: false,
      success_rate: 63
    },
    {
      id: 'budget-review',
      name: 'Review weekly budget',
      description: 'Analyze weekly spending and adjust budget as needed.',
      category: 'Finances',
      goal_type: 'weekly',
      goal_target: 1,
      difficulty: 'medium',
      estimated_time: 20,
      benefits: ['Improves financial planning', 'Identifies saving opportunities', 'Maintains control'],
      tags: ['budget', 'analysis', 'planning'],
      is_popular: false,
      success_rate: 74
    },

    // Relationships Category
    {
      id: 'call-family',
      name: 'Call a family member',
      description: 'Keep in touch with close family members regularly.',
      category: 'Relationships',
      goal_type: 'weekly',
      goal_target: 2,
      difficulty: 'easy',
      estimated_time: 15,
      benefits: ['Strengthens family bonds', 'Reduces loneliness', 'Improves communication'],
      tags: ['family', 'relationships', 'communication'],
      is_popular: false,
      success_rate: 69
    },
    {
      id: 'gratitude-note',
      name: 'Gratitude note',
      description: 'Write a gratitude note to someone special.',
      category: 'Relationships',
      goal_type: 'weekly',
      goal_target: 1,
      difficulty: 'easy',
      estimated_time: 10,
      benefits: ['Increases empathy', 'Improves relationships', 'Promotes positivity'],
      tags: ['gratitude', 'positivity', 'relationships'],
      is_popular: false,
      success_rate: 77
    },
    {
      id: 'quality-time',
      name: 'Quality time',
      description: 'Dedicate focused time to be present with loved ones.',
      category: 'Relationships',
      goal_type: 'daily',
      goal_target: 1,
      difficulty: 'easy',
      estimated_time: 30,
      benefits: ['Strengthens bonds', 'Improves communication', 'Creates memories'],
      tags: ['presence', 'quality', 'relationships'],
      is_popular: false,
      success_rate: 73
    },

    // Creativity Category
    {
      id: 'write-journal',
      name: 'Write in journal',
      description: 'Record daily thoughts, experiences, and reflections.',
      category: 'Creativity',
      goal_type: 'daily',
      goal_target: 1,
      reminder_time: '21:00',
      difficulty: 'easy',
      estimated_time: 15,
      benefits: ['Improves self-awareness', 'Processes emotions', 'Develops writing'],
      tags: ['writing', 'reflection', 'self-awareness'],
      is_popular: false,
      success_rate: 75
    },
    {
      id: 'creative-project',
      name: 'Creative project',
      description: 'Work on a personal creative project, like art or music.',
      category: 'Creativity',
      goal_type: 'weekly',
      goal_target: 2,
      difficulty: 'medium',
      estimated_time: 60,
      benefits: ['Develops creativity', 'Reduces stress', 'Increases satisfaction'],
      tags: ['art', 'creativity', 'expression'],
      is_popular: false,
      success_rate: 67
    },
    {
      id: 'mindful-observation',
      name: 'Mindful observation',
      description: 'Spend 10 minutes observing nature or the environment with full attention.',
      category: 'Wellness',
      goal_type: 'daily',
      goal_target: 1,
      difficulty: 'easy',
      estimated_time: 10,
      benefits: ['Reduces stress', 'Increases mindfulness', 'Improves appreciation'],
      tags: ['mindfulness', 'nature', 'presence'],
      is_popular: false,
      success_rate: 80
    }
  ];

  const createHabitFromTemplate = useCallback(async (template: HabitTemplate) => {
    if (!user) {
      showError("You must be logged in to add a habit.");
      return false;
    }

    setLoading(true);
    const { error } = await supabase
      .from("habits")
      .insert([{
        name: template.name,
        description: template.description,
        category: template.category,
        goal_type: template.goal_type,
        goal_target: template.goal_target,
        reminder_time: template.reminder_time,
        user_id: user.id
      }]);

    setLoading(false);

    if (error) {
      showError("Failed to add habit from template.");
      console.error(error);
      return false;
    } else {
      showSuccess(`Habit "${template.name}" added successfully!`);
      return true;
    }
  }, [user]);

  const getTemplatesByCategory = useCallback((category: string) => {
    return habitTemplates.filter(template => template.category === category);
  }, []);

  const getPopularTemplates = useCallback(() => {
    return habitTemplates.filter(template => template.is_popular);
  }, []);

  const getTemplatesByDifficulty = useCallback((difficulty: string) => {
    return habitTemplates.filter(template => template.difficulty === difficulty);
  }, []);

  const searchTemplates = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return habitTemplates.filter(template =>
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.description.toLowerCase().includes(lowercaseQuery) ||
      template.category.toLowerCase().includes(lowercaseQuery) ||
      template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }, []);

  return {
    templates: habitTemplates,
    loading,
    createHabitFromTemplate,
    getTemplatesByCategory,
    getPopularTemplates,
    getTemplatesByDifficulty,
    searchTemplates,
  };
};