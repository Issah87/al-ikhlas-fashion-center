import { getAbsoluteImageUrl } from '../context/ShopContext';
import { ProductColor, OrderCustomer, CartItem } from '../types';

export const SHOP_TARGET_EMAIL = 'issahn712@gmail.com';

export interface SendOrderWithImageParams {
  dressName?: string;
  color?: ProductColor | { name: string; hex?: string; secondaryHex?: string };
  baseImageSrc?: string;
  isBaseColor?: boolean;
  messageText: string;
}

/**
 * Generates an email mailto URL addressed directly to issahn712@gmail.com
 */
export function createOrderEmailUrl(params: {
  to?: string;
  subject: string;
  body: string;
}): string {
  const recipient = encodeURIComponent(params.to || SHOP_TARGET_EMAIL);
  const subject = encodeURIComponent(params.subject);
  const body = encodeURIComponent(params.body);
  return `mailto:${recipient}?subject=${subject}&body=${body}`;
}

/**
 * Generates a Gmail web composer URL directly prefilled to issahn712@gmail.com
 */
export function createGmailWebUrl(params: {
  to?: string;
  subject: string;
  body: string;
}): string {
  const recipient = encodeURIComponent(params.to || SHOP_TARGET_EMAIL);
  const subject = encodeURIComponent(params.subject);
  const body = encodeURIComponent(params.body);
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${body}`;
}

/**
 * Opens the customer's email client addressed directly to issahn712@gmail.com
 */
export function openEmailOrder(params: {
  to?: string;
  subject: string;
  body: string;
}): void {
  const mailtoUrl = createOrderEmailUrl(params);
  window.location.href = mailtoUrl;
}

/**
 * Formats a clean, professional booking message for Email and on-website records
 */
export function formatBookingSummary(params: {
  orderNumber: string;
  customer: OrderCustomer;
  items: CartItem[];
  deliveryType?: string;
  paymentMethod?: string;
  notes?: string;
}): { text: string; subject: string } {
  const { orderNumber, customer, items, deliveryType = 'pickup', notes = '' } = params;

  const subject = `New Dress Booking #${orderNumber} - ${customer.fullName} (${customer.townCity})`;

  const text = 
    `🌟 AL-IKHLAS FASHION CENTER · DRESS BOOKING #${orderNumber} 🌟\n` +
    `Shop Location: Oforikrom, Accra Town Behind Central Mosque, Kumasi, Ghana\n` +
    `Official Email: ${SHOP_TARGET_EMAIL}\n` +
    `========================================\n\n` +
    `👤 CUSTOMER DETAILS:\n` +
    `• Full Name: ${customer.fullName}\n` +
    `• Customer Email: ${customer.email}\n` +
    (customer.phone ? `• Customer Contact: ${customer.phone}\n` : '') +
    `• Region: ${customer.region}\n` +
    `• Town / City: ${customer.townCity}\n` +
    (customer.landmarkAddress ? `• Landmark / Delivery Address: ${customer.landmarkAddress}\n` : '') +
    `\n` +
    `🚚 DELIVERY METHOD:\n` +
    `• ${deliveryType === 'pickup' ? 'Shop Pickup at Oforikrom, Accra Town' : deliveryType === 'dispatch' ? 'Doorstep Rider Dispatch (Kumasi / Accra)' : 'VIP / STC Bus Parcel Dispatch'}\n\n` +
    `👗 SELECTED DRESSES (${items.length}):\n` +
    items.map((item, idx) => 
      `${idx + 1}. "${item.name}"\n` +
      `   - Chosen Color: ${item.color.name}\n` +
      `   - Selected Length: ${item.size}\n` +
      `   - Quantity: ${item.quantity}\n` +
      (item.customNotes ? `   - Tailoring Notes: ${item.customNotes}\n` : '')
    ).join('\n') +
    `\n\n` +
    (notes.trim() ? `📝 CUSTOMER NOTES / MEASUREMENTS:\n${notes.trim()}\n\n` : '') +
    `========================================\n` +
    `Order transmitted to Al-Ikhlas Fashion Center on-website portal and email.`;

  return { text, subject };
}

/**
 * Downloads the dress photo separately to the customer's phone or computer.
 */
export async function downloadDressPhoto(imageSrc: string, dressName: string): Promise<void> {
  try {
    const res = await fetch(imageSrc);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeName = dressName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    a.download = `${safeName}_al_ikhlas.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    const a = document.createElement('a');
    a.href = imageSrc;
    a.download = `${dressName.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

/**
 * Shares the dress photo separately
 */
export async function shareDressPhoto(
  imageSrc: string,
  dressName: string,
  colorName?: string
): Promise<boolean> {
  const photoUrl = getAbsoluteImageUrl(imageSrc);
  const shareTitle = `Al-Ikhlas Fashion Center · ${dressName}`;
  const shareText = `Check out this dress: "${dressName}"${colorName ? ` in ${colorName}` : ''} at Al-Ikhlas Fashion Center (Oforikrom, Kumasi · Email: ${SHOP_TARGET_EMAIL}).\nPhoto: ${photoUrl}`;

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      const res = await fetch(imageSrc);
      const blob = await res.blob();
      const safeName = dressName.replace(/[^a-zA-Z0-9]/g, '_');
      const file = new File([blob], `${safeName}.jpg`, { type: blob.type || 'image/jpeg' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: shareTitle,
          text: shareText,
        });
        return true;
      } else {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: photoUrl || window.location.href,
        });
        return true;
      }
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        console.log('Share error:', e);
      }
    }
  }

  // Fallback: Clipboard copy
  if (navigator.clipboard) {
    navigator.clipboard.writeText(`${shareTitle}\n${shareText}`);
  }
  return true;
}
