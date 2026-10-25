import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Zap, 
  Scissors, 
  Truck, 
  ShieldCheck, 
  ShoppingBag, 
  ArrowRight,
  Headphones,
  Mail,
  MapPin,
  Clock
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ModestCategory } from '../../types';
import tealImg from '../../assets/images/abaya_teal_beige_capelet_1790461867481.jpg';
import roseImg from '../../assets/images/abaya_rose_capelet_1790461877699.jpg';
import straightCutImg from '../../assets/images/straight_cut_abaya_1790489393785.jpg';
import gatheredTierImg from '../../assets/images/gathered_tier_abaya_1790489408055.jpg';

interface HeroSlide {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  image: string;
  actionText: string;
  category: ModestCategory;
  accentColor: string;
}

export const JumiaHeroSection: React.FC = () => {
  const { 
    setActiveTab, 
    setFilters, 
    selectCategory, 
    setIsCategoriesModalOpen, 
    setIsFlyerModalOpen, 
    setIsSizeGuideOpen 
  } = useShop();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: HeroSlide[] = [
    {
      id: 1,
      badge: 'Ghana\'s #1 Modest Fashion Plug',
      title: 'Your One Stop Shop Abaya Plug',
      subtitle: 'Bespoke sewing of Abayas, Boubous, Khimar & Straight Dresses. Handcrafted in Oforikrom, Kumasi.',
      image: tealImg,
      actionText: 'Shop Abayas & Boubous',
      category: 'All',
      accentColor: 'from-[#43091D]/95 via-[#5B0F2A]/85 to-transparent',
    },
    {
      id: 2,
      badge: 'Custom Lengths 50" to 60"',
      title: 'Flattering Straight & Tiered Cuts',
      subtitle: 'Breathable premium Dubai Nida & Linen fabrics sewn to your exact height and shoulder width.',
      image: straightCutImg,
      actionText: 'Explore Straight Cut',
      category: 'Straight Abayas & Dresses',
      accentColor: 'from-[#1A2E35]/95 via-[#23424D]/85 to-transparent',
    },
    {
      id: 3,
      badge: 'Festive & Occasion Couture',
      title: 'Sunburst Pleats & Two-Piece Sets',
      subtitle: 'Stunning flowing capelet overlays and pleated maxi skirts for weddings, Jumu\'ah and everyday grace.',
      image: roseImg,
      actionText: 'View Capelet Sets',
      category: 'Capelet & Two-Piece Sets',
      accentColor: 'from-[#4A1525]/95 via-[#5E1E31]/85 to-transparent',
    },
    {
      id: 4,
      badge: 'Voluminous Royal Silhouette',
      title: 'Senegalese-Inspired Gathered Boubous',
      subtitle: 'Wide empire gathers, smocked wrists, and matching rectangular chiffon hijabs.',
      image: gatheredTierImg,
      actionText: 'Discover Gathered Styles',
      category: 'Gathered Abayas',
      accentColor: 'from-[#2D2A1C]/95 via-[#3D3826]/85 to-transparent',
    },
  ];

  // Auto-advance slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleCategoryClick = (cat: ModestCategory) => {
    selectCategory(cat);
  };

  const handleSlideAction = (slide: HeroSlide) => {
    handleCategoryClick(slide.category);
  };

  const categoriesRail: { label: string; cat: ModestCategory; icon: string; count?: string }[] = [
    { label: 'Straight Abayas & Dresses', cat: 'Straight Abayas & Dresses', icon: '👗', count: '6 Styles' },
    { label: 'Gathered Boubous & Tiers', cat: 'Gathered Abayas', icon: '🌸', count: '6 Styles' },
    { label: 'Pleated Luxury & Maxi', cat: 'Pleated Abayas', icon: '✨', count: '4 Styles' },
    { label: 'Capelet & Two-Piece Sets', cat: 'Capelet & Two-Piece Sets', icon: '👑', count: '5 Styles' },
    { label: 'Classic & Coat Abayas', cat: 'Abayas', icon: '🧥', count: '5 Styles' },
    { label: 'All Abayas & Dresses', cat: 'All', icon: '🛍️', count: '26 Styles' },
  ];

  return (
    <div className="bg-[#FAF9F5] py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Jumia 3-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* COLUMN 1: Jumia Left Category Sidebar (Hidden on mobile, 3 cols on large) */}
          <div className="hidden lg:flex lg:col-span-3 flex-col bg-white border border-stone-200/90 rounded-sm shadow-2xs overflow-hidden">
            <button
              onClick={() => setIsCategoriesModalOpen(true)}
              className="p-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between hover:bg-pink-50/70 transition-colors cursor-pointer group text-left"
              title="Click to browse all categories"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5 group-hover:text-[#5B0F2A]">
                <span className="text-[#5B0F2A] font-black text-sm">≡</span> Categories
              </span>
              <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 group-hover:bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200 flex items-center gap-0.5">
                <span>Browse</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </button>

            <div className="py-1 flex-1 flex flex-col justify-between text-xs">
              <div className="divide-y divide-stone-100">
                {categoriesRail.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleCategoryClick(item.cat)}
                    className="w-full px-3.5 py-2.5 text-left flex items-center justify-between hover:bg-stone-50 hover:text-[#5B0F2A] transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{item.icon}</span>
                      <span className="font-medium text-stone-700 group-hover:text-[#5B0F2A] group-hover:font-semibold">
                        {item.label}
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#5B0F2A] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}

                {/* Additional Quick Services like Jumia Category Rail */}
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="w-full px-3.5 py-2.5 text-left flex items-center justify-between hover:bg-stone-50 text-stone-700 hover:text-[#5B0F2A] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">📏</span>
                    <span className="font-medium">Custom Sizing (50"-60")</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </button>

                <button
                  onClick={() => {
                    setActiveTab('my-orders');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full px-3.5 py-2.5 text-left flex items-center justify-between hover:bg-stone-50 text-stone-700 hover:text-[#5B0F2A] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">📦</span>
                    <span className="font-medium">Track My Ordered Dresses</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </button>

                <button
                  onClick={() => setIsFlyerModalOpen(true)}
                  className="w-full px-3.5 py-2.5 text-left flex items-center justify-between hover:bg-stone-50 text-stone-700 hover:text-[#5B0F2A] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">📜</span>
                    <span className="font-medium">Official Shop Flyer</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </button>
              </div>

              {/* Bottom sidebar snippet */}
              <div className="p-3 bg-[#FAF9F5] border-t border-stone-200 text-[11px] text-stone-600">
                <div className="flex items-center gap-1.5 font-semibold text-[#5B0F2A]">
                  <MapPin className="w-3 h-3 text-[#5B0F2A]" />
                  <span>Oforikrom, Kumasi</span>
                </div>
                <div className="text-[10px] text-stone-500 mt-0.5">
                  Behind Central Mosque · Ghana
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Jumia Center Hero Slider (7 cols on large) */}
          <div className="col-span-1 lg:col-span-6 relative bg-stone-900 rounded-sm overflow-hidden shadow-2xs min-h-[360px] sm:min-h-[400px] flex items-center">
            {slides.map((slide, idx) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  idx === currentSlide ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* Background image */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />

                {/* Dark Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.accentColor}`} />
                <div className="absolute inset-0 bg-black/25" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-10 text-white z-20 max-w-xl">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-400 text-stone-950 text-[11px] font-extrabold uppercase tracking-wide rounded-xs w-fit mb-3 shadow-xs">
                    <Zap className="w-3 h-3 fill-stone-950" />
                    <span>{slide.badge}</span>
                  </div>

                  {/* Main Title */}
                  <h1 className="font-serif-brand text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight tracking-tight mb-2 drop-shadow-sm">
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-sm text-stone-100 font-light leading-relaxed mb-6 line-clamp-3">
                    {slide.subtitle}
                  </p>

                  {/* Buttons */}
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handleSlideAction(slide)}
                      className="px-5 py-2.5 bg-white hover:bg-stone-100 text-[#5B0F2A] font-bold text-xs uppercase tracking-wider rounded-xs transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{slide.actionText}</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('my-orders');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-4 py-2.5 bg-black/40 hover:bg-black/60 text-white border border-white/40 font-semibold text-xs uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
                    >
                      <span>My Orders</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Carousel navigation arrows */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
              className="absolute left-2 z-30 p-1.5 bg-black/40 hover:bg-black/70 text-white rounded-full transition-colors cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              className="absolute right-2 z-30 p-1.5 bg-black/40 hover:bg-black/70 text-white rounded-full transition-colors cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Slider Dots */}
            <div className="absolute bottom-3 inset-x-0 z-30 flex items-center justify-center gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    i === currentSlide ? 'w-6 bg-amber-400' : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* COLUMN 3: Jumia Right Action & Service Cards (3 cols on large) */}
          <div className="col-span-1 lg:col-span-3 flex flex-col sm:flex-row lg:flex-col gap-4">
            
            {/* Top Card: Order Directly & Notify Owner */}
            <div className="flex-1 bg-white border border-stone-200/90 rounded-sm p-4 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-pink-50 text-[#5B0F2A] rounded-xs">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                      Buy & Order Direct
                    </h3>
                    <p className="text-[10px] text-stone-500">Sent straight to owner</p>
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed mb-3">
                  Pick your dress shade, choose your height (50" to 60") or submit bespoke measurements.
                </p>
              </div>

              <button
                onClick={() => handleCategoryClick('All')}
                className="w-full py-2 px-3 bg-[#5B0F2A] hover:bg-[#43091D] text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Browse Dresses</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bottom Card: Official Atelier & Contact */}
            <div className="flex-1 bg-amber-50/70 border border-amber-200/80 rounded-sm p-4 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-amber-200/60 text-amber-900 rounded-xs">
                    <Headphones className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                      Need Help / Sizing?
                    </h3>
                    <p className="text-[10px] text-amber-800">Support via website & email</p>
                  </div>
                </div>

                <div className="text-[11px] text-amber-900 space-y-1 mb-3">
                  <div className="flex items-center gap-1.5 font-medium truncate">
                    <Mail className="w-3 h-3 shrink-0 text-amber-800" />
                    <span>issahn712@gmail.com</span>
                  </div>
                  <div className="text-[10px] text-amber-800">
                    Oforikrom, Accra Town Behind Central Mosque
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="flex-1 py-1.5 px-2 bg-amber-300 hover:bg-amber-400 text-stone-900 text-[11px] font-bold uppercase tracking-wide rounded-xs transition-colors text-center cursor-pointer"
                >
                  Size Guide
                </button>
                <button
                  onClick={() => {
                    setActiveTab('my-orders');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex-1 py-1.5 px-2 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-[11px] font-semibold uppercase tracking-wide rounded-xs transition-colors text-center cursor-pointer"
                >
                  My Orders
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Mobile / Tablet Categories Bar (< lg screens) */}
        <div className="lg:hidden mt-3 bg-white border border-stone-200/90 rounded-sm p-2.5 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100 px-1">
            <button
              onClick={() => setIsCategoriesModalOpen(true)}
              className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5 hover:text-[#5B0F2A] cursor-pointer"
            >
              <span className="text-[#5B0F2A] font-black text-sm">≡</span> Categories
            </button>
            <button
              onClick={() => setIsCategoriesModalOpen(true)}
              className="text-[11px] text-[#5B0F2A] font-semibold flex items-center gap-0.5 hover:underline cursor-pointer"
            >
              <span>View All ({categoriesRail.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-thin">
            <button
              onClick={() => setIsCategoriesModalOpen(true)}
              className="shrink-0 px-3 py-1.5 bg-[#5B0F2A] hover:bg-[#43091D] text-white rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
            >
              <span className="font-mono">≡</span> All Categories
            </button>
            {categoriesRail.map((item) => (
              <button
                key={item.label}
                onClick={() => handleCategoryClick(item.cat)}
                className="shrink-0 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-200"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
