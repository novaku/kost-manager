import React, { useState } from 'react';

interface AvatarProps {
  name?: string | null;
  src?: string | null;
  size?: number; // pixels
  className?: string;
  alt?: string;
}

// Small deterministic hash to pick a color from the palette
const nameToIndex = (name: string, max: number) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h << 5) - h + name.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h) % max;
};

const palette = [
  'bg-indigo-500',
  'bg-emerald-500',
  'bg-sky-500',
  'bg-rose-500',
  'bg-yellow-500',
  'bg-fuchsia-500',
  'bg-lime-600',
  'bg-violet-600',
];

const getInitials = (name?: string | null) => {
  if (!name) return '';
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  const first = words[0][0];
  const last = words[words.length - 1][0];
  return (first + last).toUpperCase();
};

const Avatar: React.FC<AvatarProps> = ({ name = '', src = null, size = 64, className = '', alt }) => {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(name || '');
  const colorClass = palette[name ? nameToIndex(name, palette.length) : 0];

  const fontSize = Math.max(12, Math.round(size * 0.35));

  if (src && !imageError) {
    return (
      <img
        src={src}
        alt={alt || name || 'avatar'}
        onError={() => setImageError(true)}
        style={{ width: size, height: size }}
        className={`rounded-full object-cover inline-block ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={alt || name || 'avatar'}
      title={name || 'Avatar'}
      style={{ width: size, height: size, fontSize }}
      className={`inline-flex items-center justify-center rounded-full text-white font-medium ${colorClass} ${className}`}
    >
      {initials || '?'}
    </div>
  );
};

export default Avatar;
