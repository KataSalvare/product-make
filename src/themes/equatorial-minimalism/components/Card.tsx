import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'md',
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const shadowStyles = {
    none: '',
    sm: 'shadow-ambient-sm',
    md: 'shadow-ambient',
    lg: 'shadow-ambient-lg',
  };

  return (
    <div
      className={`bg-[var(--surface-container-low)] rounded-lg ${paddingStyles[padding]} ${shadowStyles[shadow]} ${className}`}
    >
      {children}
    </div>
  );
};
