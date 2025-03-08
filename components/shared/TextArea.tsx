// components/Textarea.tsx
import React from 'react';

interface TextareaProps {
    id: string;
    name: string;
    defaultValue?: string;
    required?: boolean;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    className?: string;
    disabled?: boolean;
    rows?: number;
}

const Textarea: React.FC<TextareaProps> = ({
    id,
    name,
    defaultValue,
    onChange,
    required = false,
    placeholder,
    label,
    error,
    className = '',
    disabled = false,
    rows = 4,
}) => {
    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label
                    htmlFor={id}
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    {label}
                </label>
            )}
            <textarea
                id={id}
                name={name}
                defaultValue={defaultValue}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                disabled={disabled}
                rows={rows}
                className={`block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${disabled ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-600' : ''
                    }`}
            />
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default Textarea;