import React from 'react';

const getInitials = (name) => {
  if (!name) return '?';
  
  const names = name.split(' ').filter(part => part.length > 0);
  if (names.length === 0) return '?';
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

// Generate a consistent color based on name
const getColorFromName = (name) => {
  if (!name) return '#6B7280'; // Default gray
  
  const colors = [
    '#F87171', // red
    '#FB923C', // orange
    '#FBBF24', // amber
    '#34D399', // emerald
    '#60A5FA', // blue
    '#A78BFA', // violet
    '#F472B6', // pink
  ];
  
  // Simple hash function to get consistent color for a name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

const Avatar = ({ src, name, size = 8, className = '' }) => {
  const sizeClass = `h-${size} w-${size}`;
  
  if (src) {
    return (
      <img 
        src={src} 
        alt={name || "User avatar"} 
        className={`${sizeClass} rounded-full object-cover ${className}`}
      />
    );
  }
  
  const initials = getInitials(name);
  const backgroundColor = getColorFromName(name);
  
  return (
    <div 
      className={`${sizeClass} rounded-full flex items-center justify-center text-white ${className}`}
      style={{ backgroundColor }}
    >
      <span className={`text-${size <= 8 ? 'xs' : 'sm'} font-medium`}>
        {initials}
      </span>
    </div>
  );
};

export default Avatar;