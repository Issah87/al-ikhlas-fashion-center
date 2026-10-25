import React, { useState } from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../shop/ProductCard';
import { ModestCategory } from '../../types';

export const CuratedCollection: React.FC = () => {
  const { products, setActiveTab } = useShop();
  const [activeFilter, setActiveFilter] = useState<ModestCategory>('All');

  const filteredList = activeFilter === 'All' 
    ? products 
    : products.filter(p => p.category === activeFilter);

  return (
    <section className="py-20 bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#5B0F2A] font-bold">
              Bespoke Modest Fashion
            </span>
            <h2 className="font-serif-brand text-3xl sm:text-4xl text-stone-900 mt-1 font-bold">
              Straight, Gathered & Pleated Abaya Styles
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-xl font-light">
              Choose your favorite cut, click any color shade on the card to pick your color, and tap <strong>Buy / Order</strong> to order directly on the website and send details to the boutique owner!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveTab('my-orders');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#5B0F2A] hover:bg-[#43091D] text-white text-xs font-semibold rounded cursor-pointer transition-colors shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>My Ordered Dresses</span>
            </button>
          </div>
        </div>

        {/* Style Category Quick Toggle Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-stone-100">
          {(['All', 'Straight Abayas & Dresses', 'Gathered Abayas', 'Pleated Abayas', 'Capelet & Two-Piece Sets'] as ModestCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === cat
                  ? 'bg-[#5B0F2A] text-white border-[#5B0F2A] shadow-xs'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400'
              }`}
            >
              {cat === 'All' ? 'All Styles' : cat} ({cat === 'All' ? products.length : products.filter(p => p.category === cat).length})
            </button>
          ))}
        </div>

        {/* Dress Grid (3 cols on desktop, 2 on tablet, 1 on mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredList.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom Banner without Phone numbers */}
        <div className="mt-16 p-6 sm:p-8 bg-[#FAF9F5] border border-stone-200 text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-stone-500 font-bold block">
            Custom Measurement & Fast Sewing
          </span>
          <h3 className="font-serif-brand text-2xl text-stone-900 font-bold">
            Need Any of These Dresses in Your Custom Measurements?
          </h3>
          <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
            Drop by our shop in Oforikrom, Accra Town Behind Central Mosque, or send your measurements to us on the website. We sew promptly and deliver throughout Ghana.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold">
            <button
              onClick={() => {
                setActiveTab('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#5B0F2A] hover:bg-[#43091D] text-white rounded cursor-pointer transition-colors shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Browse All Dresses & Buy</span>
            </button>

            <button
              onClick={() => setActiveTab('my-orders')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded cursor-pointer transition-colors"
            >
              <span>View My Ordered Dresses</span>
            </button>

            <a
              href="mailto:issahn712@gmail.com"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-stone-300 text-stone-800 hover:bg-stone-50 rounded cursor-pointer transition-colors font-mono"
            >
              <span>Email: issahn712@gmail.com</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
