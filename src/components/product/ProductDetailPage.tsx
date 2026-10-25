import React, { useState } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  MessageSquare, 
  MapPin, 
  Ruler, 
  Scissors, 
  Check, 
  ArrowLeft,
  Truck,
  Image as ImageIcon,
  Download,
  Share2,
  Mail,
  Star,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { AbayaLength, ProductColor } from '../../types';
import { ProductCard } from '../shop/ProductCard';
import { 
  openEmailOrder, 
  downloadDressPhoto, 
  shareDressPhoto,
  SHOP_TARGET_EMAIL
} from '../../utils/sendWhatsAppOrder';
import { ColorizedDressImage } from '../shop/ColorizedDressImage';
import { getProductPricing, formatGHS } from '../../utils/productPricing';

export const ProductDetailPage: React.FC = () => {
  const { 
    selectedProductSlug, 
    products, 
    addToCart, 
    wishlist, 
    toggleWishlist, 
    setIsSizeGuideOpen, 
    openInquiryModal, 
    setActiveTab,
    getAbsoluteImageUrl,
    settings
  } = useShop();

  const product = products.find(p => p.slug === selectedProductSlug) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedLength, setSelectedLength] = useState<AbayaLength>(product?.sizes[2] || '54"');
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product?.colors[0] || { name: 'As Pictured', hex: '#634832' });
  const [customMeasurementNotes, setCustomMeasurementNotes] = useState('');
  const [addedNotice, setAddedNotice] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [sharedNotice, setSharedNotice] = useState(false);
  const [activeTabSection, setActiveTabSection] = useState<'details' | 'fabric' | 'ghanaDelivery'>('details');

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif-brand text-2xl text-stone-900">Dress style not found</h2>
        <button
          onClick={() => setActiveTab('shop')}
          className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#5B0F2A] underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Our Dress Collection</span>
        </button>
      </div>
    );
  }

  const isFavorited = wishlist.includes(product.id);
  const baseImage = product.images[activeImageIndex] || product.images[0];
  const isBaseColor = selectedColor.name === product.colors[0]?.name;
  const pricing = getProductPricing(product);

  const handleAddToBag = () => {
    const success = addToCart(product, selectedLength, selectedColor, customMeasurementNotes);
    if (success) {
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2500);
    }
  };

  const handleBuyOnWebsite = () => {
    openInquiryModal(product, selectedColor, selectedLength, 'buy');
  };

  const handleSendEmailOrder = () => {
    let msg = `🌟 AL-IKHLAS FASHION CENTER · DRESS ORDER DETAILS 🌟\n` +
      `Shop: Oforikrom, Accra Town Behind Central Mosque, Kumasi\n` +
      `Owner Email: ${SHOP_TARGET_EMAIL}\n\n` +
      `Hello! I want to order this dress and am sending the specifications:\n\n` +
      `👗 Dress Style: "${product.name}"\n` +
      `🎨 Selected Color: ${selectedColor.name}\n` +
      `📏 Selected Length: ${selectedLength}\n` +
      `🏷️ Category: ${product.category}\n`;
    if (customMeasurementNotes.trim()) {
      msg += `📝 Tailoring / Measurement Notes: ${customMeasurementNotes.trim()}\n`;
    }
    msg += `\nPlease confirm my dress order and sewing schedule. Thank you!`;

    openEmailOrder({
      to: SHOP_TARGET_EMAIL,
      subject: `Dress Order: ${product.name} in ${selectedColor.name}`,
      body: msg,
    });
  };

  const handleDownloadPhoto = async () => {
    setDownloading(true);
    await downloadDressPhoto(baseImage, `${product.name}_${selectedColor.name}`);
    setTimeout(() => setDownloading(false), 1500);
  };

  const handleSharePhoto = async () => {
    await shareDressPhoto(baseImage, product.name, selectedColor.name);
    setSharedNotice(true);
    setTimeout(() => setSharedNotice(false), 2500);
  };

  const relatedProducts = products
    .filter(p => p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-8 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation back and breadcrumbs */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200">
          <button
            onClick={() => setActiveTab('shop')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-[#5B0F2A] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Dresses</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-stone-500">
            <span>Al-Ikhlas Fashion Center</span>
            <span>/</span>
            <span>{product.category}</span>
            <span>/</span>
            <span className="text-[#5B0F2A] font-semibold truncate max-w-[240px]">{product.name}</span>
          </div>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* LEFT: GALLERY (7 COLS ON DESKTOP) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Primary Display Image with Real-Time Color Transformation */}
            <div className="relative aspect-[3/4] bg-[#F5F2EB] overflow-hidden border border-stone-200">
              <ColorizedDressImage
                baseImage={baseImage}
                color={selectedColor}
                isBaseColor={isBaseColor}
                alt={`${product.name} in ${selectedColor.name}`}
                className="w-full h-full object-cover object-top transition-all duration-300"
                containerClassName="w-full h-full relative"
                showBadge={true}
              />

              {product.badge && (
                <div className="absolute top-4 left-4 z-20">
                  <span className="text-xs font-bold tracking-wider uppercase text-[#5B0F2A] bg-white/95 backdrop-blur-sm px-3 py-1 border border-pink-200 shadow-xs">
                    {product.badge}
                  </span>
                </div>
              )}

              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-4 right-4 z-20 p-2.5 bg-white/90 hover:bg-white text-stone-800 rounded-full shadow-sm transition-colors cursor-pointer"
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            {/* Separate Photo Actions: Download & Share */}
            <div className="flex items-center justify-between gap-3 p-3 bg-white border border-stone-200 rounded">
              <div className="flex items-center gap-2 text-xs text-stone-700 font-medium">
                <ImageIcon className="w-4 h-4 text-[#5B0F2A]" />
                <span>Dress Photography</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPhoto}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded border border-stone-300 transition-colors cursor-pointer"
                  title="Download photo separately"
                >
                  <Download className="w-3.5 h-3.5 text-[#5B0F2A]" />
                  <span>{downloading ? 'Saving...' : 'Download Photo'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSharePhoto}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded border border-stone-300 transition-colors cursor-pointer"
                  title="Share photo separately"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#5B0F2A]" />
                  <span>{sharedNotice ? 'Link Shared!' : 'Share Photo'}</span>
                </button>
              </div>
            </div>

            {/* Thumbnail Strip if multiple images */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto py-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 aspect-[3/4] bg-stone-100 overflow-hidden border transition-all cursor-pointer ${
                      activeImageIndex === idx ? 'border-[#5B0F2A] ring-1 ring-[#5B0F2A]' : 'border-stone-200 hover:border-stone-400 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${idx + 1}`} 
                      referrerPolicy="no-referrer" 
                      className="w-full h-full object-cover object-top" 
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Ghana shop assurance box */}
            <div className="p-4 bg-white border border-stone-200 rounded text-xs space-y-2">
              <div className="flex items-center gap-2 text-[#5B0F2A] font-bold">
                <MapPin className="w-4 h-4 text-[#5B0F2A]" />
                <span>Visit our Physical Workshop in Oforikrom, Kumasi</span>
              </div>
              <p className="text-stone-600">
                Located at Accra Town Behind the Central Mosque. You can visit in person for accurate tape measurement, custom fabric inspection, and trial fittings!
              </p>
            </div>
          </div>

          {/* RIGHT: CONTIGUOUS INQUIRY & SEWING MODULE (5 COLS ON DESKTOP) */}
          <div className="lg:col-span-5 flex flex-col justify-start space-y-5">
            
            {/* Header info */}
            <div>
              <div className="text-[11px] font-bold tracking-wider uppercase text-stone-500 mb-1">
                {product.category} · Made in Ghana
              </div>
              <h1 className="font-serif-brand text-2xl sm:text-3xl text-stone-900 leading-tight font-bold">
                {product.name}
              </h1>

              {/* Jumia Pricing Presentation */}
              <div className="mt-3 p-3.5 bg-stone-50 border border-stone-200 rounded-sm">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl font-black text-stone-900">
                    {formatGHS(pricing.price)}
                  </span>
                  <span className="text-sm text-stone-400 line-through">
                    {formatGHS(pricing.originalPrice)}
                  </span>
                  <span className="bg-[#E02A3B] text-white text-xs font-black px-2 py-0.5 rounded-xs shadow-2xs">
                    -{pricing.discountPercent}%
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-stone-600">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold ml-1 text-stone-800">{pricing.rating}</span>
                  </div>
                  <span>·</span>
                  <span>{pricing.reviewCount} customer reviews</span>
                  <span>·</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Official Atelier (Oforikrom)
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              {product.description}
            </p>

            {/* Color Swatch Selection */}
            <div className="space-y-2 pt-2 border-t border-stone-200">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-stone-900">
                  Selected Shade: <strong className="font-bold text-[#5B0F2A]">{selectedColor.name}</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    className={`relative p-1 rounded-full border transition-all cursor-pointer ${
                      selectedColor.name === c.name
                        ? 'border-[#5B0F2A] ring-2 ring-[#5B0F2A] ring-offset-2'
                        : 'border-transparent hover:border-stone-400'
                    }`}
                    title={c.name}
                  >
                    <span 
                      className="block w-6 h-6 rounded-full border border-stone-300 shadow-2xs"
                      style={{
                        background: c.secondaryHex
                          ? `linear-gradient(135deg, ${c.hex} 50%, ${c.secondaryHex} 50%)`
                          : c.hex,
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Abaya Length Selection (50" to 60" or Custom) */}
            <div className="space-y-2 pt-2 border-t border-stone-200">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-stone-900">
                  Select Length: <strong className="font-bold text-[#5B0F2A]">{selectedLength}</strong>
                </span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="inline-flex items-center gap-1 text-[#5B0F2A] hover:underline cursor-pointer font-medium"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Length & Height Guide</span>
                </button>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedLength(sz)}
                    className={`py-2 text-xs font-semibold border text-center transition-all cursor-pointer ${
                      selectedLength === sz
                        ? 'bg-[#5B0F2A] text-white border-[#5B0F2A]'
                        : 'bg-white text-stone-800 border-stone-300 hover:border-[#5B0F2A]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Dress & Color Summary Box */}
            <div className="p-3.5 bg-pink-50/70 border border-pink-200 rounded text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-stone-600 font-medium">Selected Dress:</span>
                <span className="font-bold text-stone-900">{product.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-600 font-medium">Selected Color / Fabric:</span>
                <span className="font-bold text-[#5B0F2A] inline-flex items-center gap-1.5">
                  <span 
                    className="w-3 h-3 rounded-full border border-black/20 shrink-0" 
                    style={{ 
                      background: selectedColor.secondaryHex 
                        ? `linear-gradient(135deg, ${selectedColor.hex} 50%, ${selectedColor.secondaryHex} 50%)`
                        : selectedColor.hex 
                    }} 
                  />
                  {selectedColor.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-600 font-medium">Selected Length:</span>
                <span className="font-bold text-stone-900">{selectedLength}</span>
              </div>
            </div>

            {/* Custom Notes / Measurements Input */}
            <div className="space-y-1.5 pt-2 border-t border-stone-200 text-xs">
              <label className="block font-medium text-stone-800">
                Custom Measurements or Tailoring Notes (Optional):
              </label>
              <textarea
                rows={2}
                value={customMeasurementNotes}
                onChange={(e) => setCustomMeasurementNotes(e.target.value)}
                placeholder="e.g. Height 5'4, bust 38, want loose fit with extra length for heels, or delivery to Madina/Accra."
                className="w-full p-2.5 text-xs border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
              />
            </div>

            {/* Actions: Buy Now & Order Buttons */}
            <div className="pt-2 space-y-2.5">
              {/* Primary On-Website Buy Button */}
              <button
                onClick={handleBuyOnWebsite}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#5B0F2A] hover:bg-[#43091D] text-white font-bold text-xs uppercase tracking-wider rounded transition-colors shadow-sm cursor-pointer"
                title={`Buy ${product.name} in ${selectedColor.name} directly and send details to owner`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Buy / Order This Dress & Send Details to Owner</span>
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Save to Bag button */}
                <button
                  onClick={handleAddToBag}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs uppercase tracking-wider rounded transition-colors cursor-pointer shadow-xs"
                >
                  {addedNotice ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                {/* Direct Email Order */}
                <button
                  onClick={handleSendEmailOrder}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-bold text-xs uppercase tracking-wider rounded transition-colors cursor-pointer shadow-xs"
                >
                  <Mail className="w-3.5 h-3.5 text-[#5B0F2A]" />
                  <span>Send Order via Email</span>
                </button>
              </div>

              {/* Custom Measurements & Sizing */}
              <button
                onClick={() => openInquiryModal(product, selectedColor, selectedLength, 'buy')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-[#5B0F2A] text-[#5B0F2A] hover:bg-pink-50 font-bold text-xs uppercase tracking-wider rounded transition-colors cursor-pointer"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>Order with Custom Measurements / Tailoring</span>
              </button>

              {/* Jumia Delivery & Guarantee Info Card */}
              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xs text-xs space-y-2">
                <div className="flex items-start gap-2.5">
                  <Truck className="w-4 h-4 text-[#5B0F2A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-900 block">Nationwide Delivery across Ghana</span>
                    <span className="text-[11px] text-stone-500">Bus dispatch to Accra, Kumasi, Tamale, Takoradi & all 16 regions (2-4 days)</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pt-1 border-t border-stone-200/60">
                  <Smartphone className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-900 block">MoMo & Cash on Delivery Accepted</span>
                    <span className="text-[11px] text-stone-500">Pay securely via MTN Mobile Money, Telecel Cash, AT Money or on delivery</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pt-1 border-t border-stone-200/60">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-900 block">Hand-Tailored Guarantee</span>
                    <span className="text-[11px] text-stone-500">Atelier in Oforikrom, Accra Town Behind Central Mosque · Email: {SHOP_TARGET_EMAIL}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Accordion Tabs */}
            <div className="pt-4 border-t border-stone-200">
              <div className="flex border-b border-stone-200 text-xs font-semibold">
                <button
                  onClick={() => setActiveTabSection('details')}
                  className={`pb-2.5 px-3 transition-colors cursor-pointer ${
                    activeTabSection === 'details'
                      ? 'border-b-2 border-[#5B0F2A] text-[#5B0F2A]'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  Dress Specifications
                </button>
                <button
                  onClick={() => setActiveTabSection('fabric')}
                  className={`pb-2.5 px-3 transition-colors cursor-pointer ${
                    activeTabSection === 'fabric'
                      ? 'border-b-2 border-[#5B0F2A] text-[#5B0F2A]'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  Fabric & Care
                </button>
                <button
                  onClick={() => setActiveTabSection('ghanaDelivery')}
                  className={`pb-2.5 px-3 transition-colors cursor-pointer ${
                    activeTabSection === 'ghanaDelivery'
                      ? 'border-b-2 border-[#5B0F2A] text-[#5B0F2A]'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  Ghana Delivery & Pickup
                </button>
              </div>

              <div className="py-4 text-xs text-stone-600 leading-relaxed">
                {activeTabSection === 'details' && (
                  <ul className="space-y-1.5 list-disc list-inside">
                    {product.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                )}
                {activeTabSection === 'fabric' && (
                  <ul className="space-y-1.5 list-disc list-inside">
                    {product.fabricCare.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                )}
                {activeTabSection === 'ghanaDelivery' && (
                  <div className="space-y-2">
                    <p>• <strong>Pickup:</strong> Free in-store pickup at Oforikrom, Accra Town Behind Central Mosque.</p>
                    <p>• <strong>Kumasi & Accra:</strong> Doorstep dispatch courier within 24–48 hours upon sewing completion.</p>
                    <p>• <strong>All Other Ghana Regions:</strong> Fast parcel delivery via VIP, STC, OA, and state buses.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* RELATED PIECES */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-stone-200">
            <h3 className="font-serif-brand text-2xl text-stone-900 font-bold mb-8">
              Explore Our Other Dress Designs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
