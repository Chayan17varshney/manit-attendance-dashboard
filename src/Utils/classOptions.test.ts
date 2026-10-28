import { describe, expect, it } from 'vitest';
import {
    getBranchOptions,
    getSectionOptions,
    getSemesterOptions,
    getSubjectOptions,
    type ClassSession,
} from './classOptions';

const sessions: ClassSession[] = [
    { semester: '5', branch: 'CSE', section: 'A', subject: { _id: 's1', subjectName: 'Operating Systems' } },
    { semester: '5', branch: 'CSE', section: 'A', subject: { _id: 's1', subjectName: 'Operating Systems' } },
    { semester: '5', branch: 'CSE', section: 'B', subject: { _id: 's2', subjectName: 'Compilers' } },
    { semester: '5', branch: 'ECE', section: 'A', subject: { _id: 's3', subjectName: 'Signals' } },
    { semester: '7', branch: 'CSE', section: 'A', subject: { _id: 's4', subjectName: 'Machine Learning' } },
    { branch: 'CSE', section: 'C' }, // incomplete slot from the timetable
];

describe('class option helpers', () => {
    it('lists each semester once and skips slots without one', () => {
        expect(getSemesterOptions(sessions)).toEqual(['5', '7']);
    });

    it('lists only the branches taught in the chosen semester', () => {
        expect(getBranchOptions(sessions, '5')).toEqual(['CSE', 'ECE']);
        expect(getBranchOptions(sessions, '7')).toEqual(['CSE']);
    });

    it('lists only the sections for the chosen semester and branch', () => {
        expect(getSectionOptions(sessions, '5', 'CSE')).toEqual(['A', 'B']);
        expect(getSectionOptions(sessions, '5', 'ECE')).toEqual(['A']);
    });

    it('lists each subject once even when it has several timetable slots', () => {
        expect(getSubjectOptions(sessions, '5', 'CSE', 'A')).toEqual([{ id: 's1', name: 'Operating Systems' }]);
    });

    it('returns empty lists for a combination that is not in the timetable', () => {
        expect(getBranchOptions(sessions, '3')).toEqual([]);
        expect(getSectionOptions(sessions, '7', 'ECE')).toEqual([]);
        expect(getSubjectOptions(sessions, '5', 'CSE', 'Z')).toEqual([]);
    });
});
