// components/Card.tsx
import React from 'react';

interface CardProps {
    children: React.ReactNode; // Accepts any content inside the card
}

const Card: React.FC<CardProps> = ({ children }) => {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            {children}
        </div>
    );
};

export default Card;