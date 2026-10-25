import React, { useState } from 'react';
import { 
  Filter, 
  X, 
  Search, 
  SlidersHorizontal, 
  RotateCcw,
  Phone,
  MessageCircle,
  MapPin,
  Scissors
} from 'lucide-react';
import { useShop, normalizeCategory } from '../../context/ShopContext';
import { ProductCard } from './ProductCard';
import { ModestCategory, AbayaLength } from '../../types';

const CATEGORIES: ModestCategory[] = [
  'All',
  'Straight Abayas & Dresses',
  'Gathered Abayas',
  'Pleated Abayas',
  'Capelet & Two-Piece Sets',
  'Abayas',
];

const ALL_SIZES: AbayaLength[] = ['50"', '52"', '54"', '56"', '58"', '60"', 'Custom Fit'];

const ALL_COLORS = [
  { name: 'Petrol Teal & Sand', hex: '#1B5B66' },
  { name: 'Dusty Rose Pink', hex: '#C28490' },
  { name: 'Forest Olive Green', hex: '#3B4734' },
  { name: 'Rich Mocha Chocolate', hex: '#4A3528' },
  { name: 'Midnight Navy & Taupe', hex: '#1B263B' },
  { name: 'Sage Olive Green', hex: '#4E6148' },
  { name: 'Dusty Mauve Rose', hex: '#9E6B7A' },
  { name: 'Camel Tan & Cocoa', hex: '#B88655' },
  { name: 'Burgundy Wine', hex: '#581C28' },
  { name: 'Cream Sand', hex: '#E5D6C5' },
  { name: 'Sand Beige with Chocolate Trim', hex: '#D8C7B5' },
  { name: 'Pure Jet Black', hex: '#18181B' },
];

