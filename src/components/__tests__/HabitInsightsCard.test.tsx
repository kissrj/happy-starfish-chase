import { render, screen } from '@/test/utils';
import { describe, it, expect } from 'vitest';
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
<dyad-problem-report summary="64 problems">
<problem file="src/components/__tests__/HabitInsightsSummary.test.tsx" line="35" column="142" code="1002">Unterminated string literal.</problem>
<problem file="src/components/__tests__/HabitInsightsSummary.test.tsx" line="36" column="1" code="1005">',' expected.</problem>
<problem file="src/components/__tests__/HabitInsightsSummary.test.tsx" line="121" column="4" code="1005">'}' expected.</problem>
<problem file="src/test/integration/auth-flow.spec.ts" line="37" column="14" code="1005">'&gt;' expected.</problem>
<problem file="src/test/integration/auth-flow.spec.ts" line="38" column="8" code="1161">Unterminated regular expression literal.</problem>
<problem file="src/test/integration/auth-flow.spec.ts" line="49" column="14" code="1005">'&gt;' expected.</problem>
<problem file="src/test/integration/auth-flow.spec.ts" line="50" column="8" code="1161">Unterminated regular expression literal.</problem>
<problem file="src/test/integration/auth-flow.spec.ts" line="78" column="14" code="1005">'&gt;' expected.</problem>
<problem file="src/test/integration/auth-flow.spec.ts" line="79" column="8" code="1161">Unterminated regular expression literal.</problem>
<problem file="src/test/integration/auth-flow.spec.ts" line="113" column="14" code="1005">'&gt;' expected.</problem>
<problem file="src/test/integration/auth-flow.spec.ts" line="114" column="8" code="1161">Unterminated regular expression literal.</problem>
<problem file="vitest.config.ts" line="1" column="30" code="2307">Cannot find module 'vitest/config' or its corresponding type declarations.</problem>
<problem file="src/test/setup.ts" line="4" column="20" code="2307">Cannot find module 'vitest' or its corresponding type declarations.</problem>
<problem file="src/test/utils.tsx" line="2" column="39" code="2307">Cannot find module '@testing-library/react' or its corresponding type declarations.</problem>
<problem file="src/test/utils.tsx" line="74" column="15" code="2307">Cannot find module '@testing-library/react' or its corresponding type declarations.</problem>
<problem file="src/components/__tests__/Button.test.tsx" line="1" column="32" code="2307">Cannot find module '@/test/utils' or its corresponding type declarations.</problem>
<problem file="src/components/__tests__/Button.test.tsx" line="3" column="42" code="2307">Cannot find module 'vitest' or its corresponding type declarations.</problem>
<problem file="src/hooks/__tests__/useHabits.test.tsx" line="1" column="37" code="2307">Cannot find module '@testing-library/react' or its corresponding type declarations.</problem>
<problem file="src/hooks/__tests__/useHabits.test.tsx" line="2" column="54" code="2307">Cannot find module 'vitest' or its corresponding type declarations.</problem>
<problem file="src/hooks/__tests__/useHabits.test.tsx" line="4" column="49" code="2307">Cannot find module '@/test/utils' or its corresponding type declarations.</problem>
<problem file="src/components/__tests__/DailySummary.test.tsx" line="1" column="32" code="2307">Cannot find module '@/test/utils' or its corresponding type declarations.</problem>
<problem file="src/components/__tests__/DailySummary.test.tsx" line="2" column="38" code="2307">Cannot find module 'vitest' or its corresponding type declarations.</problem>
<problem file="src/components/__tests__/HabitList.test.tsx" line="1" column="43" code="2307">Cannot find module '@/test/utils' or its corresponding type declarations.</problem>
<problem file="src/components/__tests__/HabitList.test.tsx" line="2" column="42" code="2307">Cannot find module 'vitest' or its corresponding type declarations.</problem>
<problem file="src/components/__tests__/HabitList.test.tsx" line="4" column="33" code="2307">Cannot find module '@/test/utils' or its corresponding type declarations.</problem>
<problem file="src/hooks/__tests__/useHabitActions.test.tsx" line="1" column="33" code="2307">Cannot find module '@testing-library/react' or its corresponding type declarations.</problem>
<problem file="src/hooks/__tests__/useHabitActions.test.tsx" line="2" column="54" code="2307">Cannot find module 'vitest' or its corresponding type declarations.</problem>
<problem file="src/hooks/__tests__/useHabitActions.test.tsx" line="4" column="49" code="2307">Cannot find module '@/test/utils' or its corresponding type declarations.</problem>
<problem file="src/hooks/__tests__/useDailySummary.test.tsx" line="1" column="33" code="2307">Cannot find module '@testing-library/react' or its corresponding type declarations.</problem>
<problem file="src/hooks/__tests__/useDailySummary.test.tsx" line="2" column="38" code="2307">Cannot find module 'vitest' or its corresponding type declarations.</problem>
<problem file="src/hooks/__tests__/useDailySummary.test.tsx" line="4" column="33" code="2307">Cannot find module '@/test/utils' or its corresponding type declarations.</problem>
<problem file="src/components/__tests__/AddHabitDialog.test.tsx" line="1" column="52" code="2307">Cannot find module '@/test/utils' or its corresponding type declarations.</problem>
<problem file="src/components/__tests__/AddHabitDialog.test.tsx" line="2" column="54" code="2307">Cannot find module 'vitest' or its corresponding type declarations.</problem>
<problem file="src/components/__tests__/AddHabitDialog.test.tsx" line="4" column="32" code="2307">Cannot find module '@/test/utils' or its corresponding type declarations.</problem>
<problem file="src/hooks/__tests__/useHabitTemplates.test.tsx" line="1" column="33" code="2307">Cannot find module '@testing-library/react' or its corresponding type declarations.</problem>
<problem file="src/hooks/__tests__/useHabitTemplates.test.tsx" line="2" column="54" code="2307">Cannot find module 'vitest' or its corresponding type declarations.</problem>
<problem file="src/hooks/__tests__/useHabitTemplates.test.tsx" line="4" column="32" code="2307">Cannot find module '@/test/utils' or its corresponding type declarations.</problem>
<problem file="src/hooks/__tests__/useHabitInsights.test.tsx" line="1" column="37" code="2307">Cannot find module '@testing-library/react' or its corresponding type declarations.</problem>
<problem file="src/hooks/__tests__/useHabitInsights.test.tsx" line="2" column="54" code="2307">Cannot find module 'vitest' or its corresponding type declarations.</problem>
<problem file="src/hooks/__tests__/useHabitInsights.test.tsx" line="4" column="49" code="2307">Cannot find module '@/test/utils' or its corresponding type declarations.</problem>
<problem file="src/components/__tests__/HabitInsightsCard.test.tsx" line="1" column="32" code="2307">Cannot find module '@/test/utils' or its corresponding type declarations.</problem>
<problem file="src/components/__tests__/HabitInsightsCard.test.tsx" line="2" column="38" code="2307">Cannot find module 'vitest' or its corresponding type declarations.</problem>
<problem file="src/components/__tests__/HabitInsightsSummary.test.tsx" line="1" column="32" code="2307">Cannot find module '@/test/utils' or its corresponding type declarations.</problem>
<problem file="src/components/__tests__/HabitInsightsSummary.test.tsx" line="2" column="38" code="2307">Cannot find module 'vitest' or its corresponding type declarations.</problem>
<problem file="src/components/__tests__/HabitInsightsSummary.test.tsx" line="36" column="32" code="2307">Cannot find module '@/test/utils' or its corresponding type declarations.</problem>
<problem file="src/components/__tests__/HabitInsightsSummary.test.tsx" line="37" column="38" code="2307">Cannot find module 'vitest' or its corresponding type declarations.</problem>
<problem file="src/test/e2e/habit-management.spec.ts" line="1" column="30" code="2307">Cannot find module '@playwright/test' or its corresponding type declarations.</problem>
<problem file="src/test/e2e/user-authentication.spec.ts" line="1" column="30" code="2307">Cannot find module '@playwright/test' or its corresponding type declarations.</problem>
<problem file="src/test/e2e/finance-tracking.spec.ts" line="1" column="30" code="2307">Cannot find module '@playwright/test' or its corresponding type declarations.</problem>
<problem file="src/test/e2e/insights-analytics.spec.ts" line="1" column="30" code="2307">Cannot find module '@playwright/test' or its corresponding type declarations.</problem>
<problem file="src/test/e2e/mobile-responsiveness.spec.ts" line="1" column="30" code="2307">Cannot find module '@playwright/test' or its corresponding type declarations.</problem>
<problem file="src/test/e2e/accessibility.spec.ts" line="1" column="30" code="2307">Cannot find module '@playwright/test' or its corresponding type declarations.</problem>
<problem file="src/test/e2e/performance.spec.ts" line="1" column="30" code="2307">Cannot find module '@playwright/test' or its corresponding type declarations.</problem>
<problem file="src/test/e2e/smoke-tests.spec.ts" line="1" column="30" code="2307">Cannot find module '@playwright/test' or its corresponding type declarations.</problem>
<problem file="src/test/integration/auth-flow.spec.ts" line="2" column="41" code="2307">Cannot find module '@/test/utils' or its corresponding type declarations.</problem>
<problem file="src/test/integration/auth-flow.spec.ts" line="3" column="42" code="2307">Cannot find module 'vitest' or its corresponding type declarations.</problem>
<problem file="src/test/integration/auth-flow.spec.ts" line="36" column="8" code="2749">'BrowserRouter' refers to a value, but is being used as a type here. Did you mean 'typeof BrowserRouter'?</problem>
<problem file="src/test/integration/auth-flow.spec.ts" line="37" column="10" code="2749">'App' refers to a value, but is being used as a type here. Did you mean 'typeof App'?</problem>
<problem file="src/test/integration/auth-flow.spec.ts" line="48" column="8" code="2749">'BrowserRouter' refers to a value, but is being used as a type here. Did you mean 'typeof BrowserRouter'?</problem>
<problem file="src/test/integration/auth-flow.spec.ts" line="49" column="10" code="2749">'App' refers to a value, but is being used as a type here. Did you mean 'typeof App'?</problem>
<problem file="src/test/integration/auth-flow.spec.ts" line="77" column="8" code="2749">'BrowserRouter' refers to a value, but is being used as a type here. Did you mean 'typeof BrowserRouter'?</problem>
<problem file="src/test/integration/auth-flow.spec.ts" line="78" column="10" code="2749">'App' refers to a value, but is being used as a type here. Did you mean 'typeof App'?</problem>
<problem file="src/test/integration/auth-flow.spec.ts" line="112" column="8" code="2749">'BrowserRouter' refers to a value, but is being used as a type here. Did you mean 'typeof BrowserRouter'?</problem>
<problem file="src/test/integration/auth-flow.spec.ts" line="113" column="10" code="2749">'App' refers to a value, but is being used as a type here. Did you mean 'typeof App'?</problem>
</dyad-problem-report><think>I need to fix these TypeScript compilation errors. Let me analyze them:


## Investigating compilation errors

- Encountered TypeScript compilation issues in HabitInsightsSummary.test.tsx.
- Identified the problem as a malformed test file structure causing the errors.</think><dyad-write path="src/components/__tests__/HabitInsightsSummary.test.tsx" description="Fixing the broken test file structure by removing the malformed dyad-write tag.">
import { render, screen } from '@/test/utils';
import { describe, it, expect } from 'vitest';
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