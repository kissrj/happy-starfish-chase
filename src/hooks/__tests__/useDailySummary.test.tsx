/// <reference types="vitest" />
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useDailySummary } from '@/hooks/useDailySummary';
import { createMockHabit } from '@/test/utils';

describe('useDailySummary', () => {
  it('calculates summary correctly', () => {
    const mockHabits = [
      createMockHabit({ completed_today: true }),
      createMockHabit({ completed_today: true }),
      createMockHabit({ completed_today: false }),
    ];

    const { result } = renderHook(() => useDailySummary(mockHabits));

    expect(result.current.dailySummary).toEqual({
      total: 3,
      completed: 2,
      remaining: 1,
    });
  });

  it('handles empty habits array', () => {
    const { result } = renderHook(() => useDailySummary([]));

    expect(result.current.dailySummary).toEqual({
      total: 0,
      completed: 0,
      remaining: 0,
    });
  });

  it('handles all habits completed', () => {
    const mockHabits = [
      createMockHabit({ completed_today: true }),
      createMockHabit({ completed_today: true }),
    ];

    const { result } = renderHook(() => useDailySummary(mockHabits));

    expect(result.current.dailySummary).toEqual({
      total: 2,
      completed: 2,
      remaining: 0,
    });
  });

  it('handles no habits completed', () => {
    const mockHabits = [
      createMockHabit({ completed_today: false }),
      createMockHabit({ completed_today: false }),
    ];

    const { result } = renderHook(() => useDailySummary(mockHabits));

    expect(result.current.dailySummary).toEqual({
      total: 2,
      completed: 0,
      remaining: 2,
    });
  });

  it('updates summary when habits change', () => {
    const initialHabits = [createMockHabit({ completed_today: false })];
    const { result, rerender } = renderHook(
      ({ habits }) => useDailySummary(habits),
      { initialProps: { habits: initialHabits } }
    );

    expect(result.current.dailySummary.completed).toBe(0);

    const updatedHabits = [createMockHabit({ completed_today: true })];
    rerender({ habits: updatedHabits });

    expect(result.current.dailySummary.completed).toBe(1);
  });
});