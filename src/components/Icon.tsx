import React from 'react';
import {
  Footprints,
  Flame,
  Rocket,
  Medal,
  Crown,
  HeartPulse,
  Trophy,
  Icon as LucideIcon,
} from 'lucide-react';

const iconMap: { [key: string]: typeof LucideIcon } = {
  Footprints,
  Flame,
  Rocket,
  Medal,
  Crown,
  HeartPulse,
  Trophy,
};

interface IconProps {
  name: string;
  className?: string;
  size?: string | number;
}

const Icon = ({ name, ...props }: IconProps) => {
  const IconComponent = iconMap[name] || Trophy; // Default to Trophy icon
  return <IconComponent {...props} />;
};

export default Icon;