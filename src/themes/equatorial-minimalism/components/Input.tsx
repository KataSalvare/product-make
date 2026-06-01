import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-label-sm text-[var(--on-surface)] mb-2">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-3 
          bg-[var(--surface-container-lowest)] 
          border border-[var(--outline-variant)] 
          rounded-lg
          text-[var(--on-surface)] 
          placeholder:text-[var(--on-surface-variant)]/60
          focus:outline-none 
          focus:border-[var(--secondary)]
          focus:ring-1 
          focus:ring-[var(--secondary)]
          transition-all duration-200
          ${error ? 'border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-[var(--error)]">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-[var(--on-surface-variant)]">{helperText}</p>
      )}
    </div>
  );
};
