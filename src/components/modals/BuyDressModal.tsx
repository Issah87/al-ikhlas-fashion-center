import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShoppingBag, 
  Scissors, 
  Check, 
  Mail, 
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Smartphone,
  Copy,
  Lock,
  User,
  AlertCircle
} from 'lucide-react';
import { useShop, OFFICIAL_MOMO_NUMBER, OFFICIAL_MOMO_NAME } from '../../context/ShopContext';
import { ProductColor, AbayaLength, OrderCustomer, CartItem } from '../../types';
import { GHANA_REGIONS } from '../../data/mockProducts';
import { getProductPricing, formatGHS } from '../../utils/productPricing';
import { 
  openEmailOrder, 
  SHOP_TARGET_EMAIL 
} from '../../utils/sendWhatsAppOrder';
import { ColorizedDressImage } from '../shop/ColorizedDressImage';

export const BuyDressModal: React.FC = () => {
  const { 
    isInquiryModalOpen, 
    setIsInquiryModalOpen, 
    selectedInquiryProduct, 
    selectedInquiryColor, 
    selectedInquiryLength, 
    createOrder,
    currentUser,
    setIsAuthModalOpen,
    setAuthNoticeMessage,
    addToCart,
    setCurrentCustomerEmail,
    setActiveTab,
  } = useShop();

  const [clientName, setClientName] = useState(currentUser?.fullName || '');
  const [clientEmail, setClientEmail] = useState(currentUser?.email || '');
  const [clientPhone, setClientPhone] = useState(currentUser?.phone || '');
  const [region, setRegion] = useState(currentUser?.region || GHANA_REGIONS[0]);
  const [townCity, setTownCity] = useState(currentUser?.townCity || 'Oforikrom, Kumasi');
  const [landmarkAddress, setLandmarkAddress] = useState(currentUser?.landmarkAddress || '');
  const [abayaLength, setAbayaLength] = useState<AbayaLength>(selectedInquiryLength || '54"');
  const [chosenColor, setChosenColor] = useState<ProductColor | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customMeasurements, setCustomMeasurements] = useState('');
  
  // Mobile Money fields
  const [momoNetwork, setMomoNetwork] = useState<'MTN Mobile Money' | 'Telecel Cash' | 'AT Money'>('MTN Mobile Money');
  const [momoSenderPhone, setMomoSenderPhone] = useState(currentUser?.phone || '');
  const [momoTransactionId, setMomoTransactionId] = useState('');
  const [momoConfirmed, setMomoConfirmed] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);

  const [submittedOrder, setSubmittedOrder] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const product = selectedInquiryProduct;
  const baseImage = product?.images[0] || '';

  const priceInfo = product ? getProductPricing(product) : { price: 450, originalPrice: 600 };
  const totalGhs = priceInfo.price * quantity;

  useEffect(() => {
    if (selectedInquiryColor) {
      setChosenColor(selectedInquiryColor);
    } else if (selectedInquiryProduct && selectedInquiryProduct.colors.length > 0) {
      setChosenColor(selectedInquiryProduct.colors[0]);
    } else {
      setChosenColor(null);
    }
  }, [selectedInquiryProduct, selectedInquiryColor]);

  useEffect(() => {
    if (selectedInquiryLength) {
      setAbayaLength(selectedInquiryLength);
    }
  }, [selectedInquiryLength]);

  useEffect(() => {
    if (currentUser) {
      setClientName(currentUser.fullName);
      setClientEmail(currentUser.email);
      setClientPhone(currentUser.phone);
      if (currentUser.region) setRegion(currentUser.region);
      if (currentUser.townCity) setTownCity(currentUser.townCity);
      if (currentUser.landmarkAddress) setLandmarkAddress(currentUser.landmarkAddress);
      if (!momoSenderPhone) setMomoSenderPhone(currentUser.phone);
    }
  }, [currentUser]);

  useEffect(() => {
    if (isInquiryModalOpen) {
      setSubmittedOrder(null);
      setErrorMsg('');
      setMomoConfirmed(false);
      setMomoTransactionId('');
    }
  }, [isInquiryModalOpen]);

  if (!isInquiryModalOpen) return null;

  const copyMomoNumber = () => {
    navigator.clipboard.writeText(OFFICIAL_MOMO_NUMBER).then(() => {
      setCopiedNumber(true);
      setTimeout(() => setCopiedNumber(false), 2000);
    });
  };

  const copyTotalAmount = () => {
    navigator.clipboard.writeText(totalGhs.toString()).then(() => {
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    });
  };

  const handleProceedToCartCheckout = () => {
    if (product) {
      const activeColor = chosenColor || product.colors[0];
      addToCart(product, abayaLength, activeColor, customMeasurements);
      setIsInquiryModalOpen(false);
      setActiveTab('checkout');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenAuth = () => {
    setAuthNoticeMessage('Please create an account or log in before ordering this dress.');
    setIsInquiryModalOpen(false);
    setActiveTab('auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmBuy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setErrorMsg('Customer must create an account or log in before submitting an order.');
      return;
    }
    if (!clientName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!clientEmail.trim() || !clientEmail.includes('@')) {
      setErrorMsg('Valid email is required so you can track your order in "My Orders".');
      return;
    }
    if (!townCity.trim()) {
      setErrorMsg('Please specify your town or city (e.g. Oforikrom, Kumasi / Madina, Accra).');
      return;
    }
    if (!momoSenderPhone.trim() || momoSenderPhone.replace(/\D/g, '').length < 9) {
      setErrorMsg('Please provide the Ghanaian Mobile Money phone number used for the payment.');
      return;
    }
    if (!momoTransactionId.trim() || momoTransactionId.trim().length < 6) {
      setErrorMsg('Payment must be done via MoMo to 0541376807 before sending order. Please enter your MoMo Transaction ID / Reference.');
      return;
    }
    if (!momoConfirmed) {
      setErrorMsg(`Please check the box confirming you transferred ${formatGHS(totalGhs)} to 0541376807.`);
      return;
    }

    const activeColor = chosenColor || (product?.colors[0] || { name: 'Signature Black', hex: '#1C1917' });

    const orderCustomer: OrderCustomer = {
      fullName: clientName.trim(),
      email: clientEmail.trim(),
      phone: clientPhone || momoSenderPhone,
      region,
      townCity: townCity.trim(),
      landmarkAddress: landmarkAddress.trim() || 'Oforikrom atelier pickup / local address',
      preferredContact: 'On-Website Portal'
    };

    const cartItem: CartItem = {
      id: `item-${Date.now()}`,
      productId: product?.id || 'prod-custom',
      name: product?.name || 'Custom Tailored Abaya Dress',
      priceText: formatGHS(priceInfo.price),
      image: baseImage,
      size: abayaLength,
      color: activeColor,
      quantity,
      customNotes: customMeasurements.trim() || undefined
    };

    const newOrder = createOrder({
      customer: orderCustomer,
      items: [cartItem],
      totalAmountGhs: totalGhs,
      paymentMethod: 'momo',
      momoNetwork,
      momoSenderPhone: momoSenderPhone.trim(),
      momoTransactionId: momoTransactionId.trim(),
      momoConfirmedBeforeSubmit: true,
      paymentStatus: 'MoMo Paid - Pending Owner Verification',
      orderStatus: 'Order Confirmed',
      notes: `Direct Dress Buy. MoMo Transfer: ${formatGHS(totalGhs)} to 0541376807. Sender MoMo: ${momoSenderPhone}. Tx ID: ${momoTransactionId}. Tailoring notes: ${customMeasurements.trim() || 'Standard tailored'}`
    });

    setCurrentCustomerEmail(clientEmail.trim());
    setSubmittedOrder(newOrder);
    setErrorMsg('');
  };

  const handleSendEmailCopy = () => {
    if (!submittedOrder) return;
    const activeColor = chosenColor || (product?.colors[0] || { name: 'Signature Black', hex: '#1C1917' });
    const subject = `Order #${submittedOrder.orderNumber}: ${product?.name || 'Dress'} - ${clientName}`;
    const body = 
      `🌟 AL-IKHLAS FASHION CENTER · DRESS ORDER #${submittedOrder.orderNumber} 🌟\n` +
      `Shop: Oforikrom, Accra Town Behind Central Mosque, Kumasi, Ghana\n` +
      `Owner Email: ${SHOP_TARGET_EMAIL}\n` +
      `Official MoMo: 0541376807\n\n` +
      `I have placed an order on the website and transferred payment to 0541376807:\n\n` +
      `👤 BUYER DETAILS:\n` +
      `• Name: ${clientName}\n` +
      `• Email: ${clientEmail}\n` +
      `• Phone: ${clientPhone || momoSenderPhone}\n` +
      `• Delivery Region: ${region}\n` +
      `• Town/City: ${townCity}\n` +
      (landmarkAddress ? `• Landmark Address: ${landmarkAddress}\n` : '') +
      `\n👗 ORDERED DRESS:\n` +
      `• Dress Name: "${product?.name || 'Custom Dress'}"\n` +
      `• Color: ${activeColor.name}\n` +
      `• Length: ${abayaLength}\n` +
      `• Quantity: ${quantity}\n` +
      `• Total Amount: ${formatGHS(totalGhs)}\n` +
      (customMeasurements ? `• Custom Tailoring / Notes: ${customMeasurements}\n` : '') +
      `\n💳 MOBILE MONEY PAYMENT DETAILS:\n` +
      `• MoMo Number Sent To: 0541376807\n` +
      `• Payer MoMo Phone: ${momoSenderPhone}\n` +
      `• Network: ${momoNetwork}\n` +
      `• Transaction ID: ${momoTransactionId}\n\n` +
      `Please verify payment on 0541376807 and begin sewing. Thank you!`;

    openEmailOrder({
      to: SHOP_TARGET_EMAIL,
      subject,
      body,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs">
      <div className="relative bg-white text-stone-900 max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 rounded-lg p-5 sm:p-7 space-y-5">
        
        {/* Close Button */}
        <button
          onClick={() => setIsInquiryModalOpen(false)}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 pr-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-pink-50 text-[#5B0F2A] border border-pink-200 text-[11px] font-bold uppercase tracking-wider">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Direct Dress Order · Mobile Money 0541376807</span>
          </div>
          <h2 className="font-serif-brand text-2xl text-stone-900 font-bold">
            Order This Dress Directly
          </h2>
          <p className="text-xs text-stone-600">
            Payment is completed via Mobile Money to <strong>{OFFICIAL_MOMO_NUMBER}</strong> before transmitting order details directly to the boutique owner.
          </p>
        </div>

        {/* Mandatory Account Gate Banner */}
        {!currentUser && !submittedOrder && (
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-lg text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-stone-900">
              <Lock className="w-4 h-4 text-amber-700" />
              <span>Customer Account Required to Order</span>
            </div>
            <p className="text-stone-600 text-[11px]">
              Customers must create an account before logging in and submitting dress orders. This allows you to track tailoring and chat with the owner.
            </p>
            <div className="pt-1 flex gap-2">
              <button
                type="button"
                onClick={handleOpenAuth}
                className="px-4 py-2 bg-[#5B0F2A] hover:bg-[#43091D] text-white font-bold text-xs uppercase tracking-wider rounded cursor-pointer transition-colors shadow-xs"
              >
                Create Account / Log In
              </button>
              <button
                type="button"
                onClick={handleProceedToCartCheckout}
                className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs rounded cursor-pointer transition-colors"
              >
                Add to Bag & Checkout
              </button>
            </div>
          </div>
        )}

        {/* SUCCESS STATE */}
        {submittedOrder ? (
          <div className="py-6 space-y-6 text-center animate-fade-in">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-[#5B0F2A] bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
                Order #{submittedOrder.orderNumber}
              </span>
              <h3 className="font-serif-brand text-2xl text-stone-900 font-bold">
                Order Sent to Atelier Owner!
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                Thank you, <strong>{clientName}</strong>! Your order and MoMo payment reference (<strong>{momoTransactionId}</strong>) have been sent to the boutique owner.
              </p>
            </div>

            {/* Order Card Preview */}
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg text-left text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="font-bold text-stone-800">{product?.name || 'Custom Abaya'}</span>
                <span className="text-[#5B0F2A] font-bold">{formatGHS(totalGhs)}</span>
              </div>
              <div className="text-stone-600 flex flex-col gap-1 text-[11px]">
                <span><strong>Color:</strong> {chosenColor?.name || 'Selected Color'} · <strong>Length:</strong> {abayaLength} · <strong>Qty:</strong> {quantity}</span>
                <span><strong>MoMo Sent To:</strong> 0541376807 · <strong>Tx ID:</strong> {momoTransactionId}</span>
                <span><strong>Delivery:</strong> {townCity}, {region}</span>
                <span><strong>Customer Email:</strong> {clientEmail}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsInquiryModalOpen(false);
                  setActiveTab('my-orders');
                }}
                className="flex-1 py-3 px-4 bg-[#5B0F2A] hover:bg-[#43091D] text-white font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>View What I Have Ordered</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleSendEmailCopy}
                className="flex-1 py-3 px-4 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Mail className="w-4 h-4 text-[#5B0F2A]" />
                <span>Send Email Copy to Owner</span>
              </button>
            </div>
          </div>
        ) : (
          /* BUY ORDER FORM */
          <form onSubmit={handleConfirmBuy} className="space-y-4">
            
            {/* Selected Product Card */}
            {product && (
              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-lg flex gap-3.5 items-center">
                <div className="w-20 h-24 rounded bg-stone-200 shrink-0 overflow-hidden relative border border-stone-300">
                  <ColorizedDressImage
                    baseImage={product.images[0]}
                    color={chosenColor || product.colors[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-[#5B0F2A] tracking-wider block">
                    {product.category}
                  </span>
                  <h4 className="font-serif-brand text-sm sm:text-base font-bold text-stone-900 truncate">
                    {product.name}
                  </h4>
                  <p className="text-xs font-mono text-[#5B0F2A] font-bold mt-0.5">
                    {formatGHS(priceInfo.price)} each
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Selected shade: <strong>{chosenColor?.name || 'Standard'}</strong>
                  </p>
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product && product.colors.length > 1 && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Select Color Shade:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      type="button"
                      key={c.name}
                      onClick={() => setChosenColor(c)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs border transition-colors cursor-pointer ${
                        chosenColor?.name === c.name
                          ? 'border-[#5B0F2A] bg-pink-50 text-[#5B0F2A] font-bold shadow-xs'
                          : 'border-stone-300 hover:border-stone-400 bg-white text-stone-700'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Length and Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Abaya Length / Dress Height:
                </label>
                <select
                  value={abayaLength}
                  onChange={(e) => setAbayaLength(e.target.value as AbayaLength)}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                >
                  <option value='50"'>50" (Petite / Height 5'0"-5'1")</option>
                  <option value='52"'>52" (Height 5'2"-5'3")</option>
                  <option value='54"'>54" (Standard / Height 5'4"-5'5")</option>
                  <option value='56"'>56" (Tall / Height 5'6"-5'7")</option>
                  <option value='58"'>58" (Extra Tall / Height 5'8"-5'9")</option>
                  <option value='60"'>60" (Floor Length)</option>
                  <option value='62"'>62" (Maxi Dramatic)</option>
                  <option value='Custom'>Custom Tailored Height</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Quantity:
                </label>
                <div className="flex items-center border border-stone-300 rounded overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center text-xs font-bold text-stone-800">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Buyer Contact Details */}
            <div className="border-t border-stone-200 pt-3 space-y-3">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#5B0F2A]" />
                  <span>Buyer Information</span>
                </span>
                {currentUser && (
                  <span className="text-[11px] font-normal text-emerald-700">
                    Logged in as {currentUser.fullName}
                  </span>
                )}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Your Full Name: <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Hajia Mariama Baako"
                    className="w-full p-2.5 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Your Email Address: <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="e.g. mariama@example.com"
                    className="w-full p-2.5 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Ghana Region:
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                  >
                    {GHANA_REGIONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Town or City: <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={townCity}
                    onChange={(e) => setTownCity(e.target.value)}
                    placeholder="e.g. Oforikrom, Kumasi or Madina, Accra"
                    className="w-full p-2.5 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">
                    Delivery Address / Landmark:
                  </label>
                  <input
                    type="text"
                    value={landmarkAddress}
                    onChange={(e) => setLandmarkAddress(e.target.value)}
                    placeholder="e.g. Near Central Mosque, Accra Town, Kumasi"
                    className="w-full p-2.5 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                  />
                </div>
              </div>

              {/* STRICT MOBILE MONEY TERMINAL */}
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-lg space-y-3">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <div className="flex items-center gap-1.5 font-bold text-stone-900 text-xs uppercase tracking-wide">
                    <Smartphone className="w-4 h-4 text-amber-700" />
                    <span>Pay via Mobile Money: 0541376807</span>
                  </div>
                  <strong className="font-mono text-base text-[#5B0F2A]">
                    {formatGHS(totalGhs)}
                  </strong>
                </div>

                <div className="bg-white p-3 rounded border border-amber-200 text-xs space-y-1 text-stone-700">
                  <div className="flex items-center justify-between">
                    <span>MoMo Number: <strong className="font-mono text-stone-950 font-bold">{OFFICIAL_MOMO_NUMBER}</strong></span>
                    <button
                      type="button"
                      onClick={copyMomoNumber}
                      className="px-2 py-0.5 bg-amber-200 hover:bg-amber-300 text-stone-900 text-[10px] font-bold rounded cursor-pointer"
                    >
                      {copiedNumber ? 'Copied!' : 'Copy 0541376807'}
                    </button>
                  </div>
                  <p>Account Name: <strong>{OFFICIAL_MOMO_NAME}</strong></p>
                  <p className="text-[11px] text-stone-500 pt-1">
                    Send <strong>{formatGHS(totalGhs)}</strong> from your phone via MoMo to 0541376807 before clicking submit.
                  </p>
                </div>

                {/* Input MoMo details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">
                      Paying Phone Number: <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={momoSenderPhone}
                      onChange={(e) => setMomoSenderPhone(e.target.value)}
                      placeholder="e.g. 0541376807"
                      className="w-full p-2 border border-stone-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">
                      MoMo Transaction ID / Reference: <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={momoTransactionId}
                      onChange={(e) => setMomoTransactionId(e.target.value)}
                      placeholder="e.g. 2948190284"
                      className="w-full p-2 border border-stone-300 rounded font-mono font-bold bg-white focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                    />
                  </div>
                </div>

                {/* Checkbox */}
                <label className="flex items-start gap-2 text-xs cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={momoConfirmed}
                    onChange={(e) => setMomoConfirmed(e.target.checked)}
                    className="mt-0.5 accent-[#5B0F2A]"
                  />
                  <span className="text-stone-800 font-medium">
                    I confirm that I sent {formatGHS(totalGhs)} to 0541376807 and entered my Transaction ID above. <span className="text-rose-500">*</span>
                  </span>
                </label>
              </div>

              {/* Custom Measurements / Tailoring Notes */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Custom Measurements / Tailoring Notes (Optional):
                </label>
                <textarea
                  rows={2}
                  value={customMeasurements}
                  onChange={(e) => setCustomMeasurements(e.target.value)}
                  placeholder="e.g. Bust 38, Sleeve length 24, prefer loose modest cut, or specific event date..."
                  className="w-full text-xs p-2.5 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 font-medium">
                {errorMsg}
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={!currentUser || !momoTransactionId.trim() || !momoSenderPhone.trim() || !momoConfirmed}
                className={`w-full py-3.5 px-4 font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                  !currentUser || !momoTransactionId.trim() || !momoSenderPhone.trim() || !momoConfirmed
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    : 'bg-[#5B0F2A] hover:bg-[#43091D] text-white'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Confirm MoMo Payment & Send Order ({formatGHS(totalGhs)})</span>
              </button>

              <button
                type="button"
                onClick={handleProceedToCartCheckout}
                className="w-full py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs rounded transition-colors cursor-pointer"
              >
                Add to Bag & Proceed to Full Checkout
              </button>
            </div>

            <p className="text-[11px] text-center text-stone-500">
              Orders are instantly transmitted to the atelier owner for MoMo verification. You can track progress anytime under <strong>My Orders</strong>.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
