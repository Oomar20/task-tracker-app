// src/components/ui/button.tsx
import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive';

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
}

// Tailwind classes for each variant
const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'primary', className = '', ...props }, ref) => {
        return (
            <button
                {...props}
                ref={ref}
                className={`
          px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2
          ${variantClasses[variant]}
          ${className}
        `}
            />
        );
    }
);

Button.displayName = 'Button';
