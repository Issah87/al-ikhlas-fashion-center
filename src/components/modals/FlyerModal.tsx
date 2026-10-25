import React from 'react';
import { X, MapPin, MessageSquare, Scissors, Mail, Sparkles, ShoppingBag } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { SHOP_TARGET_EMAIL } from '../../utils/sendWhatsAppOrder';
import tealImg from '../../assets/images/abaya_teal_beige_capelet_1790461867481.jpg';
import roseImg from '../../assets/images/abaya_rose_capelet_1790461877699.jpg';
import oliveImg from '../../assets/images/abaya_olive_pleated_1790461886790.jpg';
import butterflyImg from '../../assets/images/abaya_butterfly_cream_1790461896450.jpg';

export const FlyerModal: React.FC = () => {
  const { isFlyerModalOpen, setIsFlyerModalOpen, openInquiryModal, setActiveTab } = useShop();

  if (!isFlyerModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative bg-[#540B25] text-white max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border-2 border-amber-300/40 rounded-lg p-6 sm:p-8 space-y-6">
        
        {/* Close button */}
        <button
          onClick={() => setIsFlyerModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 bg-black/40 hover:bg-black/70 text-white rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Banner Replica Header */}
        <div className="text-center space-y-2 border-b border-pink-500/30 pb-4">
          <div className="inline-block bg-white text-[#540B25] px-4 py-1.5 rounded-sm font-black font-serif-brand text-2xl sm:text-3xl tracking-wide uppercase shadow-md">
            AL - IKHLAS
          </div>
          <div className="text-sm sm:text-base font-bold tracking-widest text-amber-300 uppercase">
            FASHION CENTER
          </div>
          <p className="text-xs text-pink-200 italic">
            "Your one stop shop Abaya plug · Quality is our Hallmark"
          </p>
        </div>

        {/* Services & Contact Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Services Box */}
          <div className="bg-[#3D061A] p-4 border border-pink-500/30 rounded space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5" />
              <span>SERVICES · SEWING OF:</span>
            </span>
            <ul className="space-y-1 text-stone-200">
              <li className="flex items-center gap-1.5 font-medium">✓ ABAYAS</li>
              <li className="flex items-center gap-1.5 font-medium">✓ HIJABS</li>
              <li className="flex items-center gap-1.5 font-medium">✓ KHIMAR</li>
              <li className="flex items-center gap-1.5 font-medium">✓ STRAIGHT DRESSES</li>
              <li className="flex items-center gap-1.5 text-amber-200">✓ AND MANY MORE</li>
            </ul>
          </div>

          {/* Location & Contact Box */}
          <div className="bg-[#3D061A] p-4 border border-pink-500/30 rounded space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                <span>OFFICIAL INQUIRIES & ORDERS:</span>
              </span>
              <div className="mt-2 space-y-1.5 text-xs text-white">
                <div className="p-2 bg-white/10 rounded border border-pink-500/30">
                  <span className="block text-[10px] text-pink-300 uppercase font-semibold">Official Boutique Email:</span>
                  <a href={`mailto:${SHOP_TARGET_EMAIL}`} className="block text-amber-200 hover:underline font-mono text-xs font-bold mt-0.5">
                    {SHOP_TARGET_EMAIL}
                  </a>
                </div>
                <p className="text-[11px] text-pink-200 pt-0.5">
                  Direct communication between customer and owner happens securely on the website!
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-pink-900">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>PHYSICAL SHOP LOCATION:</span>
              </span>
              <p className="mt-1 text-xs text-stone-200 font-medium">
                Oforikrom, Accra Town Behind the Central Mosque (Kumasi / Ghana)
              </p>
            </div>
          </div>
        </div>

        {/* Featured Dress Styles preview */}
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-wider text-amber-200 font-semibold block text-center">
            Currently Available Dress Styles for Sewing
          </span>
          <div className="grid grid-cols-4 gap-2">
            {[tealImg, roseImg, oliveImg, butterflyImg].map((img, i) => (
              <div key={i} className="aspect-[3/4] bg-black/40 overflow-hidden border border-pink-500/30 rounded">
                <img src={img} alt="Al-Ikhlas style" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Action button */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              setIsFlyerModalOpen(false);
              openInquiryModal();
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-[#43091D] font-bold text-xs uppercase tracking-wider rounded transition-colors shadow-md cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Inquire on Website</span>
          </button>
          
          <button
            onClick={() => {
              setIsFlyerModalOpen(false);
              setActiveTab('shop');
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-bold text-xs uppercase tracking-wider rounded transition-colors shadow-md cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Browse All 26 Dresses</span>
          </button>
        </div>

      </div>
    </div>
  );
};
