import { Product } from '../types';

export interface ProductPriceInfo {
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  itemsLeft: number;
}

// Deterministic pricing helper for Jumia-style Ghana Cedi presentation
export function getProductPricing(product: Product): ProductPriceInfo {
  // Extract number from id e.g. "prod-001" -> 1
  const numMatch = product.id.match(/\d+/);
  const num = numMatch ? parseInt(numMatch[0], 10) : 1;

  // Realistic Ghana Cedi price table for modest fashion
  const priceTable = [
    { price: 480, original: 640 },
    { price: 420, original: 560 },
    { price: 450, original: 600 },
    { price: 390, original: 520 },
    { price: 520, original: 680 },
    { price: 460, original: 590 },
    { price: 380, original: 500 },
    { price: 490, original: 650 },
    { price: 440, original: 580 },
    { price: 410, original: 540 },
    { price: 530, original: 700 },
    { price: 470, original: 620 },
  ];

  const tableEntry = priceTable[(num - 1) % priceTable.length];
  const price = tableEntry.price;
  const originalPrice = tableEntry.original;
  const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);

  // Consistent rating and reviews
  const rating = 4.7 + ((num % 4) * 0.1);
  const reviewCount = 12 + ((num * 7) % 43);
  const itemsLeft = 3 + ((num * 5) % 15);

  return {
    price,
    originalPrice,
    discountPercent,
    rating: Math.min(5.0, Number(rating.toFixed(1))),
    reviewCount,
    itemsLeft,
  };
}

export function formatGHS(amount: number): string {
  return `GH₵ ${amount.toLocaleString('en-GH')}`;
}
