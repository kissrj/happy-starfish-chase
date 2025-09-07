import React from 'react';
import {
  Footprints,
  Flame,
  Rocket,
  Medal,
  Crown,
  HeartPulse,
  Trophy,
  DollarSign,
  Heart,
  Palette,
  Icon as LucideIcon,
} from 'lucide-react';

const iconMap: { [key: string]: React.ElementType } = {
  Footprints,
  Flame,
  Rocket,
  Medal,
  Crown,
  HeartPulse,
  Trophy,
  DollarSign,
  Heart,
  Palette,
};

interface IconProps {
  name: string;
  className?: string;
  size?: number;
  iconNode?: React.ReactNode;
}

const Icon = ({ name, className, size, iconNode }: IconProps) => {
  const IconComponent = iconMap[name] || Trophy;
  return <IconComponent className={className} size={size} />;
};

export default Icon;