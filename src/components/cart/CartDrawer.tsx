import React from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, MapPin, Scissors, Send, Mail, MessageSquare } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ColorizedDressImage } from '../shop/ColorizedDressImage';
import { SHOP_TARGET_EMAIL } from '../../utils/sendWhatsAppOrder';

import { getProductPricing, formatGHS } from '../../utils/productPricing';
import { OFFICIAL_MOMO_NUMBER } from '../../context/ShopContext';

export const CartDrawer: React.FC = () => {
  const { 
    isCartDrawerOpen, 
    setIsCartDrawerOpen, 
    cart, 
    products,
    currentUser,
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    setActiveTab, 
    openInquiryModal 
  } = useShop();

  if (!isCartDrawerOpen) return null;

  const totalCartGhs = cart.reduce((sum, item) => {
    const matchingProduct = products.find(p => p.id === item.productId);
    const priceInfo = matchingProduct ? getProductPricing(matchingProduct) : { price: 450 };
    return sum + (priceInfo.price * item.quantity);
  }, 0);

  const handleProceedToGhanaCheckout = () => {
    setIsCartDrawerOpen(false);
    setActiveTab('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10">
        
        {/* Top Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-[#5B0F2A] text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-300" />
            <h3 className="font-serif-brand text-lg font-bold">Selected Dresses</h3>
            <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-mono">
              {cart.length}
            </span>
          </div>

          <button 
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1 text-white hover:text-amber-200 transition-colors cursor-pointer"
            aria-label="Close Bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Location banner */}
        <div className="p-3 bg-pink-50 border-b border-pink-200 text-xs text-[#5B0F2A] flex items-center justify-between">
          <span className="flex items-center gap-1 font-semibold truncate">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Oforikrom, Behind Central Mosque, Kumasi</span>
          </span>
          <span className="font-mono text-[11px] font-bold text-stone-700">
            {SHOP_TARGET_EMAIL}
          </span>
        </div>

        {/* Itemized List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-stone-100">
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <Scissors className="w-12 h-12 text-stone-300 mx-auto stroke-1" />
              <div className="font-serif-brand text-xl text-stone-800 font-bold">No dresses selected yet</div>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Explore our modest dress collection, choose your length and color, and order your custom tailored piece.
              </p>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setActiveTab('shop');
                }}
                className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 bg-[#5B0F2A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#43091D] cursor-pointer rounded"
              >
                <span>Browse All Dresses</span>
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                {/* Thumbnail with ColorizedDressImage */}
                <div className="w-20 aspect-[3/4] bg-stone-100 border border-stone-200 overflow-hidden shrink-0 relative">
                  <ColorizedDressImage
                    baseImage={item.image}
                    color={item.color}
                    alt={`${item.name} in ${item.color.name}`}
                    showBadge={false}
                    className="w-full h-full object-cover object-top"
                    containerClassName="w-full h-full relative"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif-brand text-sm text-stone-900 line-clamp-1 font-bold">
                      {item.name}
                    </h4>

                    {/* Variant specs */}
                    <div className="text-[11px] text-stone-600 mt-1 space-y-0.5">
                      <p>Length: <strong className="text-[#5B0F2A] font-bold">{item.size}</strong></p>
                      <p className="flex items-center gap-1.5">
                        <span>Color:</span>
                        <span className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0" style={{ backgroundColor: item.color.hex }} />
                        <strong className="text-stone-800 font-medium">{item.color.name}</strong>
                      </p>
                      {item.customNotes && (
                        <p className="italic text-stone-500 text-[10px] line-clamp-1">
                          Note: "{item.customNotes}"
                        </p>
                      )}
                    </div>

                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#5B0F2A]">
                        Price on Request
                      </span>

                      <button
                        onClick={() => {
                          setIsCartDrawerOpen(false);
                          openInquiryModal(undefined, item.color, item.size, 'buy');
                        }}
                        className="inline-flex items-center gap-1 text-[11px] text-[#5B0F2A] hover:underline font-semibold cursor-pointer"
                        title="Buy this dress individually"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Order Single Item</span>
                      </button>
                    </div>
                  </div>

                  {/* Quantity and Remove */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-stone-200">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-semibold tabular-nums">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-stone-200 pb-2">
              <span className="text-stone-600 font-semibold">Total Garments:</span>
              <span className="font-mono text-base font-black text-[#5B0F2A]">{formatGHS(totalCartGhs)}</span>
            </div>

            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-[11px] text-stone-700 space-y-1">
              <div className="flex items-center justify-between font-bold text-stone-900">
                <span>Payment via Mobile Money:</span>
                <span className="font-mono text-[#5B0F2A] font-black">{OFFICIAL_MOMO_NUMBER}</span>
              </div>
              <p className="text-[10px] text-stone-500">
                {!currentUser 
                  ? '⚠️ Policy: New customers must create an account before sending orders.' 
                  : `✓ Logged in as ${currentUser.fullName}`}
              </p>
            </div>

            <div className="space-y-2">
              {/* Proceed to Full Ghana Checkout Form */}
              <button
                onClick={handleProceedToGhanaCheckout}
                className="w-full py-3.5 bg-[#5B0F2A] hover:bg-[#43091D] text-white font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
              >
                <span>Proceed to MoMo Checkout ({formatGHS(totalCartGhs)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
              <button
                onClick={clearCart}
                className="hover:text-stone-700 underline cursor-pointer"
              >
                Clear all
              </button>
              <span>Oforikrom, Kumasi</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
