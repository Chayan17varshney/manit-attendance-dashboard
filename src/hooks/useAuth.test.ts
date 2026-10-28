import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuth } from './useAuth';
import type { UserRole } from '../types/auth';

// login() simulates a 1 s API call, so drive it with fake timers.
async function login(email: string, password: string, role: UserRole) {
    const pending = useAuth.getState().login(email, password, role);
    await vi.advanceTimersByTimeAsync(1000);
    return pending;
}

describe('useAuth store (mocked client-side login)', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        useAuth.setState({ user: null, isAuthenticated: false, isLoading: false });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('logs in with the demo password and persists the user', async () => {
        await login('faculty@manit.ac.in', 'password123', 'FACULTY');
        const { user, isAuthenticated, isLoading } = useAuth.getState();
        expect(isAuthenticated).toBe(true);
        expect(isLoading).toBe(false);
        expect(user?.role).toBe('FACULTY');
        expect(JSON.parse(localStorage.getItem('user')!)).toMatchObject({ role: 'FACULTY' });
    });

    it.each<UserRole>(['FACULTY', 'HOD_CSE', 'DIRECTOR', 'ADMIN'])(
        'gives a %s login a user with that role',
        async role => {
            await login('x@example.edu', 'password123', role);
            expect(useAuth.getState().user?.role).toBe(role);
        }
    );

    it('rejects a wrong password and stays logged out', async () => {
        const pending = useAuth.getState().login('x@example.edu', 'wrong', 'ADMIN');
        const assertion = expect(pending).rejects.toThrow('Invalid credentials');
        await vi.advanceTimersByTimeAsync(1000);
        await assertion;
        expect(useAuth.getState().isAuthenticated).toBe(false);
        expect(useAuth.getState().isLoading).toBe(false);
        expect(localStorage.getItem('user')).toBeNull();
    });

    it('logout clears the user and localStorage', async () => {
        await login('x@example.edu', 'password123', 'DIRECTOR');
        useAuth.getState().logout();
        expect(useAuth.getState()).toMatchObject({ user: null, isAuthenticated: false });
        expect(localStorage.getItem('user')).toBeNull();
    });
});
