import * as XLSX from 'xlsx';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildReportWorkbook, exportToExcel } from './ExportExcel';

vi.mock('xlsx', async importOriginal => {
    const actual = await importOriginal<typeof import('xlsx')>();
    return { ...actual, writeFile: vi.fn() };
});

const rows = [
    { scholarNo: '2300000001', name: 'Demo Student', percentage: 82.5 },
    { scholarNo: '2300000002', name: 'Second Student', percentage: 64 },
];

describe('buildReportWorkbook', () => {
    it('puts the rows on a single sheet named Report', () => {
        const wb = buildReportWorkbook(rows);
        expect(wb.SheetNames).toEqual(['Report']);
    });

    it('writes a header row from the object keys followed by the values', () => {
        const sheet = buildReportWorkbook(rows).Sheets.Report;
        expect(XLSX.utils.sheet_to_json(sheet, { header: 1 })).toEqual([
            ['scholarNo', 'name', 'percentage'],
            ['2300000001', 'Demo Student', 82.5],
            ['2300000002', 'Second Student', 64],
        ]);
    });

    it('produces an empty sheet for no rows', () => {
        const sheet = buildReportWorkbook([]).Sheets.Report;
        expect(XLSX.utils.sheet_to_json(sheet)).toEqual([]);
    });
});

describe('exportToExcel', () => {
    beforeEach(() => vi.mocked(XLSX.writeFile).mockReset());

    it('downloads report.xlsx by default and uses a custom name when given', () => {
        exportToExcel(rows);
        exportToExcel(rows, 'class-5A.xlsx');
        const names = vi.mocked(XLSX.writeFile).mock.calls.map(call => call[1]);
        expect(names).toEqual(['report.xlsx', 'class-5A.xlsx']);
    });

    it('logs instead of throwing when the download fails', () => {
        vi.mocked(XLSX.writeFile).mockImplementationOnce(() => { throw new Error('blocked'); });
        const log = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => exportToExcel(rows)).not.toThrow();
        expect(log).toHaveBeenCalledWith('Error exporting Excel:', expect.objectContaining({ message: 'blocked' }));
    });
});
