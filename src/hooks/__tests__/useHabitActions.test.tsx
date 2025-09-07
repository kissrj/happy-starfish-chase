import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useHabitActions } from '@/hooks/useHabitActions';
import { createMockHabit, createMockUser } from '@/test/utils';
import { supabase } from '@/integrations/supabase/client';

// Mock dependencies
vi.mock('@/context/AuthProvider', () => ({
  useAuth: () => ({
    user: createMockUser(),
  }),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => Promise.resolve({ error: null })),
      delete: vi.fn(() => Promise.resolve({ error: null })),
    })),
  },
}));

vi.mock('@/utils/toast', () => ({
  showError: vi.fn(),
  showSuccess: vi.fn(),
}));

describe('useHabitActions', () => {
  const mockHabits = [
    createMockHabit({ id: '1', completed_today: false }),
    createMockHabit({ id: '2', completed_today: false }),
  ];

  const mockUpdateHabits = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with correct state', () => {
    const { result } = renderHook(() =>
      useHabitActions(mockHabits, mockUpdateHabits)
    );

    expect(result.current.habitToDelete).toBeNull();
    expect(result.current.showConfetti).toBe(false);
  });

  it('toggles habit completion', async () => {
    const { result } = renderHook(() =>
      useHabitActions(mockHabits, mockUpdateHabits)
    );

    await act(async () => {
      await result.current.handleToggleCompletion(mockHabits[0]);
    });

    expect(mockUpdateHabits).toHaveBeenCalledWith([
      { ...mockHabits[0], completed_today: true },
      mockHabits[1],
    ]);
  });

  it('shows confetti when all habits are completed', async () => {
    const almostCompleteHabits = [
      createMockHabit({ id: '1', completed_today: true }),
      createMockHabit({ id: '2', completed_today: false }),
    ];

    const { result } = renderHook(() =>
      useHabitActions(almostCompleteHabits, mockUpdateHabits)
    );

    await act(async () => {
      await result.current.handleToggleCompletion(almostCompleteHabits[1]);
    });

    expect(result.current.showConfetti).toBe(true);
  });

  it('sets habit to delete', () => {
    const { result } = renderHook(() =>
      useHabitActions(mockHabits, mockUpdateHabits)
    );

    act(() => {
      result.current.setHabitToDelete(mockHabits[0]);
    });

    expect(result.current.habitToDelete).toEqual(mockHabits[0]);
  });

  it('handles delete habit', async () => {
    const { result } = renderHook(() =>
      useHabitActions(mockHabits, mockUpdateHabits)
    );

    act(() => {
      result.current.setHabitToDelete(mockHabits[0]);
    });

    await act(async () => {
      await result.current.handleDeleteHabit();
    });

    expect(mockUpdateHabits).toHaveBeenCalledWith([mockHabits[1]]);
    expect(result.current.habitToDelete).toBeNull();
  });
});