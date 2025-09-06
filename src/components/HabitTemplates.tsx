"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Target, Clock, TrendingUp } from 'lucide-react';

interface HabitTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  goal_type: 'daily' | 'weekly' | 'monthly';
  goal_target: number;
  reminder_time?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  benefits: string[];
}

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
    benefits: ['Improves energy', 'Aids digestion', 'Reduces headaches']
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
    benefits: ['Improves mood', 'Increases energy', 'Reduces stress']
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
    benefits: ['Reduces anxiety', 'Improves focus', 'Increases well-being']
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
    benefits: ['Expands knowledge', 'Improves vocabulary', 'Reduces stress']
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
    benefits: ['Improves organization', 'Reduces procrastination', 'Increases productivity']
  },
  {
    id: 'no-phone-hour',
    name: '1 hour without phone',
    description: 'Dedicated time without digital distractions for focus and creativity.',
    category: 'Productivity',
    goal_type: 'daily',
    goal_target: 1,
    difficulty: 'medium',
    benefits: ['Improves concentration', 'Reduces anxiety', 'Increases creativity']
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
    benefits: ['Improves financial control', 'Identifies unnecessary spending', 'Helps save money']
  },
  {
    id: 'save-money',
    name: 'Save money',
    description: 'Set aside a daily amount for savings or investment.',
    category: 'Finances',
    goal_type: 'daily',
    goal_target: 1,
    difficulty: 'medium',
    benefits: ['Builds wealth', 'Creates financial security', 'Develops discipline']
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
    benefits: ['Strengthens family bonds', 'Reduces loneliness', 'Improves communication']
  },
  {
    id: 'gratitude-note',
    name: 'Gratitude note',
    description: 'Write a gratitude note to someone special.',
    category: 'Relationships',
    goal_type: 'weekly',
    goal_target: 1,
    difficulty: 'easy',
    benefits: ['Increases empathy', 'Improves relationships', 'Promotes positivity']
  },

  // Creativity Category
  {
    id: 'write-journal',
    name: 'Write in a journal',
    description: 'Record daily thoughts, experiences, and reflections.',
    category: 'Creativity',
    goal_type: 'daily',
    goal_target: 1,
    reminder_time: '21:00',
    difficulty: 'easy',
    benefits: ['Improves self-awareness', 'Processes emotions', 'Develops writing']
  },
  {
    id: 'learn-new-skill',
    name: 'Learn a new skill',
    description: 'Dedicate time to learn something new, like a language or instrument.',
    category: 'Learning',
    goal_type: 'weekly',
    goal_target: 3,
    difficulty: 'medium',
    benefits: ['Expands skills', 'Keeps mind active', 'Increases confidence']
  }
];

interface HabitTemplatesProps {
  onSelectTemplate: (template: HabitTemplate) => void;
}

const HabitTemplates = ({ onSelectTemplate }: HabitTemplatesProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [open, setOpen] = useState(false);

  const categories = ['all', ...Array.from(new Set(habitTemplates.map(t => t.category)))];

  const filteredTemplates = selectedCategory === 'all'
    ? habitTemplates
    : habitTemplates.filter(t => t.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Target className="mr-2 h-4 w-4" />
          Habit Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Habit Templates
          </DialogTitle>
          <DialogDescription>
            Choose from our pre-configured templates to get started quickly.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.filter(cat => cat !== 'all').map(category => (
              <TabsTrigger key={category} value={category} className="text-xs">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg leading-tight">{template.name}</CardTitle>
                      <Badge className={`text-xs ${getDifficultyColor(template.difficulty)}`}>
                        {template.difficulty === 'easy' ? 'Easy' :
                         template.difficulty === 'medium' ? 'Medium' : 'Hard'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {template.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {template.goal_type === 'daily' ? 'Daily' :
                         template.goal_type === 'weekly' ? 'Weekly' : 'Monthly'}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground mb-3">
                      {template.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <Target className="h-3 w-3 text-primary" />
                        <span>Goal: {template.goal_target} {template.goal_type === 'daily' ? 'times/day' :
                          template.goal_type === 'weekly' ? 'times/week' : 'times/month'}</span>
                      </div>
                      {template.reminder_time && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Reminder: {template.reminder_time}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <h4 className="text-xs font-medium mb-2 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Benefits:
                      </h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {template.benefits.slice(0, 2).map((benefit, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <span className="text-primary mt-0.5">•</span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <div className="p-4 pt-0">
                    <Button
                      onClick={() => {
                        onSelectTemplate(template);
                        setOpen(false);
                      }}
                      className="w-full"
                      size="sm"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Use This Template
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default HabitTemplates;