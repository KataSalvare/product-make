import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away' | 'busy' | 'none';
  shape?: 'circle' | 'rounded';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  name = '',
  size = 'md',
  status = 'none',
  shape = 'circle',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-lg',
  };

  const shapeStyles = {
    circle: 'rounded-full',
    rounded: 'rounded-lg',
  };

  const statusColors = {
    online: 'bg-[var(--secondary)]',
    offline: 'bg-[var(--outline)]',
    away: 'bg-[var(--tertiary-container)]',
    busy: 'bg-[var(--error)]',
    none: '',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`${sizeStyles[size]} ${shapeStyles[shape]} object-cover border-2 border-[var(--surface)]`}
        />
      ) : (
        <div
          className={`${sizeStyles[size]} ${shapeStyles[shape]} bg-[var(--primary-container)] text-[var(--on-primary-container)] flex items-center justify-center font-semibold border-2 border-[var(--surface)]`}
        >
          {getInitials(name)}
        </div>
      )}
      {status !== 'none' && (
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 ${statusColors[status]} border-2 border-[var(--surface)] rounded-full`}
        />
      )}
    </div>
  );
};
