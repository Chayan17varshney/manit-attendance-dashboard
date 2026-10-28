import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';
import type { User } from '../../types/auth';

const faculty: User = { id: '1', email: 'f@example.edu', role: 'FACULTY', name: 'Demo Faculty' };

function renderProtected(allowedRoles: string[]) {
  return render(
    <MemoryRouter initialEntries={['/secret']}>
      <Routes>
        <Route
          path="/secret"
          element={
            <ProtectedRoute allowedRoles={allowedRoles}>
              <p>secret page</p>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<p>login page</p>} />
        <Route path="/unauthorized" element={<p>unauthorized page</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    useAuth.setState({ user: null, isAuthenticated: false });
  });

  it('sends an unauthenticated user to /login', () => {
    renderProtected(['FACULTY']);
    expect(screen.getByText('login page')).toBeInTheDocument();
    expect(screen.queryByText('secret page')).not.toBeInTheDocument();
  });

  it('sends a user flagged authenticated but with no user object to /login', () => {
    useAuth.setState({ user: null, isAuthenticated: true });
    renderProtected(['FACULTY']);
    expect(screen.getByText('login page')).toBeInTheDocument();
  });

  it('sends a user with the wrong role to /unauthorized', () => {
    useAuth.setState({ user: faculty, isAuthenticated: true });
    renderProtected(['ADMIN']);
    expect(screen.getByText('unauthorized page')).toBeInTheDocument();
    expect(screen.queryByText('secret page')).not.toBeInTheDocument();
  });

  it('renders the page for a user with an allowed role', () => {
    useAuth.setState({ user: faculty, isAuthenticated: true });
    renderProtected(['FACULTY']);
    expect(screen.getByText('secret page')).toBeInTheDocument();
  });

  it('accepts any role from a list of several', () => {
    useAuth.setState({ user: { ...faculty, role: 'DIRECTOR' }, isAuthenticated: true });
    renderProtected(['HOD_CSE', 'DIRECTOR']);
    expect(screen.getByText('secret page')).toBeInTheDocument();
  });
});
