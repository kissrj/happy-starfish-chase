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

interface IconProps extends React.ComponentProps<typeof LucideIcon> {
  name: string;
}

const Icon = ({ name, ...props }: IconProps) => {
  const IconComponent = iconMap[name] || Trophy; // Default to Trophy icon
  return <IconComponent {...props} />;
};

export default Icon;