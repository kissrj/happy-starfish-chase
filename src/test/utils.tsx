/// <reference types="@testing-library/jest-dom" />
import React, { ReactElement } from 'react';
import { render as rtlRender, RenderOptions, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  return {
    user: userEvent.setup(),
    ...rtlRender(ui, { wrapper: AllTheProviders, ...options }),
  }
};

// Mock data generators
export const createMockHabit = (overrides = {}) => ({
  id: 'test-habit-id',
  name: 'Test Habit',
  description: 'Test habit description',
  category: 'Test Category',
  goal_type: 'daily',
  goal_target: 5,
  reminder_time: '09:00',
  created_at: '2024-01-01T00:00:00Z',
  completed_today: false,
  ...overrides,
});

export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  ...overrides,
});

export const createMockTransaction = (overrides = {}) => ({
  id: 'test-transaction-id',
  description: 'Test Transaction',
  amount: 100.50,
  type: 'expense',
  category: 'Food',
  created_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

// Test helpers
export const waitForNextTick = () => new Promise(resolve => setTimeout(resolve, 0));

export const mockSupabaseResponse = (data: any, error = null) => ({
  data,
  error,
});

// Explicitly re-export these from @testing-library/react
export { screen, fireEvent, waitFor };
export { customRender as render };