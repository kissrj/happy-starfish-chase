import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useHabitTemplates } from '@/hooks/useHabitTemplates';
import { createMockUser } from '@/test/utils';
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
    })),
  },
}));

vi.mock('@/utils/toast', () => ({
  showSuccess: vi.fn(),
  showError: vi.fn(),
}));

describe('useHabitTemplates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns habit templates', () => {
    const { result } = renderHook(() => useHabitTemplates());
    
    expect(result.current.templates).toBeDefined();
    expect(Array.isArray(result.current.templates)).toBe(true);
    expect(result.current.templates.length).toBeGreaterThan(0);
  });

  it('filters templates by category', () => {
    const { result } = renderHook(() => useHabitTemplates());
    
    const healthTemplates = result.current.getTemplatesByCategory('Saúde');
    expect(healthTemplates.every(t => t.category === 'Saúde')).toBe(true);
  });

  it('returns popular templates', () => {
    const { result } = renderHook(() => useHabitTemplates());
    
    const popularTemplates = result.current.getPopularTemplates();
    expect(popularTemplates.every(t => t.is_popular)).toBe(true);
  });

  it('filters templates by difficulty', () => {
    const { result } = renderHook(() => useHabitTemplates());
    
    const easyTemplates = result.current.getTemplatesByDifficulty('easy');
    expect(easyTemplates.every(t => t.difficulty === 'easy')).toBe(true);
  });

  it('searches templates by query', () => {
    const { result } = renderHook(() => useHabitTemplates());
    
    const searchResults = result.current.searchTemplates('water');
    expect(searchResults.length).toBeGreaterThan(0);
    expect(searchResults.some(t => 
      t.name.toLowerCase().includes('water') || 
      t.description.toLowerCase().includes('water') ||
      t.tags.some(tag => tag.toLowerCase().includes('water'))
    )).toBe(true);
  });

  it('creates habit from template successfully', async () => {
    const { result } = renderHook(() => useHabitTemplates());
    
    const template = result.current.templates[0];
    const success = await result.current.createHabitFromTemplate(template);
    
    expect(success).toBe(true);
  });

  it('handles template creation error', async () => {
    // Mock error response
    vi.mocked(supabase.from).mockReturnValueOnce({
      insert: vi.fn(() => Promise.resolve({ error: new Error('Database error') })),
    } as any);

    const { result } = renderHook(() => useHabitTemplates());
    
    const template = result.current.templates[0];
    const success = await result.current.createHabitFromTemplate(template);
    
    expect(success).toBe(false);
  });
});