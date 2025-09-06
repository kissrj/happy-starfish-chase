/// <reference types="@testing-library/jest-dom" />
/// <reference types="vitest" />
import { render, screen } from '@/test/utils';
import { describe, it, expect, vi } from 'vitest';
import HabitInsightsCard from '@/components/HabitInsightsCard';

const mockInsight = {
  id: 'test-insight',
  name: 'Test Habit',
  category: 'Saúde',
  completionRate: 75,
  currentStreak: 5,
  longestStreak: 10,
  totalCompletions: 15,
  weeklyTrend: 'up' as const,
  monthlyTrend: 'stable' as const,
  bestDay: 'Segunda',
  worstDay: 'Sábado',
  recommendation: 'Continue mantendo este hábito!',
};

describe('HabitInsightsCard', () => {
  it('renders habit name and category', () => {
    render(<HabitInsightsCard insight={mockInsight} />);
    
    expect(screen.getByText('Test Habit')).toBeInTheDocument();
    expect(screen.getByText('Saúde')).toBeInTheDocument();
  });

  it('displays completion rate', () => {
    render(<HabitInsightsCard insight={mockInsight} />);
    
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('Taxa de Conclusão')).toBeInTheDocument();
  });

  it('shows streak information', () => {
    render(<HabitInsightsCard insight={mockInsight} />);
    
    expect(screen.getByText('5')).toBeInTheDocument(); // Current streak
    expect(screen.getByText('10')).toBeInTheDocument(); // Longest streak
    expect(screen.getByText('Sequência Atual')).toBeInTheDocument();
    expect(screen.getByText('Maior Sequência')).toBeInTheDocument();
  });

  it('displays trend indicators', () => {
    render(<HabitInsightsCard insight={mockInsight} />);
    
    expect(screen.getByText('Melhorando')).toBeInTheDocument();
    expect(screen.getByText('Estável')).toBeInTheDocument();
  });

  it('shows best and worst days', () => {
    render(<HabitInsightsCard insight={mockInsight} />);
    
    expect(screen.getByText('Segunda')).toBeInTheDocument();
    expect(screen.getByText('Sábado')).toBeInTheDocument();
  });

  it('displays total completions', () => {
    render(<HabitInsightsCard insight={mockInsight} />);
    
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('Total de Conclusões')).toBeInTheDocument();
  });

  it('shows recommendation', () => {
    render(<HabitInsightsCard insight={mockInsight} />);
    
    expect(screen.getByText('Continue mantendo este hábito!')).toBeInTheDocument();
  });

  it('handles missing category', () => {
    const insightWithoutCategory = { ...mockInsight, category: undefined };
    render(<HabitInsightsCard insight={insightWithoutCategory} />);
    
    expect(screen.getByText('Test Habit')).toBeInTheDocument();
    expect(screen.queryByText('Saúde')).not.toBeInTheDocument();
  });

  it('displays different trend states', () => {
    const decliningInsight = { 
      ...mockInsight, 
      weeklyTrend: 'down' as const,
      monthlyTrend: 'down' as const 
    };
    render(<HabitInsightsCard insight={decliningInsight} />);
    
    expect(screen.getByText('Diminuindo')).toBeInTheDocument();
  });
});