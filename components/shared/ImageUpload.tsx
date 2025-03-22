import React, { useState } from 'react';

interface ImageUploadProps {
    accept?: string; // e.g., "image/*"
    onFileChange: (files: File[] | null) => void; // Callback when files are selected
    maxSize?: number; // Max file size in bytes (e.g., 5MB = 5 * 1024 * 1024)
    allowedTypes?: string[]; // e.g., ["image/jpeg", "image/png"]
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    accept = 'image/*',
    onFileChange,
    maxSize = 5 * 1024 * 1024, // Default: 5MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif'], // Default: Common image types
}) => {
    const [error, setError] = useState<string | null>(null);
    const [fileNames, setFileNames] = useState<string[]>([]);
    const [files, setFiles] = useState<File[] | null>(null);
    const [inputKey, setInputKey] = useState(0); // Add a key to force re-render the input field after clearing the files

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = event.target.files;
        if (newFiles && newFiles.length > 0) {
            const validFiles: File[] = [];
            const invalidFiles: string[] = [];

            // Validate each file
            Array.from(newFiles).forEach((file) => {
                // Validate file type
                if (!allowedTypes.includes(file.type)) {
                    invalidFiles.push(file.name);
                    return;
                }

                // Validate file size
                if (file.size > maxSize) {
                    invalidFiles.push(file.name);
                    return;
                }

                validFiles.push(file);
            });

            if (invalidFiles.length > 0) {
                setError(
                    `The following files are invalid (wrong type or size > ${maxSize / 1024 / 1024}MB): ${invalidFiles.join(
                        ', ',
                    )}`,
                );
            } else {
                setError(null);
            }

            setFileNames(validFiles.map((file) => file.name));
            setFiles(validFiles); // Store the valid files in state
            onFileChange(validFiles); // Pass the valid files to the parent component
        } else {
            setFileNames([]);
            setFiles(null); // No files selected
            onFileChange(null);
        }
    };

    const handleClearInput = () => {
        setInputKey(inputKey + 1); // Update the key to force re-render the input field
        setFiles(null); // Clear the files state
        setFileNames([]);
        onFileChange(null); // Pass null to the parent component
    };

    return (
        <>
            <p className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400 justify-between">
                {fileNames.length > 0 ? fileNames.join(', ') : 'No files selected'}
                {files && (
                    <button type="button" className="mt-2 text-sm text-red-500 dark:text-red-400" onClick={handleClearInput}>
                        Clear
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
                        <p className="text-xs text-gray-500 dark:text-gray-400">Images (JPEG, PNG, GIF)</p>
                    </div>
                    <input
                        id={`dropzone-file-${inputKey}`}
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept={accept}
                        multiple // Allow multiple file selection
                        onClick={(e: React.MouseEvent<HTMLInputElement>) => (e.target as HTMLInputElement).value = ''}
                    />
                </label>
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </>
    );
};

export default ImageUpload;