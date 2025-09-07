"use client";

import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface HabitCompletionAnimationProps {
  isCompleted: boolean;
  onAnimationComplete?: () => void;
}

const HabitCompletionAnimation = ({ isCompleted, onAnimationComplete }: HabitCompletionAnimationProps) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isCompleted) {
      setShowAnimation(true);
      const timer = setTimeout(() => {
        setShowAnimation(false);
        onAnimationComplete?.();
      }, 1000); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [isCompleted, onAnimationComplete]);

  if (!showAnimation) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div className="animate-bounce">
        <CheckCircle className="h-24 w-24 text-green-500 animate-pulse" />
      </div>
      <div className="absolute inset-0 bg-green-500/10 animate-pulse" />
    </div>
  );
};

export default HabitCompletionAnimation;