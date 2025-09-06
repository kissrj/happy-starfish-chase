/// <reference types="vitest" />
import { render, screen, waitFor } from '@/test/utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import AddHabitDialog from '@/components/AddHabitDialog';
import { createMockUser } from '@/test/utils';

// Mock dependencies
vi.mock('@/context/AuthProvider', () => ({
  useAuth: () => ({
    user: createMockUser(),
  }),
}));

vi.mock('@/hooks/useHabitTemplates', () => ({
  useHabitTemplates: () => ({
    templates: [],
    createHabitFromTemplate: vi.fn(),
  }),
}));

vi.mock('@/utils/notifications', () => ({
  requestNotificationPermission: vi.fn(() => Promise.resolve(true)),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => Promise.resolve({ error: null })),
    })),
  },
}));

vi.mock('@/utils/toast', () => ({
  showSuccess: vi.fn(),
  showError: vi.fn(),
}));

describe('AddHabitDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders trigger button', () => {
    render(<AddHabitDialog onHabitAdded={() => {}} />);
    expect(screen.getByRole('button', { name: /adicionar hábito/i })).toBeInTheDocument();
  });

  it('opens dialog when trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<AddHabitDialog onHabitAdded={() => {}} />);
    
    const triggerButton = screen.getByRole('button', { name: /adicionar hábito/i });
    await user.click(triggerButton);
    
    expect(screen.getByText('Adicionar Novo Hábito')).toBeInTheDocument();
  });

  it('shows template and custom tabs', async () => {
    const user = userEvent.setup();
    render(<AddHabitDialog onHabitAdded={() => {}} />);
    
    await user.click(screen.getByRole('button', { name: /adicionar hábito/i }));
    
    expect(screen.getByRole('tab', { name: /modelos/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /personalizado/i })).toBeInTheDocument();
  });

  it('switches to custom tab and submits form with valid data', async () => {
    const user = userEvent.setup();
    const mockOnHabitAdded = vi.fn();
    render(<AddHabitDialog onHabitAdded={mockOnHabitAdded} />);
    
    await user.click(screen.getByRole('button', { name: /adicionar hábito/i }));
    await user.click(screen.getByRole('tab', { name: /personalizado/i }));
    
    await user.type(screen.getByLabelText(/nome do hábito/i), 'Test Habit');
    
    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByText('Saúde'));

    const submitButton = screen.getByRole('button', { name: /salvar/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnHabitAdded).toHaveBeenCalled();
    });
  });
});