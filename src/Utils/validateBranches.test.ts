import { describe, expect, it } from 'vitest';
import { validateBranches, type Branch } from './validateBranches';

const row = (shortForm: string, extra: Partial<Branch> = {}): Branch => ({
    program: 'B.Tech',
    course: `Course ${shortForm}`,
    shortForm,
    duration: 4,
    ...extra,
});

describe('validateBranches', () => {
    it('marks complete, unique, new rows as valid', () => {
        const result = validateBranches([row('CSE'), row('ECE')], []);
        expect(result.map(r => r.status)).toEqual(['valid', 'valid']);
        expect(result.every(r => r.error === undefined)).toBe(true);
    });

    it.each([
        ['program', { program: '' }],
        ['course', { course: '' }],
        ['shortForm', { shortForm: '' }],
    ])('marks a row missing %s as invalid', (_field, missing) => {
        const [result] = validateBranches([row('CSE', missing)], []);
        expect(result).toMatchObject({ status: 'invalid', error: 'Missing required fields' });
    });

    it('marks a row whose code already exists in the department as invalid', () => {
        const [result] = validateBranches([row('CSE')], [row('CSE')]);
        expect(result).toMatchObject({ status: 'invalid', error: 'Branch already exists' });
    });

    it('keeps the original row data alongside the status', () => {
        const [result] = validateBranches([row('MECH', { duration: 2 })], []);
        expect(result).toMatchObject({ shortForm: 'MECH', duration: 2, status: 'valid' });
    });
});
