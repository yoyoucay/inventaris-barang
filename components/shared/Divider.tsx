import React from 'react';

// Define the props interface for type safety
interface DividerProps {
    color?: string;
    thickness?: string;
    margin?: string;
}

const Divider: React.FC<DividerProps> = ({
    color = 'border-gray-200',
    thickness = 'border-b',
    margin = 'my-4',
}) => {
    const dividerClasses = [thickness, color, margin].join(' ');

    return <div className={dividerClasses}></div>;
};

export default Divider;