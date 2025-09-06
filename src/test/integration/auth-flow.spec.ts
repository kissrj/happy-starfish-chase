/// <reference types="@testing-library/jest-dom" />
/// <reference types="vitest" />
import React from 'react';
import { render, screen, waitFor } from '@/test/utils';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';

// Mock Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      })),
      signInWithPassword: vi.fn(() => 
        Promise.resolve({ data: { user: { id: '1', email: 'test@example.com' } }, error: null })
      ),
      signUp: vi.fn(() => 
        Promise.resolve({ data: { user: { id: '1', email: 'test@example.com' } }, error: null })
      ),
      signOut: vi.fn(() => Promise.resolve({ error: null })),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      })),
    })),
  })),
}));

describe('Authentication Flow', () => {
  it('shows login page for unauthenticated users', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    });
  });

  it('redirects to dashboard after successful login', async () => {
    const { user } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    // Wait for login page
    await waitFor(() => {
      expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    });
    
    // Fill login form
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);
    
    // Should redirect to dashboard
    await waitFor(() => {
      expect(screen.getByText('Meu Painel de Controle')).toBeInTheDocument();
    });
  });

  it('allows user to sign out', async () => {
    const { user } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    // Sign in first
    await waitFor(() => {
      expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    });
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Meu Painel de Controle')).toBeInTheDocument();
    });
    
    // Sign out
    const signOutButton = screen.getByText('Sair');
    await user.click(signOutButton);
    
    // Should redirect to login
    await waitFor(() => {
      expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    });
  });

  it('protects authenticated routes', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    // Try to access protected route without auth
    window.history.pushState({}, '', '/insights');
    
    // Should redirect to login
    await waitFor(() => {
      expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    });
  });
});