export type ModestCategory = 
  | 'All'
  | 'Abayas'
  | 'Straight Abayas & Dresses'
  | 'Gathered Abayas'
  | 'Pleated Abayas'
  | 'Capelet & Two-Piece Sets';

export type AbayaLength = '50"' | '52"' | '54"' | '56"' | '58"' | '60"' | 'Custom Fit';

export interface ProductColor {
  name: string;
  hex: string;
  secondaryHex?: string;
  image?: string;
}

export interface SizeInventory {
  size: AbayaLength;
  available: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ModestCategory;
  priceText: string; // e.g. "Price on Request · Custom Sewing Available"
  colors: ProductColor[];
  sizes: AbayaLength[];
  inventory: SizeInventory[];
  description: string;
  details: string[];
  fabricCare: string[];
  images: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  bestseller?: boolean;
  badge?: string;
  customSewingAvailable?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  priceText: string;
  image: string;
  size: AbayaLength;
  color: ProductColor;
  quantity: number;
  customNotes?: string;
}

export type PaymentMethod = 'momo' | 'cod' | 'order_direct' | 'direct_inquiry';

export interface OrderMessage {
  id: string;
  sender: 'customer' | 'owner';
  senderName: string;
  text: string;
  createdAt: string;
}

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  phone: string;
  region: string;
  townCity: string;
  landmarkAddress?: string;
  createdAt: string;
}

export interface OrderCustomer {
  fullName: string;
  email: string;
  phone?: string;
  region: string; // Greater Accra, Ashanti, etc.
  townCity: string; // Oforikrom, Kumasi, Accra, Madina, etc.
  landmarkAddress: string;
  preferredContact?: 'Email' | 'On-Website Portal';
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: OrderCustomer;
  items: CartItem[];
  totalAmountGhs?: number;
  paymentMethod: PaymentMethod;
  momoNetwork?: string;
  momoSenderPhone?: string;
  momoTransactionId?: string;
  momoConfirmedBeforeSubmit?: boolean;
  paymentStatus: 'Pending Verification' | 'MoMo Confirmed' | 'Pay on Pickup/Delivery' | 'Payment Verified by Owner' | 'MoMo Paid - Pending Owner Verification';
  orderStatus: 'Order Confirmed' | 'Fabric Sourced' | 'Sewing in Progress' | 'Ready for Pickup / Dispatch' | 'Delivered' | 'Inquiry Received';
  trackingNumber: string;
  createdAt: string;
  notes?: string;
  messages?: OrderMessage[];
}

export interface WebsiteInquiry {
  id: string;
  customerName: string;
  customerEmail: string;
  subject?: string;
  productName?: string;
  colorName?: string;
  length?: string;
  message: string;
  createdAt: string;
  status: 'New' | 'Replied';
  ownerReply?: string;
  repliedAt?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  primaryDomain: string;
  location: string;
  addressDetails: string;
  email: string; // issahn712@gmail.com
  services: string[];
}
