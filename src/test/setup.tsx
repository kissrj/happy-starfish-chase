import React from 'react';
import '@testing-library/jest-dom';

// Mock Supabase
import { vi } from 'vitest';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signOut: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      eq: vi.fn(),
      order: vi.fn(),
      limit: vi.fn(),
    })),
  })),
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => children,
  Routes: ({ children }: { children: React.ReactNode }) => children,
  Route: ({ element }: { element: React.ReactNode }) => element,
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => 
    React.createElement('a', { href: to }, children),
  useParams: vi.fn(() => ({})),
  useNavigate: vi.fn(),
  Navigate: ({ to }: { to: string }) => React.createElement('div', { 'data-testid': 'navigate' }, `Navigate to ${to}`),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  PlusCircle: () => React.createElement('div', { 'data-testid': 'plus-circle' }),
  Trash2: () => React.createElement('div', { 'data-testid': 'trash2' }),
  Edit: () => React.createElement('div', { 'data-testid': 'edit' }),
  CheckCircle: () => React.createElement('div', { 'data-testid': 'check-circle' }),
  ArrowLeft: () => React.createElement('div', { 'data-testid': 'arrow-left' }),
  BarChart3: () => React.createElement('div', { 'data-testid': 'bar-chart3' }),
  Bell: () => React.createElement('div', { 'data-testid': 'bell' }),
  Calendar: () => React.createElement('div', { 'data-testid': 'calendar' }),
  Clock: () => React.createElement('div', { 'data-testid': 'clock' }),
  DollarSign: () => React.createElement('div', { 'data-testid': 'dollar-sign' }),
  Download: () => React.createElement('div', { 'data-testid': 'download' }),
  Flame: () => React.createElement('div', { 'data-testid': 'flame' }),
  Target: () => React.createElement('div', { 'data-testid': 'target' }),
  TrendingUp: () => React.createElement('div', { 'data-testid': 'trending-up' }),
  User: () => React.createElement('div', { 'data-testid': 'user' }),
}));

// Mock react-confetti
vi.mock('react-confetti', () => ({
  default: () => React.createElement('div', { 'data-testid': 'confetti' }),
}));

// Mock date-fns
vi.mock('date-fns', () => ({
  format: vi.fn((date, formatStr) => `formatted-${date}-${formatStr}`),
  isSameDay: vi.fn(),
  subDays: vi.fn(),
  addDays: vi.fn(),
  startOfMonth: vi.fn(),
  endOfMonth: vi.fn(),
  eachDayOfInterval: vi.fn(() => []),
  isFuture: vi.fn(() => false),
}));

// Mock react-hook-form
vi.mock('react-hook-form', () => ({
  useForm: vi.fn(() => ({
    control: {},
    handleSubmit: vi.fn((fn) => fn),
    formState: { isSubmitting: false },
    reset: vi.fn(),
    watch: vi.fn(() => ''),
    setValue: vi.fn(),
  })),
  FormProvider: ({ children }: { children: React.ReactNode }) => children,
  useFormContext: vi.fn(() => ({
    control: {},
    handleSubmit: vi.fn(),
    formState: { isSubmitting: false },
  })),
}));

// Mock @hookform/resolvers/zod
vi.mock('@hookform/resolvers/zod', () => ({
  zodResolver: vi.fn(() => vi.fn()),
}));

// Global test utilities
global.React = React;