"use client";

import { HabitDetail } from '@/hooks/useHabitDetail';

interface HabitInfoProps {
  habit: HabitDetail;
}

const HabitInfo = ({ habit }: HabitInfoProps) => {
  return (
    <div className="max-w-2xl mx-auto mb-6">
      <p className="text-muted-foreground mt-2 mb-6">
        {habit.description || "No description provided."}
      </p>
    </div>
  );
};

export default HabitInfo;