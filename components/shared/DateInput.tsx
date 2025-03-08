import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateInputProps {
    label?: string;
    selectedDate: Date | null;
    onChange: (date: Date | null) => void;
    placeholderText?: string;
    isRequired?: boolean;
    disabled?: boolean;
    dateFormat?: string;
}

const DateInput: React.FC<DateInputProps> = ({
    label,
    selectedDate,
    onChange,
    placeholderText = 'Select a date',
    isRequired = false,
    disabled = false,
    dateFormat = 'yyyy-MM-dd',
}) => {
    return (
        <div className="flex date-input-container">
            {label && (
                <label className="date-input-label">
                    {label}
                    {isRequired && <span className="required-asterisk">*</span>}
                </label>
            )}
            <DatePicker
                selected={selectedDate}
                onChange={onChange}
                placeholderText={placeholderText}
                disabled={disabled}
                className="date-input"
                dateFormat={dateFormat}
            />
        </div>
    );
};

export default DateInput;