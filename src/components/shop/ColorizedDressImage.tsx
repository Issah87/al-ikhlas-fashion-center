import React from 'react';
import { ProductColor } from '../../types';

interface ColorizedDressImageProps {
  baseImage: string;
  color?: ProductColor | null;
  alt: string;
  className?: string;
  containerClassName?: string;
  isBaseColor?: boolean;
  showBadge?: boolean;
}

/**
 * Displays the authentic, high-quality boutique dress photo in its natural, pristine state
 * without any artificial color filters or synthetic overlays.
 */
export const ColorizedDressImage: React.FC<ColorizedDressImageProps> = ({
  baseImage,
  alt,
  className = 'w-full h-full object-cover object-top',
  containerClassName = 'relative w-full h-full overflow-hidden bg-[#F5F2EB]',
}) => {
  return (
    <div className={`relative ${containerClassName}`}>
      {/* Authentic original dress photography */}
      <img
        src={baseImage}
        alt={alt}
        referrerPolicy="no-referrer"
        className={`${className} transition-opacity duration-300`}
        onError={(e) => {
          (e.currentTarget as HTMLElement).style.display = 'none';
        }}
      />
    </div>
  );
};
