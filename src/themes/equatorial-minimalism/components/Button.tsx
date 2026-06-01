import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-[var(--primary)] text-[var(--on-primary)] hover:bg-[var(--primary-container)] focus:ring-[var(--primary)]',
    secondary: 'bg-[var(--secondary)] text-[var(--on-secondary)] hover:bg-[var(--secondary-container)] focus:ring-[var(--secondary)]',
    outline: 'bg-transparent border-2 border-[var(--secondary)] text-[var(--secondary)] hover:bg-[var(--secondary)] hover:text-[var(--on-secondary)] focus:ring-[var(--secondary)]',
    ghost: 'bg-transparent text-[var(--primary)] hover:bg-[var(--surface-container)] focus:ring-[var(--primary)]',
  };
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm rounded-md',
    md: 'px-6 py-3 text-base rounded-lg',
    lg: 'px-8 py-4 text-lg rounded-xl',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
