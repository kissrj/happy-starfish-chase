import { render, screen } from '@/test/utils';
import { describe, it, expect, vi } from 'vitest';
import DailySummary from '@/components/DailySummary';

describe('DailySummary', () => {
  it('renders all summary cards', () => {
    render(
      <DailySummary
        total={5}
        completed={3}
        remaining={2}
      />
    );

    expect(screen.getByText('Total de Hábitos')).toBeInTheDocument();
    expect(screen.getByText('Completados Hoje')).toBeInTheDocument();
    expect(screen.getByText('Restantes Hoje')).toBeInTheDocument();
    expect(screen.getByText('Visão Geral Financeira')).toBeInTheDocument();
  });

  it('displays correct values', () => {
    render(
      <DailySummary
        total={10}
        completed={7}
        remaining={3}
      />
    );

    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('applies correct styling for completed habits', () => {
    render(
      <DailySummary
        total={5}
        completed={5}
        remaining={0}
      />
    );

    const completedCard = screen.getByText('5').closest('.text-center');
    expect(completedCard).toBeInTheDocument();
  });

  it('handles zero values correctly', () => {
    render(
      <DailySummary
        total={0}
        completed={0}
        remaining={0}
      />
    );

    expect(screen.getByText('0')).toBeInTheDocument();
  });
});