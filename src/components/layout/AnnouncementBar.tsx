import React from 'react';
import { MapPin, Image as ImageIcon, Mail, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { SHOP_TARGET_EMAIL } from '../../utils/sendWhatsAppOrder';

export const AnnouncementBar: React.FC = () => {
  const { setIsFlyerModalOpen, setActiveTab, isOwnerAuthenticated } = useShop();

  return (
    <div className="bg-[#5B0F2A] text-[#FCEEF2] text-[11px] font-medium tracking-wide py-2 px-4 border-b border-[#43091D] transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left: Location in Ghana, Official Email & MoMo */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-amber-200">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>Oforikrom, Kumasi (Ghana)</span>
          </div>
          <span className="text-pink-300 hidden md:inline">·</span>
          <div className="flex items-center gap-1 text-amber-100 font-bold">
            <span>MoMo:</span>
            <span className="font-mono text-white bg-white/20 px-1.5 py-0.5 rounded font-black">0541376807</span>
          </div>
          <span className="text-pink-300 hidden md:inline">·</span>
          <a
            href={`mailto:${SHOP_TARGET_EMAIL}`}
            className="flex items-center gap-1 text-amber-200 hover:text-white transition-colors"
            title={`Boutique Email: ${SHOP_TARGET_EMAIL}`}
          >
            <Mail className="w-3 h-3 text-pink-300 shrink-0" />
            <span className="font-mono text-white font-semibold">{SHOP_TARGET_EMAIL}</span>
          </a>
        </div>

        {/* Center: Hallmark Motto & Flyer Trigger */}
        <div className="text-center truncate">
          <span className="font-semibold text-white">Your One Stop Shop Abaya Plug</span>
          <span className="text-pink-300 mx-2">·</span>
          <span className="text-pink-100">Quality is our Hallmark</span>
          <button
            onClick={() => setIsFlyerModalOpen(true)}
            className="ml-2 inline-flex items-center gap-1 text-[10px] bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded cursor-pointer transition-colors"
          >
            <ImageIcon className="w-3 h-3" />
            <span>View Flyer</span>
          </button>
        </div>

        {/* Right: Quick Links to My Orders & Owner Portal */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <button
            onClick={() => setActiveTab('my-orders')}
            className="inline-flex items-center gap-1 text-amber-200 hover:text-white cursor-pointer transition-colors font-semibold"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
            <span>My Orders</span>
          </button>
          <span className="text-pink-400">·</span>
          <button
            onClick={() => setActiveTab('owner-portal')}
            className="inline-flex items-center gap-1 text-pink-100 hover:text-white cursor-pointer transition-colors"
            title="Owner Atelier Dashboard"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>{isOwnerAuthenticated ? 'Owner Portal (Active)' : 'Owner Portal'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
