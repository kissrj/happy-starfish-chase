/// <reference types="@testing-library/jest-dom" />
/// <reference types="vitest" />
import { render, screen, fireEvent, waitFor } from '@/test/utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
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
    const { user } = render(<AddHabitDialog onHabitAdded={() => {}} />);
    
    const triggerButton = screen.getByRole('button', { name: /adicionar hábito/i });
    await user.click(triggerButton);
    
    expect(screen.getByText('Adicionar Novo Hábito')).toBeInTheDocument();
  });

  it('shows template and custom tabs', async () => {
    const { user } = render(<AddHabitDialog onHabitAdded={() => {}} />);
    
    await user.click(screen.getByRole('button', { name: /adicionar hábito/i }));
    
    expect(screen.getByRole('tab', { name: /modelos/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /personalizado/i })).toBeInTheDocument();
  });

  it('switches between tabs', async () => {
    const { user } = render(<AddHabitDialog onHabitAdded={() => {}} />);
    
    await user.click(screen.getByRole('button', { name: /adicionar hábito/i }));
    
    const customTab = screen.getByRole('tab', { name: /personalizado/i });
    await user.click(customTab);
    
    expect(customTab).toHaveAttribute('aria-selected', 'true');
  });

  it('validates required fields', async () => {
    const { user } = render(<AddHabitDialog onHabitAdded={() => {}} />);
    
    await user.click(screen.getByRole('button', { name: /adicionar hábito/i }));
    await user.click(screen.getByRole('tab', { name: /personalizado/i }));
    
    const submitButton = screen.getByRole('button', { name: /salvar/i });
    await user.click(submitButton);
    
    // Form validation should prevent submission without required fields
    expect(screen.getByText('Adicionar Novo Hábito')).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const mockOnHabitAdded = vi.fn();
    const { user } = render(<AddHabitDialog onHabitAdded={mockOnHabitAdded} />);
    
    await user.click(screen.getByRole('button', { name: /adicionar hábito/i }));
    await user.click(screen.getByRole('tab', { name: /personalizado/i }));
    
    // Fill out the form
    const nameInput = screen.getByLabelText(/nome do hábito/i);
    const categorySelect = screen.getByLabelText(/categoria/i);
    
    fireEvent.change(nameInput, { target: { value: 'Test Habit' } });
    fireEvent.change(categorySelect, { target: { value: 'Saúde' } });
    
    const submitButton = screen.getByRole('button', { name: /salvar/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnHabitAdded).toHaveBeenCalled();
    });
  });

  it('closes dialog after successful submission', async () => {
    const mockOnHabitAdded = vi.fn();
    const { user } = render(<AddHabitDialog onHabitAdded={mockOnHabitAdded} />);
    
    await user.click(screen.getByRole('button', { name: /adicionar hábito/i }));
    await user.click(screen.getByRole('tab', { name: /personalizado/i }));
    
    // Fill out the form
    const nameInput = screen.getByLabelText(/nome do hábito/i);
    const categorySelect = screen.getByLabelText(/categoria/i);
    
    fireEvent.change(nameInput, { target: { value: 'Test Habit' } });
    fireEvent.change(categorySelect, { target: { value: 'Saúde' } });
    
    const submitButton = screen.getByRole('button', { name: /salvar/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Adicionar Novo Hábito')).not.toBeInTheDocument();
    });
  });
});