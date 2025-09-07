import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useHabits } from '@/hooks/useHabits';
import { createMockUser, createMockHabit } from '@/test/utils';
import { supabase } from '@/integrations/supabase/client';

// Mock the auth context
vi.mock('@/context/AuthProvider', () => ({
  useAuth: () => ({
    user: createMockUser(),
  }),
}));

// Mock supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          data: [createMockHabit()],
          error: null,
        })),
      })),
    })),
  },
}));

describe('useHabits', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches habits on mount', async () => {
    const mockHabit = createMockHabit();
    
    // Mock the supabase response
    const mockFrom = vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({
          data: [mockHabit],
          error: null,
        })),
      })),
    }));
    
    vi.mocked(supabase.from).mockReturnValue(mockFrom() as any);

    const { result } = renderHook(() => useHabits());

    await waitFor(() => {
      expect(result.current.habits).toHaveLength(1);
      expect(result.current.habits[0]).toEqual({
        ...mockHabit,
        completed_today: false,
      });
    });
  });

  it('handles loading state', () => {
    const { result } = renderHook(() => useHabits());
    
    expect(result.current.loading).toBe(true);
  });

  it('updates habits when updateHabits is called', () => {
    const { result } = renderHook(() => useHabits());
    
    const newHabits = [createMockHabit({ name: 'Updated Habit' })];
    result.current.updateHabits(newHabits);
    
    expect(result.current.habits).toEqual(newHabits);
  });

  it('handles error when fetching habits', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock error response
    const mockFrom = vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({
          data: null,
          error: new Error('Database error'),
        })),
      })),
    }));
    
    vi.mocked(supabase.from).mockReturnValue(mockFrom() as any);

    const { result } = renderHook(() => useHabits());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    consoleSpy.mockRestore();
  });
});