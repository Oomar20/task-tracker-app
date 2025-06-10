import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}


export function Card({ children, className = '' }: CardProps) {
    return (
        <div
            className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}
        >
            {children}
        </div>
    );
}


export function CardHeader({ children, className = '' }: CardProps) {
    return (
        <div className={`px-4 py-2 border-b border-gray-200 ${className}`}
        >
            {children}
        </div>
    );
}

export function CardContent({ children, className = '' }: CardProps) {
    return (
        <div className={`p-4 ${className}`}>{children}</div>
    );
}
