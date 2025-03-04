import * as XLSX from 'xlsx';

interface ExcelData {
    [key: string]: any; // Each row is an object with key-value pairs
}

/**
 * Reads an Excel file and returns its data as an array of objects.
 * @param file - The Excel file to read.
 * @returns A promise that resolves to an array of objects representing the Excel data.
 */
export const readExcelFile = (file: File): Promise<ExcelData[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                if (!data) {
                    throw new Error('No data found in the file.');
                }

                // Parse the Excel file
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0]; // Get the first sheet
                const sheet = workbook.Sheets[sheetName];

                // Convert the sheet to JSON
                const jsonData = XLSX.utils.sheet_to_json(sheet);
                resolve(jsonData as ExcelData[]);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = (error) => {
            reject(error);
        };

        // Read the file as a binary string
        reader.readAsBinaryString(file);
    });
};