"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AddHabitDialog from '@/components/AddHabitDialog';

interface QuickStartProps {
  onHabitAdded: () => void;
}

const QuickStart = ({ onHabitAdded }: QuickStartProps) => {
  return (
    <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-xl text-center">🚀 Comece Sua Jornada de Hábitos</CardTitle>
        <CardDescription className="text-center">
          Escolha um modelo pré-configurado ou crie seu próprio hábito
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <AddHabitDialog onHabitAdded={onHabitAdded} />
      </CardContent>
    </Card>
  );
};

export default QuickStart;