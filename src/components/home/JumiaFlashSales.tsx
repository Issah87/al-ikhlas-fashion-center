import React, { useState, useEffect } from 'react';
import { Zap, ChevronRight, Clock, Flame } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../shop/ProductCard';
import { getProductPricing, formatGHS } from '../../utils/productPricing';
import { ColorizedDressImage } from '../shop/ColorizedDressImage';

export const JumiaFlashSales: React.FC = () => {
  const { products, setActiveTab, setFilters, openInquiryModal } = useShop();

  // Live countdown timer ticking down
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 12, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format2 = (n: number) => n.toString().padStart(2, '0');

  // Pick top 6 deal products
  const dealProducts = products.slice(0, 6);

  const handleSeeAll = () => {
    setFilters(prev => ({ ...prev, category: 'All' }));
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#FAF9F5] pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-stone-200/90 rounded-sm shadow-2xs overflow-hidden">
          
          {/* Jumia Iconic Flash Sales Red Header Bar */}
          <div className="bg-[#E02A3B] text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 font-black uppercase tracking-wider text-sm sm:text-base">
                <Flame className="w-5 h-5 fill-amber-300 text-amber-300 animate-pulse" />
                <span>Flash Sales</span>
              </div>

              {/* Jumia Live Countdown Timer Display */}
              <div className="flex items-center gap-1.5 text-xs font-semibold bg-black/25 px-2.5 py-1 rounded-xs">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-[11px] text-stone-200">Time Left:</span>
                <span className="font-mono text-amber-300 font-bold">
                  {format2(timeLeft.hours)}h : {format2(timeLeft.minutes)}m : {format2(timeLeft.seconds)}s
                </span>
              </div>
            </div>

            <button
              onClick={handleSeeAll}
              className="text-xs font-bold uppercase tracking-wider hover:text-amber-200 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>See All Deals</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Flash Sales Product Grid (2 on mobile, 3 on tablet, 6 on desktop) */}
          <div className="p-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {dealProducts.map((product) => {
              const pricing = getProductPricing(product);
              const totalItems = 15;
              const claimedPercent = Math.min(95, Math.max(30, 100 - (pricing.itemsLeft * 6)));

              return (
                <div
                  key={product.id}
                  className="group flex flex-col bg-white border border-stone-100 hover:border-amber-400 rounded-xs p-2 transition-all duration-200 hover:shadow-md cursor-pointer"
                  onClick={() => openInquiryModal(product, product.colors[0], product.sizes[2] || '54"', 'buy')}
                >
                  {/* Image with discount badge */}
                  <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden rounded-xs mb-2">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-1.5 right-1.5 bg-[#E02A3B] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-xs shadow-xs">
                      -{pricing.discountPercent}%
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="text-[11px] font-semibold text-stone-800 line-clamp-1 group-hover:text-[#5B0F2A] mb-1">
                    {product.name}
                  </h4>

                  {/* Prices */}
                  <div className="flex items-baseline gap-1.5 mb-1.5">
                    <span className="text-xs font-bold text-stone-900">
                      {formatGHS(pricing.price)}
                    </span>
                    <span className="text-[10px] text-stone-400 line-through">
                      {formatGHS(pricing.originalPrice)}
                    </span>
                  </div>

                  {/* Jumia Stock Claim Meter */}
                  <div className="space-y-1 mb-2">
                    <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all"
                        style={{ width: `${claimedPercent}%` }}
                      />
                    </div>
                    <div className="text-[9px] text-stone-500 flex justify-between">
                      <span>{pricing.itemsLeft} items left</span>
                      <span className="font-semibold text-amber-700">{claimedPercent}% sold</span>
                    </div>
                  </div>

                  {/* Quick Buy CTA */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openInquiryModal(product, product.colors[0], product.sizes[2] || '54"', 'buy');
                    }}
                    className="w-full py-1.5 bg-[#5B0F2A] hover:bg-[#43091D] text-white text-[10px] font-bold uppercase tracking-wider rounded-xs transition-colors mt-auto cursor-pointer shadow-2xs"
                  >
                    Buy Now
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};
