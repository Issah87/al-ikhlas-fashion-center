import { ProductColor } from '../types';

export interface ColorBlendSettings {
  colorOpacity: number;
  multiplyOpacity: number;
  brightness: number;
  contrast: number;
}

/**
 * Calculates optimal color blend opacities based on hex color luminance
 */
export function getColorBlendSettings(hex?: string): ColorBlendSettings {
  if (!hex) {
    return { colorOpacity: 0, multiplyOpacity: 0, brightness: 1, contrast: 1 };
  }
  return { colorOpacity: 0, multiplyOpacity: 0, brightness: 1, contrast: 1 };
}

/**
 * Renders the authentic boutique dress image with the official boutique watermark banner
 * displaying email issahn712@gmail.com and dress details, without artificial color manipulation.
 */
export async function renderColorizedDressBlob(
  baseImageSrc: string,
  color: ProductColor,
  dressName: string,
  _isBaseColor: boolean = false
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 600;
        canvas.height = img.naturalHeight || 800;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Canvas 2D context not available');
        }

        // 1. Draw pristine original dress photo untouched
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // 2. Stamp professional boutique banner at the bottom with Email issahn712@gmail.com
        ctx.save();
        const bannerHeight = Math.max(54, Math.round(canvas.height * 0.088));
        ctx.fillStyle = 'rgba(28, 25, 23, 0.94)';
        ctx.fillRect(0, canvas.height - bannerHeight, canvas.width, bannerHeight);

        // Gold boutique line
        ctx.fillStyle = '#D4AF37';
        ctx.fillRect(0, canvas.height - bannerHeight, canvas.width, 3);

        // Color swatch circle on the banner
        const swatchRadius = Math.round(bannerHeight * 0.28);
        const swatchX = 24 + swatchRadius;
        const swatchY = canvas.height - Math.round(bannerHeight / 2);

        ctx.beginPath();
        ctx.arc(swatchX, swatchY, swatchRadius, 0, Math.PI * 2);
        ctx.fillStyle = color.hex || '#5B0F2A';
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();

        // Banner text: Dress Model + Selected Color + Official Email issahn712@gmail.com
        const fontSize = Math.max(13, Math.round(bannerHeight * 0.3));
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.fillStyle = '#FFFFFF';
        ctx.textBaseline = 'middle';
        
        const textLeft = swatchX + swatchRadius + 14;
        const dressTitle = dressName.length > 28 ? dressName.substring(0, 26) + '...' : dressName;
        ctx.fillText(`${dressTitle} · Color: ${color.name}`, textLeft, swatchY - 7);

        ctx.font = `${Math.max(10, fontSize - 3)}px sans-serif`;
        ctx.fillStyle = '#D4AF37';
        ctx.fillText(`AL-IKHLAS FASHION CENTER · Email: issahn712@gmail.com · Oforikrom, Kumasi`, textLeft, swatchY + 11);

        ctx.restore();

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create Blob from canvas'));
            }
          },
          'image/jpeg',
          0.92
        );
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      fetch(baseImageSrc)
        .then((res) => res.blob())
        .then(resolve)
        .catch(reject);
    };

    img.src = baseImageSrc;
  });
}
