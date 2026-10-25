import React from 'react';
import { ChevronRight, Sparkles, Award } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../shop/ProductCard';
import { useShop } from '../../context/ShopContext';

interface JumiaProductShelfProps {
  title: string;
  subtitle?: string;
  badge?: string;
  headerBg?: string;
  headerTextColor?: string;
  products: Product[];
  categoryFilter?: string;
}

export const JumiaProductShelf: React.FC<JumiaProductShelfProps> = ({
  title,
  subtitle,
  badge,
  headerBg = 'bg-[#43091D]',
  headerTextColor = 'text-white',
  products,
  categoryFilter,
}) => {
  const { selectCategory } = useShop();

  const handleSeeAll = () => {
    selectCategory(categoryFilter || 'All');
  };

  return (
    <div className="bg-[#FAF9F5] pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-stone-200/90 rounded-sm shadow-2xs overflow-hidden">
          
          {/* Shelf Banner Header (Jumia Ribbon Bar) */}
          <div className={`${headerBg} ${headerTextColor} px-4 py-3 flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base uppercase tracking-wide flex items-center gap-2">
                <span>{title}</span>
                {badge && (
                  <span className="text-[10px] bg-amber-400 text-stone-900 font-extrabold px-1.5 py-0.5 rounded-xs tracking-normal">
                    {badge}
                  </span>
                )}
              </h3>
              {subtitle && (
                <span className="text-xs opacity-80 hidden md:inline">
                  · {subtitle}
                </span>
              )}
            </div>

            <button
              onClick={handleSeeAll}
              className="text-xs font-bold uppercase tracking-wider hover:opacity-85 flex items-center gap-1 transition-opacity cursor-pointer shrink-0"
            >
              <span>See All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Product Grid (2 on mobile, 3-4 on tablet, 6 on desktop) */}
          <div className="p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} compact={true} />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
