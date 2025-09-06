"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Star } from 'lucide-react';
import { HabitTemplate } from '@/hooks/useHabitTemplates';
import HabitTemplateCard from '@/components/HabitTemplateCard';

interface HabitTemplateListProps {
  filteredTemplates: HabitTemplate[];
  onSelectTemplate: (template: HabitTemplate) => void;
  selectedTemplate?: HabitTemplate | null;
}

const HabitTemplateList = ({ filteredTemplates, onSelectTemplate, selectedTemplate }: HabitTemplateListProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Available Templates ({filteredTemplates.length})
        </h3>
        {selectedTemplate && (
          <Badge variant="default" className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            Selected: {selectedTemplate.name}
          </Badge>
        )}
      </div>

      {filteredTemplates.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search term.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <HabitTemplateCard
              key={template.id}
              template={template}
              onSelect={onSelectTemplate}
              isSelected={selectedTemplate?.id === template.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HabitTemplateList;