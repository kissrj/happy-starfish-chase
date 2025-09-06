"use client";

import { useState, useMemo } from 'react';
import { HabitTemplate } from '@/hooks/useHabitTemplates';
import HabitTemplateStats from '@/components/HabitTemplateStats';
import HabitTemplateFilters from '@/components/HabitTemplateFilters';
import HabitTemplateList from '@/components/HabitTemplateList';

interface HabitTemplatesGridProps {
  templates: HabitTemplate[];
  onSelectTemplate: (template: HabitTemplate) => void;
  selectedTemplate?: HabitTemplate | null;
}

const HabitTemplatesGrid = ({ templates, onSelectTemplate, selectedTemplate }: HabitTemplatesGridProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showPopularOnly, setShowPopularOnly] = useState(false);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(templates.map(t => t.category)));
    return ['all', ...cats];
  }, [templates]);

  const difficulties = ['all', 'easy', 'medium', 'hard'];

  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;
      const matchesPopular = !showPopularOnly || template.is_popular;

      return matchesSearch && matchesCategory && matchesDifficulty && matchesPopular;
    });
  }, [templates, searchQuery, selectedCategory, selectedDifficulty, showPopularOnly]);

  return (
    <div className="space-y-6">
      <HabitTemplateStats templates={templates} />

      <HabitTemplateFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        showPopularOnly={showPopularOnly}
        setShowPopularOnly={setShowPopularOnly}
        categories={categories}
        difficulties={difficulties}
      />

      <HabitTemplateList
        filteredTemplates={filteredTemplates}
        onSelectTemplate={onSelectTemplate}
        selectedTemplate={selectedTemplate}
      />
    </div>
  );
};

export default HabitTemplatesGrid;