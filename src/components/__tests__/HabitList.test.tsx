/// <reference types="vitest" />
import { render, screen, fireEvent } from '@/test/utils';
import { describe, it, expect, vi } from 'vitest';
import HabitList from '@/components/HabitList';
import { createMockHabit } from '@/test/utils';

describe('HabitList', () => {
  const mockHabits = [
    createMockHabit({ id: '1', name: 'Habit 1', completed_today: false }),
    createMockHabit({ id: '2', name: 'Habit 2', completed_today: true }),
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

  it('shows loading state', () => {
    render(<HabitList {...defaultProps} loading={true} />);

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('filters habits by search term', () => {
    render(<HabitList {...defaultProps} searchTerm="Habit 1" />);

    expect(screen.getByText('Habit 1')).toBeInTheDocument();
    expect(screen.queryByText('Habit 2')).not.toBeInTheDocument();
  });

  it('shows empty state when no habits match filters', () => {
    render(<HabitList {...defaultProps} searchTerm="nonexistent" />);

    expect(screen.getByText('Nenhum hábito encontrado')).toBeInTheDocument();
  });

  it('shows empty state for new users', () => {
    render(<HabitList {...defaultProps} habits={[]} />);

    expect(screen.getByText('Nenhum hábito encontrado')).toBeInTheDocument();
    expect(screen.getByText('Clique em "Adicionar Hábito" para começar')).toBeInTheDocument();
  });

  it('calls onToggleCompletion when checkbox is clicked', () => {
    const mockOnToggle = vi.fn();
    render(<HabitList {...defaultProps} onToggleCompletion={mockOnToggle} />);

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    expect(mockOnToggle).toHaveBeenCalledWith(mockHabits[0]);
  });

  it('calls onDeleteHabit when delete button is clicked', () => {
    const mockOnDelete = vi.fn();
    render(<HabitList {...defaultProps} onDeleteHabit={mockOnDelete} />);

    const deleteButtons = screen.getAllByRole('button', { name: /excluir/i });
    fireEvent.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith(mockHabits[0]);
  });

  it('displays habit categories', () => {
    const habitsWithCategories = [
      createMockHabit({ category: 'Saúde' }),
      createMockHabit({ category: 'Produtividade' }),
    ];

    render(<HabitList {...defaultProps} habits={habitsWithCategories} />);

    expect(screen.getByText('Saúde')).toBeInTheDocument();
    expect(screen.getByText('Produtividade')).toBeInTheDocument();
  });

  it('displays habit descriptions', () => {
    const habitWithDescription = createMockHabit({ 
      description: 'Test description' 
    });

    render(<HabitList {...defaultProps} habits={[habitWithDescription]} />);

    expect(screen.getByText('Test description')).toBeInTheDocument();
  });
});