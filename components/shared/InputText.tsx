// components/InputText.tsx
import React from 'react';

interface InputTextProps {
    id: string;
    name: string;
    type?: string;
    defaultValue?: string;
    required: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    className?: string;
    disabled?: boolean;
}

const InputText: React.FC<InputTextProps> = ({
    id,
    name,
    type = 'text',
    defaultValue,
    onChange,
    required = false,
    placeholder,
    label,
    error,
    className = '',
    disabled = false,
}) => {
    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <input
                id={id}
                name={name}
                type={type}
                defaultValue={defaultValue}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                disabled={disabled}
                className={`mt-1 block w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${disabled ? 'bg-gray-100' : ''}`}
            />
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default InputText;