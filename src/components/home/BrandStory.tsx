import React from 'react';
import { MessageCircle, Phone, MapPin, Scissors, Check, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import roseImg from '../../assets/images/abaya_rose_capelet_1790461877699.jpg';

export const BrandStory: React.FC = () => {
  const { openWhatsAppModal, setIsFlyerModalOpen, setIsSizeGuideOpen } = useShop();

  return (
    <section className="py-20 bg-[#F5F2EB] border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Image Showcase */}
          <div className="relative">
            <div className="aspect-[4/3] bg-stone-200 overflow-hidden shadow-sm border border-stone-300">
              <img
                src={roseImg}
                alt="Al-Ikhlas Fashion Center Tailoring and Modest Wear"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
            </div>
            
            {/* Editorial Quote Box */}
            <div className="absolute -bottom-6 -right-4 sm:right-6 bg-white p-5 max-w-xs shadow-md border border-stone-200 hidden sm:block">
              <p className="font-serif-brand text-sm italic text-stone-800 leading-relaxed font-semibold">
                "Your one stop shop Abaya plug · Quality is our Hallmark"
              </p>
              <div className="mt-2 text-[10px] uppercase tracking-wider text-[#5B0F2A] font-bold">
                Al-Ikhlas Fashion Center · Oforikrom, Ghana
              </div>
            </div>
          </div>

          {/* Story Details */}
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#5B0F2A] font-bold">
              The Al-Ikhlas Hallmark
            </span>
            
            <h2 className="font-serif-brand text-3xl sm:text-4xl text-stone-900 leading-tight font-bold">
              Custom Abaya & Dress Sewing for Sisters Across Ghana
            </h2>

            <p className="text-sm text-stone-600 leading-relaxed">
              Based in Oforikrom, Accra Town Behind Central Mosque, <strong>Al-Ikhlas Fashion Center</strong> is Ghana's trusted destination for high-quality modest attire. Whether you need an abaya for Friday Jumu'ah, an Eid celebration, or everyday modest workwear, our experienced seamstresses tailor every piece to your exact height, bust, and sleeve requirements.
            </p>

            {/* 3 Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="border-l-2 border-[#5B0F2A] pl-3 py-1">
                <span className="text-xs font-bold text-stone-900 block">Quality Fabrics</span>
                <span className="text-[11px] text-stone-600">Soft, non-transparent Medinah silk and cool Dubai crepe.</span>
              </div>
              <div className="border-l-2 border-[#5B0F2A] pl-3 py-1">
                <span className="text-xs font-bold text-stone-900 block">Made to Measure</span>
                <span className="text-[11px] text-stone-600">Custom lengths 50" to 60" to prevent floor dragging or tripping.</span>
              </div>
              <div className="border-l-2 border-[#5B0F2A] pl-3 py-1">
                <span className="text-xs font-bold text-stone-900 block">Ghana Delivery</span>
                <span className="text-[11px] text-stone-600">Reliable dispatch to Kumasi, Accra, Tamale, and all towns.</span>
              </div>
            </div>

            {/* Direct Contact CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => openWhatsAppModal()}
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#5B0F2A] hover:bg-[#43091D] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Inquire on Website</span>
              </button>

              <button
                onClick={() => setIsFlyerModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-3 bg-white border border-[#5B0F2A] text-[#5B0F2A] text-xs font-bold uppercase tracking-wider hover:bg-pink-50 transition-colors cursor-pointer"
              >
                <span>View Official Flyer</span>
              </button>

              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-xs text-stone-600 hover:text-stone-900 underline ml-2 cursor-pointer"
              >
                Abaya Length Chart
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
