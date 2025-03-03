// components/ReactSelectInput.tsx
import { OptionProps } from '@/modules/lib/definitions/options';
import React from 'react';
import Select, { ActionMeta, SingleValue, StylesConfig } from 'react-select';

interface SelectInputProps {
    id: string;
    name: string;
    defaultValue: OptionProps | null;
    onChange: (selectedOption: SingleValue<OptionProps>, actionMeta: ActionMeta<OptionProps>) => void;
    options: OptionProps[];
    label?: string;
    error?: string;
    isClearable?: boolean;
    placeholder?: string;
    className?: string;
}

const customStyles: StylesConfig<OptionProps, false> = {
    control: (provided, state) => ({
        ...provided,
        borderColor: state.isFocused ? '#6366f1' : '#d1d5db', // indigo-500 for focus, gray-300 for default
        boxShadow: state.isFocused ? '0 0 0 1px #6366f1' : 'none', // indigo-500 for focus
        '&:hover': {
            borderColor: '#6366f1', // indigo-500 on hover
        },
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#6366f1' : 'white', // indigo-500 for selected option
        color: state.isSelected ? 'white' : 'black',
        '&:hover': {
            backgroundColor: '#818cf8', // indigo-400 on hover
            color: 'white',
        },
    }),
};

const SelectInput: React.FC<SelectInputProps> = ({
    id,
    name,
    defaultValue,
    onChange,
    options,
    label,
    error,
    isClearable = true,
    placeholder = 'Select...',
    className = '',
}) => {
    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <Select
                id={id}
                name={name}
                defaultValue={defaultValue}
                onChange={onChange}
                options={options}
                styles={customStyles}
                isClearable={isClearable}
                placeholder={placeholder}
                className="mt-1"
            />
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default SelectInput;