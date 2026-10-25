import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './components/home/HomePage';
import { ShopPage } from './components/shop/ShopPage';
import { ProductDetailPage } from './components/product/ProductDetailPage';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { OrderSuccessView } from './components/order/OrderSuccessView';
import { AtelierStoryPage } from './components/story/AtelierStoryPage';
import { MyOrdersPage } from './components/orders/MyOrdersPage';
import { OwnerPortalPage } from './components/owner/OwnerPortalPage';
import { AuthPage } from './components/auth/AuthPage';
import { CartDrawer } from './components/cart/CartDrawer';
import { WebsiteInquiryModal } from './components/modals/WebsiteInquiryModal';
import { SizeGuideModal } from './components/modals/SizeGuideModal';
import { FlyerModal } from './components/modals/FlyerModal';
import { CategoriesModal } from './components/modals/CategoriesModal';

const AppContent: React.FC = () => {
  const { activeTab, isAuthModalOpen, setIsAuthModalOpen } = useShop();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-stone-900 selection:bg-pink-100 selection:text-[#5B0F2A]">
      {/* Top Announcements with Ghana location & direct email */}
      <AnnouncementBar />

      {/* Navigation Top Bar */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'shop' && <ShopPage />}
        {activeTab === 'product-detail' && <ProductDetailPage />}
        {activeTab === 'checkout' && <CheckoutPage />}
        {activeTab === 'order-success' && <OrderSuccessView />}
        {activeTab === 'story' && <AtelierStoryPage />}
        {activeTab === 'my-orders' && <MyOrdersPage />}
        {activeTab === 'owner-portal' && <OwnerPortalPage />}
        {activeTab === 'auth' && <AuthPage />}
      </main>

      {/* Footer with flyer details, Oforikrom address & email */}
      <Footer />

      {/* Auth Modal Overlay when isAuthModalOpen is true */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute right-4 top-4 z-10 p-2 text-stone-400 hover:text-stone-700 bg-white/80 rounded-full shadow-sm cursor-pointer"
            >
              ✕
            </button>
            <AuthPage isModal onSuccess={() => setIsAuthModalOpen(false)} />
          </div>
        </div>
      )}

      {/* Modals & Drawers */}
      <CartDrawer />
      <WebsiteInquiryModal />
      <SizeGuideModal />
      <FlyerModal />
      <CategoriesModal />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
