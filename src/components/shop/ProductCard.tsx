import React, { useState } from 'react';
import { Heart, ShoppingBag, Star, Zap, ShieldCheck } from 'lucide-react';
import { Product, ProductColor } from '../../types';
import { useShop } from '../../context/ShopContext';
import { ColorizedDressImage } from './ColorizedDressImage';
import { getProductPricing, formatGHS } from '../../utils/productPricing';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false }) => {
  const { viewProduct, wishlist, toggleWishlist, addToCart, openInquiryModal } = useShop();
  const [selectedLength, setSelectedLength] = useState(product.sizes[2] || '54"');
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0] || { name: 'Standard', hex: '#333333' });

  const isFavorited = wishlist.includes(product.id);
  const baseImage = product.images[0];
  const isBaseColor = selectedColor.name === product.colors[0]?.name;
  const pricing = getProductPricing(product);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedLength, selectedColor);
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openInquiryModal(product, selectedColor, selectedLength, 'buy');
  };

  return (
    <div
      onClick={() => viewProduct(product.slug)}
      className="group relative flex flex-col bg-white border border-stone-200/90 rounded-sm overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md hover:border-amber-300"
    >
      {/* Visual Asset Container */}
      <div className="relative w-full aspect-[3/4] bg-[#F5F2EB] overflow-hidden">
        <ColorizedDressImage
          baseImage={baseImage}
          color={selectedColor}
          isBaseColor={isBaseColor}
          alt={`${product.name} in ${selectedColor.name}`}
          className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
          containerClassName="w-full h-full relative"
          showBadge={false}
        />

        {/* Fallback container */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#F7F4ED] to-[#EAE4D7] flex items-center justify-center p-6 text-center">
          <span className="font-serif-brand text-lg text-stone-500 font-semibold">Al-Ikhlas</span>
        </div>

        {/* Jumia-style Discount Tag (Top-Right) */}
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
          <span className="bg-[#E02A3B] text-white text-[11px] font-extrabold px-1.5 py-0.5 rounded-xs shadow-xs tracking-tight">
            -{pricing.discountPercent}%
          </span>
          {product.badge && (
            <span className="bg-amber-400 text-stone-900 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-xs shadow-xs">
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist Button (Top-Left) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-2 left-2 p-1.5 bg-white/90 hover:bg-white text-stone-700 hover:text-rose-600 rounded-full shadow-xs transition-colors cursor-pointer"
          aria-label="Add to Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Jumia Express / Official Tag Badge */}
        <div className="absolute bottom-2 left-2">
          <span className="inline-flex items-center gap-1 bg-stone-900/85 backdrop-blur-xs text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-wide">
            <ShieldCheck className="w-2.5 h-2.5" />
            Official Atelier
          </span>
        </div>

        {/* Quick Length Selector on Desktop Hover */}
        <div className="absolute bottom-0 inset-x-0 p-2 bg-white/95 backdrop-blur-sm border-t border-stone-200 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200 hidden sm:flex items-center justify-between gap-1 z-20">
          <div className="flex items-center gap-1 overflow-x-auto py-0.5">
            {product.sizes.slice(0, 4).map((sz) => (
              <button
                key={sz}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedLength(sz);
                }}
                className={`px-1.5 py-0.5 text-[9px] font-bold rounded-xs transition-all ${
                  selectedLength === sz
                    ? 'bg-[#5B0F2A] text-white'
                    : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>

          <button
            onClick={handleQuickAdd}
            className="px-2 py-1 bg-[#5B0F2A] hover:bg-[#43091D] text-white text-[9px] font-bold uppercase tracking-wider rounded-xs cursor-pointer whitespace-nowrap"
          >
            + Bag
          </button>
        </div>
      </div>

      {/* Metadata & Description */}
      <div className="p-3 flex flex-col flex-1 justify-between bg-white space-y-2">
        <div className="space-y-1">
          {/* Category */}
          <div className="text-[10px] text-stone-400 uppercase font-semibold truncate">
            {product.category}
          </div>

          {/* Product Name (Clean 2-line clamp like Jumia) */}
          <h3 className="text-xs font-semibold text-stone-800 group-hover:text-[#5B0F2A] transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Jumia Pricing Presentation */}
          <div className="pt-1 flex items-baseline gap-2">
            <span className="text-sm font-bold text-stone-900 tracking-tight">
              {formatGHS(pricing.price)}
            </span>
            <span className="text-xs text-stone-400 line-through">
              {formatGHS(pricing.originalPrice)}
            </span>
          </div>

          {/* Rating stars & review count */}
          <div className="flex items-center gap-1 text-[11px] text-stone-500">
            <div className="flex items-center text-amber-500">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            </div>
            <span className="font-semibold text-stone-700">{pricing.rating}</span>
            <span className="text-stone-400">({pricing.reviewCount})</span>
          </div>
        </div>

        {/* Color Palette Swatches */}
        <div className="pt-1.5 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-stone-500">Shade:</span>
            <span className="text-[10px] font-medium text-stone-800 truncate max-w-[90px]">
              {selectedColor.name}
            </span>
          </div>

          <div className="flex items-center -space-x-1">
            {product.colors.slice(0, 3).map((c) => {
              const isSelected = selectedColor.name === c.name;
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColor(c);
                  }}
                  className={`relative p-0.5 rounded-full transition-transform cursor-pointer ${
                    isSelected 
                      ? 'ring-1.5 ring-[#5B0F2A] scale-110 z-10' 
                      : 'opacity-85 hover:opacity-100'
                  }`}
                  title={`Choose ${c.name}`}
                >
                  <span
                    className="block w-3 h-3 rounded-full border border-black/20"
                    style={{
                      background: c.secondaryHex
                        ? `linear-gradient(135deg, ${c.hex} 50%, ${c.secondaryHex} 50%)`
                        : c.hex,
                    }}
                  />
                </button>
              );
            })}
            {product.colors.length > 3 && (
              <span className="text-[9px] text-stone-400 ml-1">
                +{product.colors.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Jumia Action Buttons */}
        <div className="pt-2 border-t border-stone-100 flex items-center gap-1.5">
          {/* BUY NOW Button (Jumia High Energy CTA) */}
          <button
            onClick={handleBuyClick}
            className="flex-1 py-1.5 px-2 bg-[#5B0F2A] hover:bg-[#43091D] text-white text-[11px] font-bold uppercase tracking-wide rounded-xs cursor-pointer transition-colors shadow-2xs flex items-center justify-center gap-1"
            title={`Buy "${product.name}" in ${selectedColor.name}`}
          >
            <ShoppingBag className="w-3 h-3" />
            <span>Buy Now</span>
          </button>

          {/* Quick Add to Bag */}
          <button
            onClick={handleQuickAdd}
            className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-semibold border border-stone-300 rounded-xs cursor-pointer transition-colors"
            title="Add to cart"
            aria-label="Add to cart"
          >
            <Zap className="w-3 h-3 text-amber-600" />
          </button>
        </div>
      </div>
    </div>
  );
};
