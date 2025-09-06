"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Star, Clock, Target, TrendingUp } from 'lucide-react';
import { HabitTemplate } from '@/hooks/useHabitTemplates';
import HabitTemplateCard from '@/components/HabitTemplateCard';