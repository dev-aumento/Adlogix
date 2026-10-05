import React from 'react';
import {
  TrendingUp,
  Target,
  Search,
  Share2,
  Film,
  Sparkles,
  Layers,
  BarChart3,
  Palette,
  Code2,
  Globe,
  ShoppingBag,
  Cpu,
  ShieldCheck,
  Building2,
  Building,
  Utensils,
  Shirt,
  HeartPulse,
  Briefcase,
  Rocket,
  Flame,
  Zap,
  CheckCircle2,
  Play,
  ArrowRight
} from 'lucide-react';

const iconMap = {
  TrendingUp,
  Target,
  Search,
  Share2,
  Film,
  Sparkles,
  Layers,
  BarChart3,
  Palette,
  Code2,
  Globe,
  ShoppingBag,
  Cpu,
  ShieldCheck,
  Building2,
  Building,
  Utensils,
  Shirt,
  HeartPulse,
  Briefcase,
  Rocket,
  Flame,
  Zap,
  CheckCircle2,
  Play,
  ArrowRight
};

export const DynamicIcon = ({ name, className = "w-5 h-5", ...props }) => {
  const IconComponent = iconMap[name] || Sparkles;
  return <IconComponent className={className} {...props} />;
};
