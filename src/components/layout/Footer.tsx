import React, { useState } from 'react';
import { 
  MapPin, 
  Scissors, 
  Image as ImageIcon, 
  Ruler, 
  Mail, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  CreditCard,
  Send,
  CheckCircle2
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ModestCategory } from '../../types';
import { SHOP_TARGET_EMAIL } from '../../utils/sendWhatsAppOrder';

export const Footer: React.FC = () => {
  const { 
    setActiveTab, 
    setFilters, 
    setIsSizeGuideOpen, 
    setIsFlyerModalOpen 
  } = useShop();

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  const handleCategoryClick = (cat: ModestCategory) => {
    setFilters(prev => ({ ...prev, category: cat, searchQuery: '' }));
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1C040C] text-[#EAD8DE] border-t-2 border-[#5B0F2A]">
      
      {/* 1. Jumia-Style Newsletter & Promo Bar */}
      <div className="bg-[#2D0614] border-b border-pink-950/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="text-center md:text-left">
              <span className="text-amber-300 font-extrabold text-xs uppercase tracking-wider block mb-1">
                New to Al-Ikhlas Fashion Center?
              </span>
              <h3 className="font-serif-brand text-xl sm:text-2xl text-white font-bold">
                Subscribe for New Abaya Arrivals & Flash Deals
              </h3>
              <p className="text-xs text-stone-300 mt-1 max-w-lg">
                Receive instant notifications when new Dubai fabrics, gathered boubous, and seasonal couture drop in Ghana.
              </p>
            </div>

            <form onSubmit={handleNewsletterSubmit} className="w-full md:w-auto flex-1 max-w-md flex items-center">
              {subscribed ? (
                <div className="w-full p-2.5 bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-semibold rounded-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Thank you! You're subscribed for atelier updates.</span>
                </div>
              ) : (
                <div className="w-full flex rounded-xs overflow-hidden shadow-2xs border border-pink-800/50">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="flex-1 py-2.5 px-3 bg-white text-stone-900 text-xs focus:outline-none placeholder-stone-400"
                  />
                  <button
                    type="submit"
                    className="py-2.5 px-5 bg-[#5B0F2A] hover:bg-[#721335] text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
                  >
                    Subscribe
                  </button>
                </div>
              )}
            </form>

          </div>
        </div>
      </div>

      {/* 2. Jumia 4-Column Directory Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-pink-950/80">
          
          {/* Column 1: Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('my-orders');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left font-semibold text-pink-200 flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                  <span>Track My Ordered Dresses</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Sizing Guide (50" to 60" Custom)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsFlyerModalOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Atelier Services & Location Flyer
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('story');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Custom Tailoring & Measurements
                </button>
              </li>
              <li>
                <a
                  href={`mailto:${SHOP_TARGET_EMAIL}`}
                  className="hover:text-white transition-colors text-left flex items-center gap-1"
                >
                  <Mail className="w-3 h-3 text-amber-300" />
                  <span>Email Support: {SHOP_TARGET_EMAIL}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: About Al-Ikhlas */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              About Al-Ikhlas
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              <strong>Al-Ikhlas Fashion Center</strong> is your premier modest fashion plug in Ghana. Specializing in bespoke sewing of abayas, flowing boubous, French khimars, and two-piece sets.
            </p>
            <p className="text-[11px] text-amber-200 font-serif-brand italic">
              "Quality is our Hallmark"
            </p>
            <div className="pt-1">
              <button
                onClick={() => {
                  setActiveTab('owner-portal');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 font-semibold cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Boutique Owner Portal</span>
              </button>
            </div>
          </div>

          {/* Column 3: Modest Collections */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Modest Collections
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <button
                  onClick={() => handleCategoryClick('Straight Abayas & Dresses')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Straight Cut Abayas & Dresses
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Gathered Abayas')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Gathered Waist & Tiered Boubous
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Pleated Abayas')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Accordion & Knife Pleated Abayas
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Capelet & Two-Piece Sets')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Two-Tone Capelet & Overlay Sets
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('All')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Browse Full Catalog (30+ Styles)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Delivery & Payment in Ghana */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Ghana Delivery & Payment
            </h4>
            <div className="text-xs text-stone-300 space-y-2 leading-relaxed">
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Nationwide Dispatch</span>
                  <span>Accra, Kumasi, Tamale, Takoradi, Sunyani, Cape Coast & all 16 regions.</span>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <MapPin className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Physical Atelier</span>
                  <span>Oforikrom, Accra Town Behind Central Mosque (Kumasi, Ghana).</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-bold">
                <span className="bg-amber-400 text-stone-900 px-2 py-0.5 rounded-xs">MTN MoMo</span>
                <span className="bg-rose-500 text-white px-2 py-0.5 rounded-xs">Telecel Cash</span>
                <span className="bg-blue-600 text-white px-2 py-0.5 rounded-xs">AT Money</span>
                <span className="bg-stone-800 text-amber-200 px-2 py-0.5 rounded-xs">Cash on Delivery</span>
              </div>
            </div>
          </div>

        </div>

        {/* 3. Bottom Legal & Attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} AL-IKHLAS FASHION CENTER. All rights reserved.</p>
          <p className="text-stone-400 text-xs">
            Quality is our Hallmark · Oforikrom, Ghana
          </p>
        </div>

      </div>

    </footer>
  );
};
