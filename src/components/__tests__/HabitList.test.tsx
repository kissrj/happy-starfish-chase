/// <reference types="vitest" />
import { render, screen } from '@/test/utils';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import HabitList from '@/components/HabitList';
import { createMockHabit } from '@/test/utils';

describe('HabitList', () => {
  const mockHabits = [
    createMockHabit({ id: '1', name: 'Habit 1', category: 'Saúde', completed_today: false }),
    createMockHabit({ id: '2', name: 'Habit 2', category: 'Produtividade', completed_today: true }),
  ];

  const defaultProps = {
    habits: mockHabits,
    loading: false,
    searchTerm: '',
    selectedCategory: 'all',
    onToggleCompletion: vi.fn(),
    onDeleteHabit: vi.fn(),
  };

  it('renders habits list', () => {
    render(<HabitList {...defaultProps} />);

    expect(screen.getByText('Habit 1')).toBeInTheDocument();
    expect(screen.getByText('Habit 2')).toBeInTheDocument();
  });

  it('shows loading state with skeletons', () => {
    const { container } = render(<HabitList {...defaultProps} habits={[]} loading={true} />);
    
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
    expect(screen.queryByText('Habit 1')).not.toBeInTheDocument();
  });

  it('filters habits by search term', () => {
    render(<HabitList {...defaultProps} searchTerm="Habit 1" />);

    expect(screen.getByText('Habit 1')).toBeInTheDocument();
    expect(screen.queryByText('Habit 2')).not.toBeInTheDocument();
  });

  it('shows empty state when no habits match filters', () => {
    render(<HabitList {...defaultProps} searchTerm="nonexistent" />);

    expect(screen.getByText('Nenhum hábito corresponde aos filtros.')).toBeInTheDocument();
  });

  it('shows empty state for new users', () => {
    render(<HabitList {...defaultProps} habits={[]} />);

    expect(screen.getByText('Nenhum hábito encontrado')).toBeInTheDocument();
    expect(screen.getByText('Clique em "Adicionar Hábito" para começar a rastrear.')).toBeInTheDocument();
  });

  it('calls onToggleCompletion when checkbox is clicked', async () => {
    const user = userEvent.setup();
    const mockOnToggle = vi.fn();
    render(<HabitList {...defaultProps} onToggleCompletion={mockOnToggle} />);

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);

    expect(mockOnToggle).toHaveBeenCalledWith(mockHabits[0]);
  });

  it('calls onDeleteHabit when delete button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnDelete = vi.fn();
    render(<HabitList {...defaultProps} onDeleteHabit={mockOnDelete} />);

    const deleteButtons = screen.getAllByRole('button', { name: /excluir hábito/i });
    await user.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith(mockHabits[0]);
  });
});