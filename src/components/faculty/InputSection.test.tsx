import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import InputSection from './InputSection';

vi.mock('../../api/services/Faculty', () => ({
    getTimetable: vi.fn().mockResolvedValue({
        TimeTable: {
            monday: [
                { semester: '5', branch: 'CSE', section: 'A', subject: { _id: 's1', subjectName: 'Operating Systems' } },
                { semester: '5', branch: 'ECE', section: 'B', subject: { _id: 's3', subjectName: 'Signals' } },
            ],
            tuesday: [
                { semester: '7', branch: 'CSE', section: 'A', subject: { _id: 's4', subjectName: 'Machine Learning' } },
            ],
        },
    }),
}));

const optionTexts = (select: HTMLElement) =>
    within(select).getAllByRole('option').map(o => o.textContent);

describe('faculty InputSection class selectors', () => {
    it('cascades semester → branch → section → subject and resets lower levels on change', async () => {
        const user = userEvent.setup();
        render(<InputSection empCode="E001" />);

        await user.click(screen.getByRole('button', { name: /class/i }));

        const [semester, branch, section, subject] = await screen.findAllByRole('combobox');
        await waitFor(() => expect(optionTexts(semester)).toContain('7'));

        await user.selectOptions(semester, '5');
        expect(optionTexts(branch)).toEqual(['Select Branch', 'CSE', 'ECE']);

        await user.selectOptions(branch, 'CSE');
        await user.selectOptions(section, 'A');
        expect(optionTexts(subject)).toEqual(['Select Subject', 'Operating Systems']);

        // Changing the semester clears every choice below it.
        await user.selectOptions(semester, '7');
        expect(branch).toHaveValue('');
        expect(section).toHaveValue('');
        expect(subject).toHaveValue('');
        expect(optionTexts(branch)).toEqual(['Select Branch', 'CSE']);
    });
});

describe('faculty InputSection submit errors', () => {
    it('shows an error toast and re-enables Submit when the submit handler fails', async () => {
        const { toast } = await import('react-toastify');
        const update = vi.spyOn(toast, 'update');
        vi.spyOn(console, 'error').mockImplementation(() => {});
        const user = userEvent.setup();
        const onTimetableSubmit = vi.fn().mockRejectedValue(new Error('network down'));

        render(<InputSection empCode="E001" onTimetableSubmit={onTimetableSubmit} />);
        await user.click(screen.getByRole('button', { name: /submit/i }));

        await waitFor(() =>
            expect(update).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({ type: 'error', isLoading: false })
            )
        );
        expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled();
    });
});
