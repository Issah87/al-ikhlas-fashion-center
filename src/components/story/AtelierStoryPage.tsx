import React from 'react';
import { Phone, MessageCircle, MapPin, Scissors, Check, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import tealImg from '../../assets/images/abaya_teal_beige_capelet_1790461867481.jpg';
import butterflyImg from '../../assets/images/abaya_butterfly_cream_1790461896450.jpg';

export const AtelierStoryPage: React.FC = () => {
  const { setActiveTab, setFilters, openWhatsAppModal, setIsFlyerModalOpen } = useShop();

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-12 border-b border-stone-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#5B0F2A] font-bold block">
            Official Al-Ikhlas Fashion Center
          </span>
          <h1 className="font-serif-brand text-4xl sm:text-5xl text-stone-900 leading-tight font-bold">
            Your One Stop Shop Abaya Plug in Ghana
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed font-light">
            Located in <strong>Oforikrom, Accra Town Behind Central Mosque</strong>. Specializing in high-standard custom sewing of abayas, khimars, straight dresses, and hijabs for sisters across all 16 regions of Ghana.
          </p>
          <div className="text-lg text-[#5B0F2A] font-serif-brand font-bold italic">
            "Quality is our Hallmark"
          </div>
        </div>

        {/* Flyer banner card representation */}
        <div className="bg-[#540B25] text-white p-6 sm:p-10 rounded-lg shadow-xl border-2 border-amber-300/40 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-pink-400/30">
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-300 font-bold block">
                Official Business Registration
              </span>
              <h2 className="font-serif-brand text-3xl sm:text-4xl font-black text-white mt-1">
                AL - IKHLAS FASHION CENTER
              </h2>
              <p className="text-xs text-pink-200 mt-1">
                Oforikrom, Accra Town Behind the Central Mosque (Kumasi / Ghana)
              </p>
            </div>

            <button
              onClick={() => setIsFlyerModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-[#43091D] font-bold text-xs uppercase tracking-wider rounded transition-colors shadow-md cursor-pointer shrink-0"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Open Flyer Preview</span>
            </button>
          </div>

          {/* Services Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-2 bg-[#3D061A] p-4 rounded border border-pink-500/20">
              <span className="font-bold text-amber-300 uppercase tracking-wider block">
                SEWING SERVICES PROVIDED:
              </span>
              <ul className="space-y-1.5 text-stone-200">
                <li className="flex items-center gap-2">✓ <strong>ABAYAS:</strong> Farasha, butterfly, split-tone, two-tone capelets & open-front sets</li>
                <li className="flex items-center gap-2">✓ <strong>HIJABS:</strong> Matching chiffon, modal cotton & luxury georgette</li>
                <li className="flex items-center gap-2">✓ <strong>KHIMAR:</strong> French khimars, tie-back sets & jilbabs</li>
                <li className="flex items-center gap-2">✓ <strong>STRAIGHT DRESSES:</strong> A-line modest cuts with bell-sleeve tie capelets</li>
                <li className="flex items-center gap-2 text-amber-200">✓ <strong>AND MANY MORE</strong> custom bespoke tailoring requests</li>
              </ul>
            </div>

            <div className="space-y-3 bg-[#3D061A] p-4 rounded border border-pink-500/20">
              <span className="font-bold text-amber-300 uppercase tracking-wider block">
                DIRECT BOUTIQUE CONTACT:
              </span>
              <p className="text-stone-300 text-xs">
                Reach out directly for dress bookings, custom measurements, and nationwide delivery arrangements:
              </p>
              <div className="space-y-2 text-white">
                <div className="p-2.5 bg-white/10 rounded border border-pink-500/30">
                  <span className="block text-[10px] text-pink-300 uppercase font-semibold">Official Boutique Email:</span>
                  <a href="mailto:issahn712@gmail.com" className="block text-amber-200 font-mono text-sm font-bold hover:underline mt-0.5">
                    issahn712@gmail.com
                  </a>
                </div>
                <p className="text-[11px] text-stone-300">
                  All customer communication and order discussions happen securely on our website.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => openWhatsAppModal()}
                  className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-[#43091D] font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Inquire on Website</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Step Ordering Process in Ghana */}
        <div className="space-y-6 pt-4">
          <h2 className="font-serif-brand text-2xl sm:text-3xl text-stone-900 font-bold text-center">
            How to Order Your Custom Dress in Ghana
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-700">
            <div className="bg-white p-5 border border-stone-200 rounded shadow-xs space-y-2">
              <span className="w-7 h-7 bg-[#5B0F2A] text-white rounded-full flex items-center justify-center font-bold text-xs">
                1
              </span>
              <h3 className="font-bold text-sm text-stone-900">Choose Your Dress & Color</h3>
              <p className="leading-relaxed text-stone-600">
                Browse our curated gallery of straight, gathered, and pleated dresses. Select your preferred color and your desired abaya length (50", 52", 54", 56", 58", 60" or customized measurements).
              </p>
            </div>

            <div className="bg-white p-5 border border-stone-200 rounded shadow-xs space-y-2">
              <span className="w-7 h-7 bg-[#5B0F2A] text-white rounded-full flex items-center justify-center font-bold text-xs">
                2
              </span>
              <h3 className="font-bold text-sm text-stone-900">Place Order or Inquire on Website</h3>
              <p className="leading-relaxed text-stone-600">
                Tap Inquire with your chosen dress & shade or place an order directly on the website. You can discuss fabric options, custom fit, and progress updates with the owner directly.
              </p>
            </div>

            <div className="bg-white p-5 border border-stone-200 rounded shadow-xs space-y-2">
              <span className="w-7 h-7 bg-[#5B0F2A] text-white rounded-full flex items-center justify-center font-bold text-xs">
                3
              </span>
              <h3 className="font-bold text-sm text-stone-900">In-Store Pickup or Nationwide Dispatch</h3>
              <p className="leading-relaxed text-stone-600">
                Pick up your finished abaya in person at Oforikrom, Accra Town Behind Central Mosque, or receive doorstep delivery in Kumasi/Accra and bus parcel delivery to all Ghana regions.
              </p>
            </div>
          </div>
        </div>

        {/* Dual Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-8 border-t border-stone-200">
          <div className="aspect-[4/5] bg-stone-100 overflow-hidden border border-stone-200 rounded">
            <img
              src={butterflyImg}
              alt="Handcrafted butterfly applique abaya"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top"
            />
          </div>

          <div className="space-y-5">
            <span className="text-xs uppercase tracking-widest text-[#5B0F2A] font-bold">
              Bespoke Ghanaian Craft
            </span>
            <h2 className="font-serif-brand text-3xl text-stone-900 font-bold">
              Designed for Dignity, Modesty & Everyday Comfort
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              Every seam is sewn with utmost care so you feel confident at church, mosque, university lectures, weddings, and family events. We pride ourselves on clean finishing, secure stitches, and modest cuts.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => {
                  setFilters(prev => ({ ...prev, category: 'All' }));
                  setActiveTab('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-[#5B0F2A] hover:bg-[#43091D] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer rounded"
              >
                View All Dresses
              </button>

              <button
                onClick={() => openWhatsAppModal()}
                className="inline-flex items-center gap-2 px-5 py-3 border border-[#5B0F2A] bg-pink-50 text-[#5B0F2A] text-xs font-bold hover:bg-pink-100 transition-colors cursor-pointer rounded"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#5B0F2A]" />
                <span>Inquire on Website</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
