import { render, screen } from '@/test/utils';
import { describe, it, expect, vi } from 'vitest';
import HabitInsightsSummary from '@/components/HabitInsightsSummary';

const mockInsights = [
  {
    id: '1',
    name: 'Habit 1',
    completionRate: 80,
    currentStreak: 5,
    longestStreak: 10,
    totalCompletions: 20,
    weeklyTrend: 'up' as const,
    monthlyTrend: 'stable' as const,
    bestDay: 'Monday',
    worstDay: 'Friday',
    recommendation: 'Good job!',
  },
  {
    id: '2',
    name: 'Habit 2',
    completionRate: 60,
    currentStreak: 3,
    longestStreak: 8,
    totalCompletions: 15,
    weeklyTrend: 'stable' as const,
    monthlyTrend: 'up' as const,
    bestDay: 'Tuesday',
    worstDay: 'Saturday',
    recommendation: 'Keep going!',
  },
];

describe('HabitInsightsSummary', () => {
  it('renders summary cards with correct data', () => {
    render(<HabitInsightsSummary insights={mockInsights} />);
    
    expect(screen.getByText('Taxa Média de Conclusão')).toBeInTheDocument();
    expect(screen.getByText('Sequência Média Atual')).toBeInTheDocument();
    expect(screen.getByText('Hábitos Melhorando')).toBeInTheDocument();
    expect(screen.getByText('Melhor Desempenho')).toBeInTheDocument();
  });

  it('calculates and displays average completion rate', () => {
    render(<HabitInsightsSummary insights={mockInsights} />);
    
    // (80 + 60) / 2 = 70
    expect(screen.getByText('70%')).toBeInTheDocument();
  });

  it('calculates and displays average current streak', () => {
    render(<HabitInsightsSummary insights={mockInsights} />);
    
    // (5 + 3) / 2 = 4
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('counts improving habits', () => {
    render(<HabitInsightsSummary insights={mockInsights} />);
    
    // Only one habit has weeklyTrend: 'up'
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('identifies best performing habit', () => {
    render(<HabitInsightsSummary insights={mockInsights} />);
    
    // Habit 1 has 80% completion rate
    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  it('handles empty insights array', () => {
    render(<HabitInsightsSummary insights={[]} />);
    
    expect(screen.getByText('Resumo dos Insights')).toBeInTheDocument();
    expect(screen.getByText('Nenhum insight disponível.')).toBeInTheDocument();
  });

  it('displays correct labels for each metric', () => {
    render(<HabitInsightsSummary insights={mockInsights} />);
    
    expect(screen.getByText('Média de todos os hábitos')).toBeInTheDocument();
    expect(screen.getByText('Dias consecutivos')).toBeInTheDocument();
    expect(screen.getByText('Tendência semanal positiva')).toBeInTheDocument();
  });
});