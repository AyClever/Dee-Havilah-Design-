import React, { useState } from 'react';

interface LogoProps {
  variant?: 'light' | 'dark' | 'emblem-only' | 'footer' | 'large' | 'badge';
  className?: string;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'dark',
  className = '',
  showTagline = false,
}) => {
  const [imageError, setImageError] = useState(false);

  const isLight = variant === 'light' || variant === 'footer';
  // Use dark emerald backdrop logo for dark surfaces (navbar, footer, hero),
  // and light studio logo for light cards/surfaces
  const logoSrc = isLight || variant === 'footer' ? '/logo-dark.jpg' : '/logo.jpg';

  // Sizing configurations
  const imageSizeClasses = {
    'emblem-only': 'w-10 h-10 sm:w-11 sm:h-11',
    large: 'w-16 h-16 sm:w-20 sm:h-20',
    badge: 'w-24 h-24 sm:w-28 sm:h-28',
    footer: 'w-12 h-12 sm:w-14 sm:h-14',
    light: 'w-10 h-10 sm:w-11 sm:h-11',
    dark: 'w-10 h-10 sm:w-11 sm:h-11',
  }[variant];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* 3D Sculpted Golden Emblem with Needle & Thread */}
      <div className="relative flex-shrink-0 flex items-center justify-center group">
        <div
          className={`relative overflow-hidden rounded-full border border-[#D4AF37]/60 shadow-lg transition-transform duration-300 group-hover:scale-105 ${imageSizeClasses} ${
            isLight ? 'bg-[#041A13] ring-2 ring-[#D4AF37]/30' : 'bg-white ring-1 ring-[#D4AF37]/40'
          }`}
        >
          {!imageError ? (
            <img
              src={logoSrc}
              alt="DEE HAVILAH DESIGN Emblem"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover scale-110 object-center transition-transform duration-500 group-hover:scale-125"
              onError={() => setImageError(true)}
            />
          ) : (
            /* Fallback luxury monogram if image fails */
            <div className="w-full h-full flex items-center justify-center bg-[#062319] text-[#D4AF37] font-serif font-bold text-base">
              DH
            </div>
          )}

          {/* Subtle gold radial shimmer on emblem border */}
          <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-[#D4AF37]/30 pointer-events-none" />
        </div>

        {/* Ambient gold glow */}
        <div className="absolute inset-0 rounded-full bg-[#D4AF37]/15 blur-sm pointer-events-none -z-10 group-hover:bg-[#D4AF37]/30 transition-all duration-300" />
      </div>

      {variant !== 'emblem-only' && (
        <div className="flex flex-col tracking-wider">
          <div className="flex items-baseline gap-1.5">
            <span
              className={`font-serif tracking-[0.22em] uppercase font-bold leading-tight ${
                variant === 'large'
                  ? 'text-2xl sm:text-3xl'
                  : variant === 'footer'
                  ? 'text-lg sm:text-xl text-cream-50'
                  : isLight
                  ? 'text-cream-50 text-base sm:text-lg'
                  : 'text-[#062319] text-base sm:text-lg'
              }`}
            >
              DEE HAVILAH
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 mt-0.5">
            <span className="h-[0.5px] flex-1 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="font-sans text-[10px] tracking-[0.38em] uppercase font-semibold text-[#D4AF37]">
              DESIGN
            </span>
            <span className="h-[0.5px] flex-1 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>

          {showTagline && (
            <span
              className={`text-[9px] sm:text-[10px] tracking-[0.16em] uppercase font-medium mt-1 font-serif italic ${
                isLight ? 'text-cream-200/80' : 'text-[#0B3B2C]/75'
              }`}
            >
              Elegance Woven Into Every Style
            </span>
          )}
        </div>
      )}
    </div>
  );
};
