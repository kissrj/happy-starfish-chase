import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useHabitInsights } from '@/hooks/useHabitInsights';
import { createMockUser, createMockHabit } from '@/test/utils';
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
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          gte: vi.fn(() => ({
            order: vi.fn(() => Promise.resolve({
              data: [],
              error: null,
            })),
          })),
        })),
      })),
      order: vi.fn(() => Promise.resolve({
        data: [createMockHabit()],
        error: null,
      })),
    })),
  },
}));

vi.mock('@/utils/toast', () => ({
  showError: vi.fn(),
}));

describe('useHabitInsights', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and analyzes habits', async () => {
    const { result } = renderHook(() => useHabitInsights());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.insights).toBeDefined();
    expect(Array.isArray(result.current.insights)).toBe(true);
  });

  it('calculates completion rate correctly', async () => {
    // Mock habit with some completions
    const mockHabit = createMockHabit();
    const mockCompletions = [
      { completed_at: '2024-01-01' },
      { completed_at: '2024-01-02' },
    ];

    vi.mocked(supabase.from).mockReturnValueOnce({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          gte: vi.fn(() => ({
            order: vi.fn(() => Promise.resolve({
              data: mockCompletions,
              error: null,
            })),
          })),
        })),
      })),
      order: vi.fn(() => Promise.resolve({
        data: [mockHabit],
        error: null,
      })),
    } as any);

    const { result } = renderHook(() => useHabitInsights());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const insight = result.current.insights[0];
    expect(insight).toBeDefined();
    expect(insight.completionRate).toBe(20); // 2 completions out of 10 days (20%)
  });

  it('calculates current streak', async () => {
    const mockCompletions = [
      { completed_at: new Date().toISOString().split('T')[0] }, // Today
      { completed_at: new Date(Date.now() - 86400000).toISOString().split('T')[0] }, // Yesterday
    ];

    vi.mocked(supabase.from).mockReturnValueOnce({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          gte: vi.fn(() => ({
            order: vi.fn(() => Promise.resolve({
              data: mockCompletions,
              error: null,
            })),
          })),
        })),
      })),
      order: vi.fn(() => Promise.resolve({
        data: [createMockHabit()],
        error: null,
      })),
    } as any);

    const { result } = renderHook(() => useHabitInsights());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const insight = result.current.insights[0];
    expect(insight.currentStreak).toBe(2);
  });

  it('handles empty insights', async () => {
    vi.mocked(supabase.from).mockReturnValueOnce({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          gte: vi.fn(() => ({
            order: vi.fn(() => Promise.resolve({
              data: [],
              error: null,
            })),
          })),
        })),
      })),
      order: vi.fn(() => Promise.resolve({
        data: [],
        error: null,
      })),
    } as any);

    const { result } = renderHook(() => useHabitInsights());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.insights).toEqual([]);
  });

  it('handles API errors gracefully', async () => {
    vi.mocked(supabase.from).mockReturnValueOnce({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          gte: vi.fn(() => ({
            order: vi.fn(() => Promise.resolve({
              data: null,
              error: new Error('API Error'),
            })),
          })),
        })),
      })),
      order: vi.fn(() => Promise.resolve({
        data: null,
        error: new Error('API Error'),
      })),
    } as any);

    const { result } = renderHook(() => useHabitInsights());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.insights).toEqual([]);
  });
});