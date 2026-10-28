import * as XLSX from 'xlsx';

// Builds a one-sheet workbook ('Report') whose header row comes from the
// keys of the first row. Kept separate from the download so it can be tested.
export const buildReportWorkbook = (data: any[]): XLSX.WorkBook => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    return workbook;
};

export const exportToExcel = (data: any[], fileName: string = 'report.xlsx') => {
    try {
        // Generate the Excel file and trigger download
        XLSX.writeFile(buildReportWorkbook(data), fileName);
    } catch (error) {
        console.error('Error exporting Excel:', error);
    }
};
