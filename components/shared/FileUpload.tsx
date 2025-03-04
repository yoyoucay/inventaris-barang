import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { readExcelFile } from './readExcelFile';

interface FileUploadProps {
    accept?: string; // e.g., ".xlsx,.xls"
    onFileChange: (file: File | null) => void; // Callback when a file is selected
    onFileRead?: (data: any[]) => void; // Callback when Excel data is read
    maxSize?: number; // Max file size in bytes (e.g., 5MB = 5 * 1024 * 1024)
    allowedTypes?: string[]; // e.g., ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
}

const FileUpload: React.FC<FileUploadProps> = ({
    accept = '.xlsx,.xls',
    onFileChange,
    onFileRead,
    maxSize = 5 * 1024 * 1024, // Default: 5MB
    allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'], // Default: Excel
}) => {
    const [error, setError] = useState<string | null>(null);
    const [fileName, setFileName] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [inputKey, setInputKey] = useState(0); // Add a key to force re-render the input field after clearing the file

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFile = event.target.files?.[0];
        console.log('newFile :', newFile);

        if (newFile) {
            setFileName(newFile.name);

            // Validate file type
            if (!allowedTypes.includes(newFile.type)) {
                setError('Only Excel files are allowed.');
                onFileChange(null);
                return;
            }

            // Validate file size
            if (newFile.size > maxSize) {
                setError(`File size exceeds the limit of ${maxSize / 1024 / 1024}MB.`);
                onFileChange(null);
                return;
            }

            setError(null);
            setFile(newFile); // Store the selected file in state
            onFileChange(newFile); // Pass the selected file to the parent component

            // Read the Excel file and pass the data to the parent component
            if (onFileRead) {
                try {
                    const data = await readExcelFile(newFile);
                    onFileRead(data); // Pass the parsed data to the parent component
                } catch (error) {
                    console.error('Error reading Excel file:', error);
                    setError('Failed to read the Excel file.');
                }
            }
        } else {
            setFileName('');
            setFile(null); // No file selected
            onFileChange(null);
        }
    };

    const handleClearInput = () => {
        setInputKey(inputKey + 1); // Update the key to force re-render the input field
        setFile(null); // Clear the file state
        setFileName('');
        onFileChange(null); // Pass null to the parent component
    };

    return (
        <>
            <p className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400 justify-between">
                {fileName}
                {file && (
                    <button type="button" className="mt-2 text-sm text-red-500 dark:text-red-400" onClick={handleClearInput}>
                        Hapus
                    </button>
                )}
            </p>
            <div className="flex items-center justify-center w-full">
                <label
                    htmlFor={`dropzone-file-${inputKey}`}
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Excel</p>
                    </div>
                    <input
                        id={`dropzone-file-${inputKey}`}
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept={accept}
                        onClick={(e: React.MouseEvent<HTMLInputElement>) => (e.target as HTMLInputElement).value = ''}
                    />
                </label>
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </>
    );
};

export default FileUpload;