export const ShopPage: React.FC = () => {
  const { 
    filteredProducts, 
    products, 
    filters, 
    setFilters, 
    resetFilters, 
    setIsSizeGuideOpen,
    openInquiryModal,
    selectCategory 
  } = useShop();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const toggleSize = (sz: AbayaLength) => {
    setFilters(prev => ({
      ...prev,
      sizes: prev.sizes.includes(sz)
        ? prev.sizes.filter(s => s !== sz)
        : [...prev.sizes, sz],
    }));
  };

  const toggleColor = (cName: string) => {
    setFilters(prev => ({
      ...prev,
      colors: prev.colors.includes(cName)
        ? prev.colors.filter(c => c !== cName)
        : [...prev.colors, cName],
    }));
  };

  const activeFiltersCount = 
    (filters.category !== 'All' ? 1 : 0) +
    filters.sizes.length +
    filters.colors.length +
    (filters.searchQuery ? 1 : 0);

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-10 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="text-xs text-stone-500 mb-2">
            <span>Al-Ikhlas Fashion Center</span>
            <span className="mx-2">/</span>
            <span className="text-[#5B0F2A] font-semibold">Oforikrom, Accra Town, Ghana</span>
          </div>
          <h1 className="font-serif-brand text-3xl sm:text-4xl lg:text-5xl text-stone-900 font-bold">
            Bespoke Modest Abayas & Dresses
          </h1>
          <p className="text-sm text-stone-600 mt-2 max-w-2xl font-light">
            Available for immediate custom sewing and made-to-measure tailoring in Oforikrom, Kumasi. Choose your style—straight cut, gathered tiers, or sunburst pleats—and tap Inquire with your chosen color!
          </p>

          {/* Ghana contact prompt bar */}
          <div className="mt-4 p-3.5 bg-pink-50 border border-pink-200 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#5B0F2A] font-semibold">
              <MapPin className="w-4 h-4 text-[#5B0F2A] shrink-0" />
              <span>Atelier Location: Oforikrom, Accra Town Behind Central Mosque, Kumasi</span>
              <span className="hidden md:inline text-stone-400">·</span>
              <span className="hidden md:inline font-mono text-stone-900">Email: issahn712@gmail.com</span>
            </div>

            <button
              onClick={() => openInquiryModal()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#5B0F2A] hover:bg-[#43091D] text-white rounded font-medium transition-colors cursor-pointer self-start sm:self-auto text-xs"
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Custom Sewing Inquiry</span>
            </button>
          </div>
        </div>

        {/* Top Control Bar: Search & Mobile Filter Toggle */}
        <div className="bg-white p-4 border border-stone-200/80 mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              placeholder="Search by dress name, capelet, split or butterfly..."
              className="w-full pl-10 pr-9 py-2 text-xs bg-stone-50 border border-stone-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium border border-stone-300 bg-white hover:bg-stone-50 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filter Styles {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
            </button>

            <span className="text-xs text-stone-500 tabular-nums">
              Showing <strong className="text-stone-900 font-semibold">{filteredProducts.length}</strong> of {products.length} bespoke dress designs
            </span>
          </div>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* DESKTOP FILTER SIDEBAR */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            
            {/* Filter Header & Reset */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Filter by Style & Fit
              </span>
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-stone-500 hover:text-stone-900 inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-stone-900 block">Department</span>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => {
                  const isSelected = normalizeCategory(filters.category) === cat;
                  const count = cat === 'All' 
                    ? products.length 
                    : products.filter(p => normalizeCategory(p.category) === cat).length;

                  return (
                    <button
                      key={cat}
                      onClick={() => selectCategory(cat)}
                      className={`w-full text-left text-xs py-1.5 px-2 transition-colors cursor-pointer flex items-center justify-between rounded-xs ${
                        isSelected
                          ? 'font-bold text-[#5B0F2A] bg-pink-100/70'
                          : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100/50'
                      }`}
                    >
                      <span>{cat}</span>
                      <span className="text-[10px] text-stone-400 tabular-nums">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Abaya Length Filter */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-900">Available Lengths</span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-[10px] text-[#5B0F2A] hover:underline cursor-pointer font-medium"
                >
                  Length Guide
                </button>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {ALL_SIZES.map((sz) => {
                  const isSelected = filters.sizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      onClick={() => toggleSize(sz)}
                      className={`text-xs py-2 border transition-colors cursor-pointer text-center ${
                        isSelected
                          ? 'border-[#5B0F2A] bg-[#5B0F2A] text-white font-bold'
                          : 'border-stone-200 text-stone-700 bg-white hover:border-stone-400'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colour Swatches */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <span className="text-xs font-semibold text-stone-900 block">Colors Available</span>
              <div className="space-y-1.5">
                {ALL_COLORS.map((col) => {
                  const isSelected = filters.colors.includes(col.name);
                  return (
                    <button
                      key={col.name}
                      onClick={() => toggleColor(col.name)}
                      className={`w-full flex items-center gap-2.5 px-2 py-1.5 text-xs text-left transition-colors cursor-pointer ${
                        isSelected ? 'bg-pink-100/70 font-semibold text-[#5B0F2A]' : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <span 
                        className="w-3.5 h-3.5 rounded-full border border-stone-300 shrink-0" 
                        style={{ backgroundColor: col.hex }} 
                      />
                      <span className="flex-1 truncate">{col.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Shop location card in sidebar */}
            <div className="pt-4 border-t border-stone-200 p-3 bg-stone-100/70 rounded text-xs space-y-1.5">
              <span className="font-bold text-[#5B0F2A] block uppercase text-[10px]">
                Shop in Oforikrom, Kumasi
              </span>
              <p className="text-[11px] text-stone-600">
                Behind Central Mosque, Accra Town. Walk in for fabric selection and sizing!
              </p>
            </div>

          </aside>

          {/* PRODUCT LISTINGS AREA */}
          <main className="lg:col-span-3">

            {/* Jumia Horizontal Category Tabs Bar (Instant tap to switch categories) */}
            <div className="bg-white border border-stone-200/90 rounded-sm p-2 mb-4 shadow-2xs">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin py-0.5">
                {CATEGORIES.map((cat) => {
                  const isSelected = normalizeCategory(filters.category) === cat;
                  const count = cat === 'All' 
                    ? products.length 
                    : products.filter(p => normalizeCategory(p.category) === cat).length;

                  return (
                    <button
                      key={cat}
                      onClick={() => selectCategory(cat)}
                      className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#5B0F2A] text-white shadow-2xs'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                      }`}
                    >
                      <span>{cat}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected ? 'bg-white/20 text-white font-bold' : 'bg-stone-200 text-stone-600'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Active Filters Pill-Free Clean Bar */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6 pb-3 border-b border-stone-200 text-xs">
                <span className="text-stone-500 font-medium">Filtered by:</span>
                {filters.category !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-stone-200 text-stone-800">
                    {filters.category}
                    <button onClick={() => setFilters(prev => ({ ...prev, category: 'All' }))}>
                      <X className="w-3 h-3 hover:text-black cursor-pointer" />
                    </button>
                  </span>
                )}
                {filters.sizes.map(s => (
                  <span key={s} className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-stone-200 text-stone-800">
                    Length: {s}
                    <button onClick={() => toggleSize(s)}>
                      <X className="w-3 h-3 hover:text-black cursor-pointer" />
                    </button>
                  </span>
                ))}
                {filters.colors.map(c => (
                  <span key={c} className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-stone-200 text-stone-800">
                    {c}
                    <button onClick={() => toggleColor(c)}>
                      <X className="w-3 h-3 hover:text-black cursor-pointer" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Products Grid (Jumia Dense Catalog Layout) */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-stone-200 p-12 text-center space-y-4 my-6">
                <span className="font-serif-brand text-2xl text-stone-800 block">
                  No Dresses Match Your Search
                </span>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  Try clearing your filters to view all handcrafted dress designs.
                </p>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#5B0F2A] text-white text-xs font-semibold uppercase cursor-pointer hover:bg-[#43091D]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Show All Dresses</span>
                </button>
              </div>
            )}

          </main>

        </div>

      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <span className="font-serif-brand text-xl text-stone-900 font-bold">Filter Dresses</span>
                <button onClick={() => setMobileFilterOpen(false)} className="p-1 cursor-pointer">
                  <X className="w-5 h-5 text-stone-600" />
                </button>
              </div>

              {/* Department */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-900 uppercase">Department</span>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => {
                    const isSelected = normalizeCategory(filters.category) === cat;
                    const count = cat === 'All' 
                      ? products.length 
                      : products.filter(p => normalizeCategory(p.category) === cat).length;

                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          selectCategory(cat);
                          setMobileFilterOpen(false);
                        }}
                        className={`w-full text-left text-xs py-2 px-2.5 rounded flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected ? 'bg-[#5B0F2A] text-white font-bold' : 'text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <span>{cat}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                          isSelected ? 'bg-white/20 text-white font-bold' : 'bg-stone-100 text-stone-500'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-2 pt-3 border-t border-stone-200">
                <span className="text-xs font-bold text-stone-900 uppercase">Abaya Length</span>
                <div className="grid grid-cols-3 gap-1">
                  {ALL_SIZES.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => toggleSize(sz)}
                      className={`text-xs py-2 border text-center ${
                        filters.sizes.includes(sz) ? 'bg-[#5B0F2A] text-white font-bold' : 'border-stone-200 text-stone-700'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <div className="pt-6 border-t border-stone-200 flex gap-2">
              <button
                onClick={resetFilters}
                className="w-1/2 py-2.5 border border-stone-300 text-xs font-semibold text-stone-700 cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-1/2 py-2.5 bg-[#5B0F2A] text-white text-xs font-bold cursor-pointer"
              >
                Apply ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
