import React from 'react';
import { 
  X, 
  ChevronRight, 
  Sparkles, 
  Scissors, 
  Flame, 
  Ruler, 
  ShoppingBag,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useShop, normalizeCategory } from '../../context/ShopContext';
import { ModestCategory } from '../../types';

import tealImg from '../../assets/images/abaya_teal_beige_capelet_1790461867481.jpg';
import straightCutImg from '../../assets/images/straight_cut_abaya_1790489393785.jpg';
import gatheredTierImg from '../../assets/images/gathered_tier_abaya_1790489408055.jpg';
import pleatedMaxiImg from '../../assets/images/pleated_maxi_abaya_1790489421553.jpg';
import chocolateCoatImg from '../../assets/images/chocolate_coat_abaya_1790616629952.jpg';

interface CategoryItem {
  id: string;
  name: string;
  category: ModestCategory;
  badge: string;
  subtitle: string;
  features: string[];
  image: string;
  count: number;
}

export const CategoriesModal: React.FC = () => {
  const { 
    isCategoriesModalOpen, 
    setIsCategoriesModalOpen, 
    selectCategory, 
    filters,
    products,
    setIsSizeGuideOpen 
  } = useShop();

  if (!isCategoriesModalOpen) return null;

  const categories: CategoryItem[] = [
    {
      id: 'straight',
      name: 'Straight Abayas & Tailored Dresses',
      category: 'Straight Abayas & Dresses',
      badge: 'MINIMALIST & CLEAN',
      subtitle: 'Tailored straight columns, piping, side slits & Dubai Nida elegance',
      features: ['Dubai Nida & Linen', 'Piped & French Seams', 'Custom Lengths 50"-60"'],
      image: straightCutImg,
      count: products.filter(p => normalizeCategory(p.category) === 'Straight Abayas & Dresses').length,
    },
    {
      id: 'gathered',
      name: 'Senegalese-Inspired Gathered Boubous',
      category: 'Gathered Abayas',
      badge: 'VOLUMINOUS & FLOWING',
      subtitle: 'Tiered flow, smocked wrists, empire gathers & royal majestic drape',
      features: ['Cascading Tiers', 'Smocked Elastic Cuffs', 'Matching Chiffon Scarf'],
      image: gatheredTierImg,
      count: products.filter(p => normalizeCategory(p.category) === 'Gathered Abayas').length,
    },
    {
      id: 'pleated',
      name: 'Accordion Pleated Luxury & Sunburst Maxis',
      category: 'Pleated Abayas',
      badge: 'EID & SPECIAL OCCASIONS',
      subtitle: 'Permanent knife pleats, flared hemline, fluid motion & festive sheen',
      features: ['Sunburst Pleat Flare', 'Wrinkle-Resistant Crepe', 'Full Modest Coverage'],
      image: pleatedMaxiImg,
      count: products.filter(p => normalizeCategory(p.category) === 'Pleated Abayas').length,
    },
    {
      id: 'capelet',
      name: 'Capelet Overlays & Two-Piece Sets',
      category: 'Capelet & Two-Piece Sets',
      badge: 'SIGNATURE COUTURE',
      subtitle: 'Contrasting dual-tone capelets with inner sleeveless slips & ties',
      features: ['Detachable / Flowing Capelet', 'Two-Tone Contrast', 'Modest Breastfeeding-Friendly'],
      image: tealImg,
      count: products.filter(p => normalizeCategory(p.category) === 'Capelet & Two-Piece Sets').length,
    },
    {
      id: 'abayas',
      name: 'Classic & Coat Abayas',
      category: 'Abayas',
      badge: 'VERSATILE OUTERWEAR',
      subtitle: 'Open and closed kimono styles, button-front abayas and structured jackets',
      features: ['Belted Waist Tie', 'Pockets Included', 'Everyday & Office Wear'],
      image: chocolateCoatImg,
      count: products.filter(p => normalizeCategory(p.category) === 'Abayas').length,
    },
  ];

  const handleSelect = (cat: ModestCategory) => {
    selectCategory(cat);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCategoriesModalOpen(false)}
      />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-4 md:p-6">
        <div className="relative w-full max-w-4xl bg-[#FAF9F5] border border-stone-200 rounded-sm shadow-2xl overflow-hidden my-4">
          
          {/* Header Bar */}
          <div className="bg-[#5B0F2A] text-white p-4 sm:p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-amber-400 text-stone-950 rounded-xs flex items-center justify-center font-black text-lg shadow-xs">
                ≡
              </div>
              <div>
                <h2 className="font-serif-brand text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span>Browse All Categories</span>
                  <span className="text-[10px] bg-white/20 text-white font-mono px-2 py-0.5 rounded-full uppercase">
                    Ghana Atelier
                  </span>
                </h2>
                <p className="text-xs text-stone-200 mt-0.5">
                  Handcrafted bespoke abayas & boubous in Oforikrom, Kumasi · Custom 50" to 60"
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCategoriesModalOpen(false)}
              className="p-1.5 text-stone-300 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              aria-label="Close categories modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Filter Bar */}
          <div className="bg-white px-4 py-3 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
                Quick Filter:
              </span>
              <button
                onClick={() => handleSelect('All')}
                className={`px-3 py-1.5 rounded-xs font-bold transition-all cursor-pointer ${
                  filters.category === 'All'
                    ? 'bg-[#5B0F2A] text-white shadow-2xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                All Dresses ({products.length})
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setIsCategoriesModalOpen(false);
                  setIsSizeGuideOpen(true);
                }}
                className="text-stone-600 hover:text-[#5B0F2A] font-medium flex items-center gap-1 cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5 text-[#5B0F2A]" />
                <span>50"-60" Size Guide</span>
              </button>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {categories.map((cat) => {
                const isSelected = normalizeCategory(filters.category) === cat.category;

                return (
                  <div
                    key={cat.id}
                    onClick={() => handleSelect(cat.category)}
                    className={`group relative bg-white border rounded-xs p-3.5 flex gap-4 items-center cursor-pointer transition-all duration-200 hover:shadow-md hover:border-[#5B0F2A] ${
                      isSelected ? 'border-2 border-[#5B0F2A] bg-pink-50/40 ring-1 ring-[#5B0F2A]' : 'border-stone-200'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-24 sm:w-24 sm:h-28 shrink-0 rounded-xs overflow-hidden bg-stone-100 border border-stone-200">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-xs">
                        {cat.count} Styles
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          {cat.badge}
                        </span>
                        <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#5B0F2A] group-hover:translate-x-1 transition-all shrink-0" />
                      </div>

                      <h3 className="font-serif-brand text-sm sm:text-base font-bold text-stone-900 group-hover:text-[#5B0F2A] transition-colors leading-snug truncate">
                        {cat.name}
                      </h3>

                      <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                        {cat.subtitle}
                      </p>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {cat.features.slice(0, 2).map((feat, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded-xs"
                          >
                            ✓ {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* View All Bar */}
            <div
              onClick={() => handleSelect('All')}
              className="mt-4 p-4 bg-gradient-to-r from-[#5B0F2A] to-[#43091D] text-white rounded-xs flex items-center justify-between cursor-pointer hover:opacity-95 transition-opacity"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-amber-300" />
                <div>
                  <h4 className="font-bold text-sm sm:text-base">
                    View Complete Al-Ikhlas Atelier Catalog
                  </h4>
                  <p className="text-xs text-stone-200">
                    Explore all {products.length} custom-sewn abayas, boubous & sets in one view
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 font-bold text-xs uppercase bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xs transition-colors">
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="bg-stone-50 px-4 py-3 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-2">
            <span>
              📍 Atelier: Oforikrom, Accra Town Behind Central Mosque, Kumasi · Dispatch to all 16 Regions
            </span>
            <button
              onClick={() => setIsCategoriesModalOpen(false)}
              className="font-semibold text-stone-700 hover:text-stone-900 cursor-pointer"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
