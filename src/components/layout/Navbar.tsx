import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  User, 
  HelpCircle, 
  ChevronDown, 
  ShieldCheck, 
  Flame, 
  Sparkles, 
  Ruler, 
  Truck, 
  Mail, 
  MapPin 
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ModestCategory } from '../../types';
import { SHOP_TARGET_EMAIL } from '../../utils/sendWhatsAppOrder';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    cartCount, 
    setIsCartDrawerOpen, 
    setIsFlyerModalOpen,
    setIsSizeGuideOpen,
    isOwnerAuthenticated,
    currentUser,
    logoutUser,
    setFilters,
    filters,
    selectCategory,
    setIsCategoriesModalOpen 
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState('');
  const [selectedSearchCat, setSelectedSearchCat] = useState<ModestCategory>('All');
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [helpDropdownOpen, setHelpDropdownOpen] = useState(false);

  const navigateToCategory = (cat: ModestCategory) => {
    selectCategory(cat);
    setMobileMenuOpen(false);
  };

  const handleNavSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ 
      ...prev, 
      searchQuery: navSearchQuery, 
      category: selectedSearchCat 
    }));
    setActiveTab('shop');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200/90 shadow-2xs">
      
      {/* 1. Jumia Top Mini Utility Bar */}
      <div className="bg-[#FAF9F5] border-b border-stone-200/70 text-[11px] text-stone-600 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[#5B0F2A] font-semibold">
              <Truck className="w-3.5 h-3.5" />
              <span>Nationwide Delivery to all 16 Regions in Ghana</span>
            </span>
            <span className="text-stone-300">|</span>
            <span className="text-stone-500">
              Oforikrom, Accra Town Behind Central Mosque (Kumasi)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[#5B0F2A] font-bold flex items-center gap-1">
              <span>MoMo:</span>
              <strong className="font-mono text-stone-900 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">0541376807</strong>
            </span>
            <span className="text-stone-300">|</span>
            <button
              onClick={() => {
                setActiveTab('owner-portal');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-amber-800 hover:text-[#5B0F2A] font-bold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3 h-3 text-amber-600" />
              <span>Owner Portal</span>
            </button>
            <span className="text-stone-300">|</span>
            <button
              onClick={() => {
                setActiveTab('my-orders');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#5B0F2A] transition-colors font-semibold text-stone-700 cursor-pointer"
            >
              Track My Order
            </button>
          </div>
        </div>
      </div>

      {/* 2. Jumia Main Header (Logo, Big Search Bar, Account, Help, Cart) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Mobile hamburger menu and categories button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-stone-700 hover:text-stone-900 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <button
              onClick={() => setIsCategoriesModalOpen(true)}
              className="px-2.5 py-1 bg-pink-50 hover:bg-pink-100 border border-pink-200 text-[#5B0F2A] rounded-xs text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span className="font-mono font-black">≡</span> Categories
            </button>
          </div>

          {/* Jumia-style Brand Logo */}
          <button
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex flex-col text-left cursor-pointer group shrink-0"
          >
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 bg-[#5B0F2A] text-amber-300 font-black rounded-xs flex items-center justify-center text-xs shadow-2xs">
                ★
              </span>
              <span className="font-serif-brand text-xl sm:text-2xl tracking-tight text-[#4A0A1F] font-black group-hover:text-[#6E1130] transition-colors uppercase">
                Al-Ikhlas
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-wider text-stone-500 font-bold hidden sm:block">
              Fashion Center · Abaya Plug Ghana
            </span>
          </button>

          {/* Jumia Central Big Search Bar with category dropdown & button */}
          <form 
            onSubmit={handleNavSearch}
            className="hidden md:flex flex-1 max-w-2xl items-center border-2 border-[#5B0F2A] rounded-sm overflow-hidden bg-white shadow-2xs"
          >
            {/* Category dropdown */}
            <select
              value={selectedSearchCat}
              onChange={(e) => setSelectedSearchCat(e.target.value as ModestCategory)}
              className="h-10 px-3 bg-stone-50 border-r border-stone-200 text-xs font-semibold text-stone-700 focus:outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Straight Abayas & Dresses">Straight Abayas</option>
              <option value="Gathered Abayas">Gathered Boubous</option>
              <option value="Pleated Abayas">Pleated Maxi</option>
              <option value="Capelet & Two-Piece Sets">Capelet Sets</option>
            </select>

            {/* Input field */}
            <div className="relative flex-1 flex items-center">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={navSearchQuery}
                onChange={(e) => setNavSearchQuery(e.target.value)}
                placeholder="Search products, styles, abayas, sizes (50&quot;-60&quot;)..."
                className="w-full h-10 pl-9 pr-3 text-xs text-stone-900 placeholder-stone-400 focus:outline-none"
              />
              {navSearchQuery && (
                <button
                  type="button"
                  onClick={() => setNavSearchQuery('')}
                  className="p-1 text-stone-400 hover:text-stone-600 mr-2"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Search Submit Button */}
            <button
              type="submit"
              className="h-10 px-5 bg-[#5B0F2A] hover:bg-[#43091D] text-white text-xs font-bold uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Jumia Right Header Actions Stack */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            
            {/* 1. Account Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                className="flex items-center gap-1.5 p-1.5 text-stone-700 hover:text-[#5B0F2A] transition-colors cursor-pointer rounded-xs"
              >
                <div className="relative">
                  <User className={`w-5 h-5 ${currentUser ? 'text-[#5B0F2A]' : 'text-stone-700'}`} />
                  {currentUser && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full ring-1 ring-white" />
                  )}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-[10px] text-stone-400 leading-none">
                    {currentUser ? `Hi, ${currentUser.fullName.split(' ')[0]}` : 'Welcome'}
                  </span>
                  <span className="text-xs font-bold text-stone-800 flex items-center gap-0.5 leading-tight">
                    {currentUser ? 'My Account' : 'Login / Register'} <ChevronDown className="w-3 h-3 text-stone-500" />
                  </span>
                </div>
              </button>

              {accountDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white border border-stone-200 rounded-sm shadow-xl py-2 z-50 text-xs"
                  onClick={() => setAccountDropdownOpen(false)}
                >
                  {currentUser ? (
                    <>
                      <div className="px-4 py-2 border-b border-stone-100 bg-stone-50">
                        <span className="font-bold text-[#5B0F2A] block truncate">{currentUser.fullName}</span>
                        <span className="text-[10px] text-stone-500 block truncate">{currentUser.email}</span>
                        <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 inline-block">● Verified Customer</span>
                      </div>

                      <button
                        onClick={() => {
                          setActiveTab('my-orders');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-stone-50 flex items-center gap-2 text-stone-800 font-semibold cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4 text-[#5B0F2A]" />
                        <span>My Ordered Dresses</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('checkout');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-stone-50 flex items-center gap-2 text-stone-800 font-semibold cursor-pointer"
                      >
                        <Truck className="w-4 h-4 text-stone-600" />
                        <span>Go to MoMo Checkout</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('owner-portal');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-stone-50 flex items-center gap-2 text-amber-800 font-semibold cursor-pointer border-t border-stone-100"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        <span>Owner Portal (All Orders)</span>
                      </button>

                      <button
                        onClick={() => logoutUser()}
                        className="w-full px-4 py-2 text-left hover:bg-rose-50 flex items-center gap-2 text-rose-700 font-semibold cursor-pointer border-t border-stone-100"
                      >
                        <span>Sign Out of Account</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-stone-100 bg-amber-50/70">
                        <span className="font-bold text-amber-900 block">Customer Account Policy</span>
                        <span className="text-[10px] text-stone-600">Customers must create account before ordering</span>
                      </div>

                      <button
                        onClick={() => {
                          setActiveTab('auth');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full px-4 py-2.5 text-left hover:bg-pink-50 flex items-center gap-2 text-[#5B0F2A] font-bold cursor-pointer"
                      >
                        <User className="w-4 h-4 text-[#5B0F2A]" />
                        <span>1. Create New Account</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('auth');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-stone-50 flex items-center gap-2 text-stone-700 font-semibold cursor-pointer"
                      >
                        <span>2. Log In to Existing Account</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('my-orders');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-stone-50 flex items-center gap-2 text-stone-800 font-semibold cursor-pointer border-t border-stone-100"
                      >
                        <ShoppingBag className="w-4 h-4 text-[#5B0F2A]" />
                        <span>Track My Order</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('owner-portal');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-stone-50 flex items-center gap-2 text-stone-800 font-semibold cursor-pointer border-t border-stone-100"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        <span>Owner Portal (All Orders)</span>
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="w-full px-4 py-2 text-left hover:bg-stone-50 flex items-center gap-2 text-stone-600 cursor-pointer border-t border-stone-100"
                  >
                    <Ruler className="w-4 h-4 text-stone-400" />
                    <span>Size Guide (50" to 60")</span>
                  </button>
                </div>
              )}
            </div>

            {/* 2. Help Dropdown */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setHelpDropdownOpen(!helpDropdownOpen)}
                className="flex items-center gap-1.5 p-1.5 text-stone-700 hover:text-[#5B0F2A] transition-colors cursor-pointer rounded-xs"
              >
                <HelpCircle className="w-5 h-5 text-stone-700" />
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-[10px] text-stone-400 leading-none">Need</span>
                  <span className="text-xs font-bold text-stone-800 flex items-center gap-0.5 leading-tight">
                    Help <ChevronDown className="w-3 h-3 text-stone-500" />
                  </span>
                </div>
              </button>

              {helpDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-52 bg-white border border-stone-200 rounded-sm shadow-lg py-2 z-50 text-xs"
                  onClick={() => setHelpDropdownOpen(false)}
                >
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="w-full px-4 py-2 text-left hover:bg-stone-50 text-stone-800 cursor-pointer"
                  >
                    Sizing & Length Chart
                  </button>
                  <button
                    onClick={() => setIsFlyerModalOpen(true)}
                    className="w-full px-4 py-2 text-left hover:bg-stone-50 text-stone-800 cursor-pointer"
                  >
                    Official Atelier Flyer
                  </button>
                  <a
                    href={`mailto:${SHOP_TARGET_EMAIL}`}
                    className="block w-full px-4 py-2 text-left hover:bg-stone-50 text-stone-800 cursor-pointer"
                  >
                    Email Support
                  </a>
                </div>
              )}
            </div>

            {/* 3. Jumia Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-2 p-2 hover:bg-stone-50 rounded-xs transition-colors cursor-pointer relative"
              aria-label="View Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-6 h-6 text-[#5B0F2A]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#E02A3B] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-stone-800 hidden sm:inline">
                Cart
              </span>
            </button>

          </div>

        </div>

        {/* Mobile search bar */}
        <form onSubmit={handleNavSearch} className="mt-2.5 flex md:hidden items-center border border-stone-300 rounded-sm overflow-hidden bg-white">
          <input
            type="text"
            value={navSearchQuery}
            onChange={(e) => setNavSearchQuery(e.target.value)}
            placeholder="Search dresses, abayas, sizes..."
            className="w-full py-2 px-3 text-xs focus:outline-none"
          />
          <button type="submit" className="px-4 py-2 bg-[#5B0F2A] text-white text-xs font-bold shrink-0">
            Search
          </button>
        </form>

      </div>

      {/* 3. Jumia Category Navigation Ribbon (Sub-Bar) */}
      <nav className="hidden lg:block bg-stone-50 border-t border-stone-200/90 text-xs text-stone-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          <div className="flex items-center gap-1 font-medium">
            <button
              onClick={() => setIsCategoriesModalOpen(true)}
              className="py-2 px-3 text-[#5B0F2A] hover:bg-pink-50 font-bold transition-colors cursor-pointer flex items-center gap-1.5 border-r border-stone-200 mr-1"
            >
              <span className="font-mono text-sm font-black">≡</span>
              <span>All Categories</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`py-2 px-3 hover:text-[#5B0F2A] hover:bg-stone-100 transition-colors cursor-pointer ${
                activeTab === 'home' ? 'text-[#5B0F2A] font-bold bg-stone-100' : ''
              }`}
            >
              Home
            </button>

            <button
              onClick={() => {
                selectCategory('All');
              }}
              className="py-2 px-3 hover:text-[#5B0F2A] hover:bg-stone-100 transition-colors cursor-pointer flex items-center gap-1 text-[#E02A3B] font-bold"
            >
              <Flame className="w-3.5 h-3.5 fill-[#E02A3B]" />
              <span>Flash Deals</span>
            </button>

            <button
              onClick={() => navigateToCategory('Straight Abayas & Dresses')}
              className={`py-2 px-3 hover:text-[#5B0F2A] hover:bg-stone-100 transition-colors cursor-pointer ${
                activeTab === 'shop' && filters.category === 'Straight Abayas & Dresses' ? 'text-[#5B0F2A] font-bold bg-pink-50' : ''
              }`}
            >
              Straight Abayas
            </button>

            <button
              onClick={() => navigateToCategory('Gathered Abayas')}
              className={`py-2 px-3 hover:text-[#5B0F2A] hover:bg-stone-100 transition-colors cursor-pointer ${
                activeTab === 'shop' && filters.category === 'Gathered Abayas' ? 'text-[#5B0F2A] font-bold bg-pink-50' : ''
              }`}
            >
              Gathered Boubous
            </button>

            <button
              onClick={() => navigateToCategory('Pleated Abayas')}
              className={`py-2 px-3 hover:text-[#5B0F2A] hover:bg-stone-100 transition-colors cursor-pointer ${
                activeTab === 'shop' && filters.category === 'Pleated Abayas' ? 'text-[#5B0F2A] font-bold bg-pink-50' : ''
              }`}
            >
              Pleated Luxury
            </button>

            <button
              onClick={() => navigateToCategory('Capelet & Two-Piece Sets')}
              className={`py-2 px-3 hover:text-[#5B0F2A] hover:bg-stone-100 transition-colors cursor-pointer ${
                activeTab === 'shop' && filters.category === 'Capelet & Two-Piece Sets' ? 'text-[#5B0F2A] font-bold bg-pink-50' : ''
              }`}
            >
              Capelet Sets
            </button>

            <button
              onClick={() => navigateToCategory('Abayas')}
              className={`py-2 px-3 hover:text-[#5B0F2A] hover:bg-stone-100 transition-colors cursor-pointer ${
                activeTab === 'shop' && filters.category === 'Abayas' ? 'text-[#5B0F2A] font-bold bg-pink-50' : ''
              }`}
            >
              Classic & Coat
            </button>

            <button
              onClick={() => selectCategory('All')}
              className="py-2 px-3 hover:text-[#5B0F2A] hover:bg-stone-100 transition-colors cursor-pointer"
            >
              All Dresses (26+)
            </button>

            <button
              onClick={() => {
                setActiveTab('story');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="py-2 px-3 hover:text-[#5B0F2A] hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Atelier Story
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveTab('my-orders');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="py-1 px-2.5 bg-pink-50 hover:bg-pink-100 text-[#5B0F2A] border border-pink-200 rounded-xs font-semibold cursor-pointer transition-colors"
            >
              My Orders
            </button>

            <button
              onClick={() => {
                setActiveTab('owner-portal');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="py-1 px-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xs font-semibold cursor-pointer transition-colors"
            >
              Owner Portal
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 py-3 px-4 bg-white space-y-2 text-xs shadow-md">
          <div className="p-2.5 bg-pink-50 border border-pink-200 rounded-xs text-xs space-y-1">
            <span className="font-bold text-[#5B0F2A] block">Al-Ikhlas Fashion Center</span>
            <p className="text-[10px] text-stone-600">Oforikrom, Accra Town Behind Central Mosque, Kumasi</p>
            <p className="text-[10px] text-[#5B0F2A] font-semibold">
              Official Email: {SHOP_TARGET_EMAIL}
            </p>
          </div>

          <button
            onClick={() => {
              setIsCategoriesModalOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-2.5 bg-pink-100/70 border border-pink-200 text-[#5B0F2A] font-bold flex items-center justify-between rounded-xs cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <span className="font-mono text-base font-black">≡</span>
              <span>Browse All Categories</span>
            </span>
            <span className="text-[10px] bg-[#5B0F2A] text-white px-2 py-0.5 rounded-full">
              Explore
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('home');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 font-semibold text-stone-800"
          >
            Home
          </button>

          <button
            onClick={() => {
              selectCategory('All');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-[#E02A3B] font-bold"
          >
            ⚡ Flash Deals
          </button>

          <button
            onClick={() => navigateToCategory('Straight Abayas & Dresses')}
            className="block w-full text-left py-2 text-stone-700"
          >
            👗 Straight Abayas
          </button>

          <button
            onClick={() => navigateToCategory('Gathered Abayas')}
            className="block w-full text-left py-2 text-stone-700"
          >
            🌸 Gathered Boubous
          </button>

          <button
            onClick={() => navigateToCategory('Pleated Abayas')}
            className="block w-full text-left py-2 text-stone-700"
          >
            ✨ Pleated Luxury
          </button>

          <button
            onClick={() => navigateToCategory('Capelet & Two-Piece Sets')}
            className="block w-full text-left py-2 text-stone-700"
          >
            👑 Capelet Sets
          </button>

          <button
            onClick={() => navigateToCategory('Abayas')}
            className="block w-full text-left py-2 text-stone-700"
          >
            🧥 Classic & Coat
          </button>

          {/* Auth & Account Mobile Actions */}
          <div className="pt-2 border-t border-stone-100 space-y-1.5">
            {currentUser ? (
              <div className="p-2 bg-stone-50 rounded flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#5B0F2A] block">{currentUser.fullName}</span>
                  <span className="text-[10px] text-stone-500">{currentUser.email}</span>
                </div>
                <button
                  onClick={() => {
                    logoutUser();
                    setMobileMenuOpen(false);
                  }}
                  className="text-[11px] text-rose-600 font-bold hover:underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setActiveTab('auth');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 px-3 bg-[#5B0F2A] hover:bg-[#43091D] text-white text-center font-bold rounded-xs cursor-pointer"
                >
                  Create Account
                </button>
                <button
                  onClick={() => {
                    setActiveTab('auth');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-center font-bold rounded-xs cursor-pointer border border-stone-200"
                >
                  Log In
                </button>
              </div>
            )}

            <div className="p-2 bg-amber-50 rounded border border-amber-200 flex items-center justify-between text-[11px]">
              <span className="text-stone-700">MoMo Payment Number:</span>
              <strong className="font-mono text-stone-900 bg-amber-200 px-1.5 py-0.5 rounded font-black">0541376807</strong>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-100 flex gap-2">
            <button
              onClick={() => {
                setActiveTab('my-orders');
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 bg-[#5B0F2A] text-white text-center font-bold rounded-xs"
            >
              My Orders
            </button>
            <button
              onClick={() => {
                setActiveTab('owner-portal');
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 bg-stone-800 text-white text-center font-bold rounded-xs"
            >
              Owner Portal
            </button>
          </div>
        </div>
      )}

    </header>
  );
};
