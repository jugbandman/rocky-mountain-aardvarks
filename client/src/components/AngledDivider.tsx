import React from 'react';

interface AngledDividerProps {
  color: string; // Tailwind color class for the fill (e.g., "text-white", "text-primary")
  position: 'top' | 'bottom';
  flip?: boolean; // Flip horizontally
}

export default function AngledDivider({ color, position, flip = false }: AngledDividerProps) {
  return (
    <div 
      className={`absolute left-0 w-full overflow-hidden leading-none z-10 ${
        position === 'top' ? 'top-0 -translate-y-[99%]' : 'bottom-0 translate-y-[99%]'
      }`}
    >
      <svg 
        className={`relative block w-full h-12 md:h-24 ${color}`}
        data-name="Layer 1" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
        style={{ transform: flip ? 'scaleX(-1)' : 'none' }}
      >
        {position === 'bottom' ? (
          // Slope down from left to right
          <path d="M1200 0L0 0 0 120 1200 0z" fill="currentColor"></path>
        ) : (
          // Slope up from left to right (for top of section)
          <path d="M1200 120L0 120 0 0 1200 120z" fill="currentColor"></path>
        )}
      </svg>
    </div>
  );
}
