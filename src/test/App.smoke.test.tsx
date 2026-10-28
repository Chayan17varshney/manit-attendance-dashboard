import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

// Landing and Login show a fixed 1 s splash screen before rendering.
const SPLASH = { timeout: 3000 };

// App owns its BrowserRouter, so routes are selected through the jsdom URL.
function renderAt(path: string) {
  window.history.pushState({}, '', path);
  return render(<App />);
}

describe('App smoke test', () => {
  it('renders the landing page at /', async () => {
    renderAt('/');
    expect(await screen.findByText(/welcome to manit/i, {}, SPLASH)).toBeInTheDocument();
  });

  it('renders the login form at /login', async () => {
    renderAt('/login');
    expect(await screen.findByPlaceholderText('Email', {}, SPLASH)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('redirects an unauthenticated user from a protected dashboard to /login', async () => {
    renderAt('/faculty/dashboard');
    expect(await screen.findByPlaceholderText('Email', {}, SPLASH)).toBeInTheDocument();
    expect(window.location.pathname).toBe('/login');
  });
});
