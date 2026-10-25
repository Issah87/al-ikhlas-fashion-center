import React from 'react';
import { ArrowUpRight, Scissors, Sparkles, MapPin, Phone } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ModestCategory } from '../../types';
import tealImg from '../../assets/images/abaya_teal_beige_capelet_1790461867481.jpg';
import straightCutImg from '../../assets/images/straight_cut_abaya_1790489393785.jpg';
import gatheredTierImg from '../../assets/images/gathered_tier_abaya_1790489408055.jpg';
import pleatedMaxiImg from '../../assets/images/pleated_maxi_abaya_1790489421553.jpg';

interface ServiceCard {
  title: string;
  subtitle: string;
  category: ModestCategory;
  image: string;
}

export const FeaturedCategories: React.FC = () => {
  const { selectCategory, setIsFlyerModalOpen } = useShop();

  const services: ServiceCard[] = [
    {
      title: 'Straight Cut Abayas',
      subtitle: 'Tailored straight columns, piping & linen cuts',
      category: 'Straight Abayas & Dresses',
      image: straightCutImg,
    },
    {
      title: 'Gathered Tiered Abayas',
      subtitle: 'Cascading tiers, smocked wrists & empire gathers',
      category: 'Gathered Abayas',
      image: gatheredTierImg,
    },
    {
      title: 'Accordion Pleated Abayas',
      subtitle: 'Fine vertical accordion pleats & knife pleats',
      category: 'Pleated Abayas',
      image: pleatedMaxiImg,
    },
    {
      title: 'Capelet & Two-Piece Sets',
      subtitle: 'Two-tone flowing capelet overlays & inner slips',
      category: 'Capelet & Two-Piece Sets',
      image: tealImg,
    },
  ];

  const handleSelect = (category: ModestCategory) => {
    selectCategory(category);
  };

  return (
    <section className="py-16 bg-[#FAF9F5] border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#5B0F2A] font-bold">
              Services from our Flyer
            </span>
            <h2 className="font-serif-brand text-3xl sm:text-4xl text-stone-900 mt-1 font-bold">
              Specialized Sewing for Modest Sisters
            </h2>
          </div>
          
          <button
            onClick={() => setIsFlyerModalOpen(true)}
            className="text-xs font-semibold text-[#5B0F2A] hover:text-[#380517] transition-colors inline-flex items-center gap-1 cursor-pointer bg-pink-50 px-3 py-1.5 border border-pink-200 rounded"
          >
            <span>Check Flyer Details (Oforikrom)</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4-Column Service Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((svc, i) => (
            <div
              key={i}
              onClick={() => handleSelect(svc.category)}
              className="group relative overflow-hidden bg-white border border-stone-200/90 cursor-pointer transition-all duration-300 hover:shadow-lg"
            >
              <div className="w-full aspect-[4/5] bg-stone-100 overflow-hidden relative">
                <img
                  src={svc.image}
                  alt={svc.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                <div className="absolute bottom-4 inset-x-4 text-white">
                  <div className="text-[10px] uppercase tracking-wider text-amber-300 font-bold mb-1">
                    Al-Ikhlas Service
                  </div>
                  <h3 className="font-serif-brand text-xl font-bold leading-snug">
                    {svc.title}
                  </h3>
                  <p className="text-[11px] text-stone-200 line-clamp-1 mt-1 font-light">
                    {svc.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
