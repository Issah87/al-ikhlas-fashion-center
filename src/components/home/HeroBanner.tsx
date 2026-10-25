import React from 'react';
import { ArrowRight, ShoppingBag, MapPin, Scissors, Image as ImageIcon } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import tealImg from '../../assets/images/abaya_teal_beige_capelet_1790461867481.jpg';

export const HeroBanner: React.FC = () => {
  const { setActiveTab, setFilters, setIsFlyerModalOpen } = useShop();

  const handleExploreAll = () => {
    setFilters(prev => ({ ...prev, category: 'All' }));
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative w-full min-h-[580px] lg:min-h-[660px] bg-[#43091D] text-white flex items-center overflow-hidden">
      {/* Background visual asset with measured scrim */}
      <div className="absolute inset-0">
        <img
          src={tealImg}
          alt="Al-Ikhlas Fashion Center Abayas and Modest Fashion"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#380517]/95 via-[#4A0A1F]/80 to-[#290310]/60" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="max-w-2xl space-y-6">
          
          {/* Official Flyer Badge Header */}
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-amber-300 font-bold bg-white/10 backdrop-blur-sm px-3 py-1 border border-amber-300/30">
            <span>Al-Ikhlas Fashion Center</span>
            <span aria-hidden="true">·</span>
            <span>Oforikrom, Ghana</span>
          </div>

          {/* Main Headline from User Flyer */}
          <h1 className="font-serif-brand text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08] text-balance font-bold">
            Your One Stop Shop Abaya Plug.
          </h1>

          <div className="text-xl sm:text-2xl text-amber-200 font-serif-brand italic">
            "Quality is our Hallmark"
          </div>

          {/* Services list from flyer */}
          <p className="text-sm sm:text-base text-stone-200 font-light leading-relaxed max-w-xl">
            Specializing in the professional sewing of <strong>Abayas, Hijabs, Khimar, Straight Dresses and Many More</strong>. Made-to-measure for Ghanaian women & girls with high-grade breathable fabrics.
          </p>

          {/* Location & Contacts */}
          <div className="p-3.5 bg-black/40 border border-amber-300/40 rounded-sm text-xs space-y-1.5 max-w-lg">
            <div className="flex items-center gap-2 text-amber-300 font-medium">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>Oforikrom, Accra Town Behind the Central Mosque (Kumasi / Ghana)</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-white pt-1">
              <a href="mailto:issahn712@gmail.com" className="text-amber-200 hover:underline font-mono text-xs flex items-center gap-1 font-bold">
                <span>Official Email: issahn712@gmail.com</span>
              </a>
              <span className="text-amber-300/50">·</span>
              <span className="text-pink-200 text-[11px]">Bespoke Sizing & Nationwide Bus Dispatch</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={handleExploreAll}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-[#4A0A1F] font-bold text-xs uppercase tracking-wider hover:bg-stone-100 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
            >
              <span>Explore All Abayas & Dresses</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setActiveTab('my-orders');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-amber-400 hover:bg-amber-300 text-[#43091D] font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer whitespace-nowrap"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>My Ordered Dresses</span>
            </button>

            <button
              onClick={() => setIsFlyerModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 bg-transparent border border-amber-300/60 text-amber-200 font-medium text-xs uppercase tracking-wider hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ImageIcon className="w-4 h-4 text-amber-300" />
              <span>View Shop Flyer</span>
            </button>
          </div>

          {/* Trust badges */}
          <div className="pt-4 flex flex-wrap items-center gap-5 text-xs text-stone-300">
            <div className="flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-amber-300" />
              <span>Custom Sewing to Your Height (50"–60")</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Accra, Kumasi & Nationwide Dispatch</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
