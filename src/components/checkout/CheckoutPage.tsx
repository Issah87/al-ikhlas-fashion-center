import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Scissors, 
  CheckCircle2, 
  Send, 
  Mail, 
  ShoppingBag,
  ShieldCheck,
  Smartphone,
  Copy,
  Check,
  AlertCircle,
  Lock,
  User,
  Phone,
  HelpCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useShop, OFFICIAL_MOMO_NUMBER, OFFICIAL_MOMO_NAME } from '../../context/ShopContext';
import { OrderCustomer, PaymentMethod } from '../../types';
import { GHANA_REGIONS } from '../../data/mockProducts';
import { ColorizedDressImage } from '../shop/ColorizedDressImage';
import { getProductPricing, formatGHS } from '../../utils/productPricing';
import { 
  openEmailOrder, 
  formatBookingSummary, 
  SHOP_TARGET_EMAIL
} from '../../utils/sendWhatsAppOrder';

export const CheckoutPage: React.FC = () => {
  const { 
    cart, 
    products,
    createOrder, 
    setActiveTab, 
    currentUser,
    registerUser,
    loginUser,
    logoutUser,
    currentCustomerEmail,
    setCurrentCustomerEmail 
  } = useShop();

  // Authentication sub-tab if user is not logged in: 'register' | 'login'
  const [authSubMode, setAuthSubMode] = useState<'register' | 'login'>('register');
  const [authFeedback, setAuthFeedback] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [showAuthPassword, setShowAuthPassword] = useState(false);

  // Auth fields
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRegion, setRegRegion] = useState(GHANA_REGIONS[0]);
  const [regTown, setRegTown] = useState('Oforikrom, Kumasi');
  const [regAddress, setRegAddress] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Customer form fields (auto-populated once user is logged in)
  const [customer, setCustomer] = useState<OrderCustomer>({
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || currentCustomerEmail || '',
    phone: currentUser?.phone || '',
    region: currentUser?.region || GHANA_REGIONS[0],
    townCity: currentUser?.townCity || 'Oforikrom, Kumasi',
    landmarkAddress: currentUser?.landmarkAddress || '',
    preferredContact: 'On-Website Portal',
  });

  // Keep customer form synced whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      setCustomer(prev => ({
        ...prev,
        fullName: currentUser.fullName || prev.fullName,
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone,
        region: currentUser.region || prev.region,
        townCity: currentUser.townCity || prev.townCity,
        landmarkAddress: currentUser.landmarkAddress || prev.landmarkAddress,
      }));
    }
  }, [currentUser]);

  const [deliveryType, setDeliveryType] = useState<'pickup' | 'dispatch' | 'bus'>('pickup');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mobile Money (MoMo) state - strictly required payment method
  const [momoNetwork, setMomoNetwork] = useState<'MTN Mobile Money' | 'Telecel Cash' | 'AT Money'>('MTN Mobile Money');
  const [momoSenderPhone, setMomoSenderPhone] = useState(currentUser?.phone || '');
  const [momoTransactionId, setMomoTransactionId] = useState('');
  const [momoConfirmed, setMomoConfirmed] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);

  // Keep sender phone aligned with user phone if empty
  useEffect(() => {
    if (currentUser?.phone && !momoSenderPhone) {
      setMomoSenderPhone(currentUser.phone);
    }
  }, [currentUser, momoSenderPhone]);

  // Calculate cart pricing in Ghana Cedis
  const cartWithPricing = cart.map(item => {
    const matchingProduct = products.find(p => p.id === item.productId);
    const priceInfo = matchingProduct ? getProductPricing(matchingProduct) : { price: 450, originalPrice: 600 };
    return {
      ...item,
      unitPrice: priceInfo.price,
      totalPrice: priceInfo.price * item.quantity,
    };
  });

  const subtotalGhs = cartWithPricing.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFeeGhs = deliveryType === 'pickup' ? 0 : (deliveryType === 'dispatch' ? 35 : 45);
  const totalAmountGhs = subtotalGhs + deliveryFeeGhs;

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-pink-50 text-[#5B0F2A] rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif-brand text-3xl text-stone-900 font-bold">No dresses in your bag</h2>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          Please select from our signature modest abayas, pleated maxis, and boubous to place your bespoke tailoring order.
        </p>
        <button
          onClick={() => setActiveTab('shop')}
          className="mt-4 px-6 py-2.5 bg-[#5B0F2A] hover:bg-[#43091D] text-white text-xs font-bold uppercase tracking-wider rounded cursor-pointer transition-colors shadow-xs"
        >
          Browse All Dresses
        </button>
      </div>
    );
  }

  // Handle Quick In-Place Registration
  const handleInlineRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthFeedback(null);

    if (!regName.trim()) {
      setAuthFeedback({ type: 'error', text: 'Please enter your full name.' });
      return;
    }
    if (!authEmail.trim() || !authEmail.includes('@')) {
      setAuthFeedback({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    if (!regPhone.trim() || regPhone.replace(/\D/g, '').length < 9) {
      setAuthFeedback({ type: 'error', text: 'Please enter a valid Ghana phone number (e.g. 0541376807).' });
      return;
    }
    if (!regTown.trim()) {
      setAuthFeedback({ type: 'error', text: 'Please enter your town or city (e.g. Oforikrom, Kumasi).' });
      return;
    }
    if (!authPassword || authPassword.length < 6) {
      setAuthFeedback({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }
    if (authPassword !== regConfirmPassword) {
      setAuthFeedback({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    const res = registerUser({
      fullName: regName.trim(),
      email: authEmail.trim(),
      phone: regPhone.trim(),
      region: regRegion,
      townCity: regTown.trim(),
      landmarkAddress: regAddress.trim() || undefined,
      password: authPassword,
    });

    if (res.success) {
      setAuthFeedback({ type: 'success', text: 'Account created! You are now logged in and can complete checkout.' });
    } else {
      setAuthFeedback({ type: 'error', text: res.message });
    }
  };

  // Handle Quick In-Place Login
  const handleInlineLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthFeedback(null);

    if (!authEmail.trim() || !authEmail.includes('@')) {
      setAuthFeedback({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    if (!authPassword.trim()) {
      setAuthFeedback({ type: 'error', text: 'Please enter your account password.' });
      return;
    }

    const res = loginUser(authEmail.trim(), authPassword.trim());
    if (res.success) {
      setAuthFeedback({ type: 'success', text: `Welcome back, ${res.user?.fullName}!` });
    } else {
      setAuthFeedback({ type: 'error', text: res.message });
    }
  };

  const copyMomoNumber = () => {
    navigator.clipboard.writeText(OFFICIAL_MOMO_NUMBER).then(() => {
      setCopiedNumber(true);
      setTimeout(() => setCopiedNumber(false), 2500);
    });
  };

  const copyTotalAmount = () => {
    navigator.clipboard.writeText(totalAmountGhs.toString()).then(() => {
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2500);
    });
  };

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};
    if (!currentUser) {
      errs.auth = 'Customer must create an account or log in before sending an order.';
    }
    if (!customer.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!customer.email.trim() || !customer.email.includes('@')) {
      errs.email = 'Valid email is required so only you can track what you ordered in My Orders.';
    }
    if (!customer.townCity.trim()) errs.townCity = 'Town or suburb is required (e.g. Oforikrom, Madina).';
    if (deliveryType !== 'pickup' && !customer.landmarkAddress.trim()) {
      errs.landmarkAddress = 'Landmark or delivery location address is required for rider/bus dispatch.';
    }

    // STRICT MOBILE MONEY VALIDATION
    if (!momoSenderPhone.trim() || momoSenderPhone.replace(/\D/g, '').length < 9) {
      errs.momoSenderPhone = 'Please provide the Ghanaian Mobile Money phone number used to make the payment.';
    }
    if (!momoTransactionId.trim() || momoTransactionId.trim().length < 6) {
      errs.momoTransactionId = 'Payment must be done before sending order. Please enter your MoMo Transaction ID / Reference (from your SMS receipt).';
    }
    if (!momoConfirmed) {
      errs.momoConfirmed = 'Please confirm that you have completed the Mobile Money transfer of GH₵ ' + totalAmountGhs + ' to 0541376807.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      // Scroll to top of errors
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder = createOrder({
        customer,
        items: cart,
        totalAmountGhs,
        paymentMethod: 'momo',
        momoNetwork,
        momoSenderPhone: momoSenderPhone.trim(),
        momoTransactionId: momoTransactionId.trim(),
        momoConfirmedBeforeSubmit: true,
        paymentStatus: 'MoMo Paid - Pending Owner Verification',
        orderStatus: 'Order Confirmed',
        notes: `Delivery: ${deliveryType.toUpperCase()} (${deliveryType === 'pickup' ? 'Oforikrom Workshop' : customer.landmarkAddress}). MoMo Network: ${momoNetwork}. Payer MoMo: ${momoSenderPhone}. MoMo Tx Ref: ${momoTransactionId}. Additional customer notes: ${notes || 'None'}`,
      });

      if (customer.email) {
        setCurrentCustomerEmail(customer.email);
      }

      setIsSubmitting(false);
      setActiveTab('order-success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 700);
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-10 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-stone-200">
          <button
            onClick={() => setActiveTab('shop')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#5B0F2A] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Catalog</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#5B0F2A]">
            <MapPin className="w-3.5 h-3.5 text-[#5B0F2A]" />
            <span>Al-Ikhlas Fashion Center · Oforikrom, Kumasi · MoMo: 0541376807</span>
          </div>
        </div>

        {/* STEP 0: MANDATORY ACCOUNT GATE IF NOT LOGGED IN */}
        {!currentUser && (
          <div className="mb-8 bg-white border-2 border-[#5B0F2A]/30 rounded-lg shadow-md overflow-hidden">
            <div className="bg-[#5B0F2A] text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-400 text-stone-950 font-black text-[11px] uppercase tracking-wider">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Step 1: Customer Account Required Before Checkout</span>
                </span>
                <h2 className="font-serif-brand text-2xl font-bold">
                  Please Create an Account or Log In
                </h2>
                <p className="text-xs text-stone-200 max-w-xl">
                  As our policy for all bespoke dress orders, customers must create an account first before logging in and submitting an order. This ensures you can track tailoring progress and only you see your ordered garments in <strong>My Orders</strong>.
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs text-amber-200 block font-semibold">Your Bag is Preserved</span>
                <span className="text-[11px] text-white/80">{cart.length} dress{cart.length === 1 ? '' : 'es'} waiting</span>
              </div>
            </div>

            {/* Auth Mode Switcher */}
            <div className="grid grid-cols-2 border-b border-stone-200 text-xs font-bold uppercase tracking-wider bg-stone-50">
              <button
                type="button"
                onClick={() => {
                  setAuthSubMode('register');
                  setAuthFeedback(null);
                }}
                className={`py-3.5 text-center transition-colors cursor-pointer ${
                  authSubMode === 'register'
                    ? 'border-b-2 border-[#5B0F2A] text-[#5B0F2A] bg-white font-black'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                1. Create New Account (First Time Customer)
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthSubMode('login');
                  setAuthFeedback(null);
                }}
                className={`py-3.5 text-center transition-colors cursor-pointer ${
                  authSubMode === 'login'
                    ? 'border-b-2 border-[#5B0F2A] text-[#5B0F2A] bg-white font-black'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                2. Log In to Existing Account
              </button>
            </div>

            {/* Feedback alert */}
            {authFeedback && (
              <div className={`m-4 p-3 rounded text-xs font-semibold flex items-center justify-between gap-2 ${
                authFeedback.type === 'error' ? 'bg-rose-50 text-rose-800 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}>
                <div className="flex items-center gap-2">
                  {authFeedback.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                  <span>{authFeedback.text}</span>
                </div>
                {authFeedback.text.includes('create an account first') && authSubMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthEmail(authEmail);
                      setAuthSubMode('register');
                      setAuthFeedback(null);
                    }}
                    className="px-3 py-1 bg-[#5B0F2A] text-white rounded text-[11px] font-bold hover:bg-[#43091D] cursor-pointer"
                  >
                    Click to Create Account
                  </button>
                )}
              </div>
            )}

            {/* Registration Form */}
            {authSubMode === 'register' ? (
              <form onSubmit={handleInlineRegister} className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">
                      Your Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Hajia Mariama Baako"
                        className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">
                      Your Ghana Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
                      <input
                        type="tel"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="e.g. 0541376807"
                        className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">
                      Your Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="e.g. mariama@example.com"
                        className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">
                      Delivery Region in Ghana <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={regRegion}
                      onChange={(e) => setRegRegion(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                    >
                      {GHANA_REGIONS.map(reg => (
                        <option key={reg} value={reg}>{reg}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">
                      Town / Suburb / City <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={regTown}
                      onChange={(e) => setRegTown(e.target.value)}
                      placeholder="e.g. Oforikrom, Kumasi or Madina, Accra"
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">
                      Delivery Landmark / House Address
                    </label>
                    <input
                      type="text"
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                      placeholder="e.g. Near Central Mosque, Accra Town"
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">
                      Create Password <span className="text-rose-500">*</span> (min 6 chars)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
                      <input
                        type={showAuthPassword ? 'text' : 'password'}
                        required
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-9 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAuthPassword(!showAuthPassword)}
                        className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
                      >
                        {showAuthPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type={showAuthPassword ? 'text' : 'password'}
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3 bg-[#5B0F2A] hover:bg-[#43091D] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Create Account & Unlock Checkout</span>
                  </button>
                  <span className="text-stone-500 text-[11px]">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthSubMode('login')}
                      className="text-[#5B0F2A] font-bold hover:underline cursor-pointer"
                    >
                      Log in here
                    </button>
                  </span>
                </div>
              </form>
            ) : (
              <form onSubmit={handleInlineLogin} className="p-6 space-y-4 text-xs max-w-md">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="e.g. mariama@example.com"
                      className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type={showAuthPassword ? 'text' : 'password'}
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-9 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAuthPassword(!showAuthPassword)}
                      className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
                    >
                      {showAuthPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3 bg-[#5B0F2A] hover:bg-[#43091D] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Log In & Continue Checkout</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthSubMode('register');
                      setAuthFeedback(null);
                    }}
                    className="text-stone-600 text-[11px] hover:underline"
                  >
                    Need an account? <strong>Create one here</strong>
                  </button>
                </div>

                {/* Testing helper */}
                <div className="pt-3 border-t border-stone-100">
                  <span className="text-[10px] text-stone-400 block mb-1">Quick Test Demo:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthEmail('mariama.baako@example.com');
                      setAuthPassword('password123');
                      loginUser('mariama.baako@example.com', 'password123');
                    }}
                    className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-[11px] font-semibold cursor-pointer"
                  >
                    Quick Log In as Hajia Mariama (0541376807)
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* LOGGED IN STATUS PILL */}
        {currentUser && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <span className="font-bold text-emerald-950 block">
                  Logged in as {currentUser.fullName} ({currentUser.email})
                </span>
                <span className="text-emerald-700 text-[11px]">
                  Phone: {currentUser.phone} · Location: {currentUser.townCity} ({currentUser.region})
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={logoutUser}
              className="text-xs text-rose-700 hover:underline font-semibold cursor-pointer shrink-0"
            >
              Sign out / Use another account
            </button>
          </div>
        )}

        {/* MAIN CHECKOUT FORM */}
        <form onSubmit={handlePlaceOrder} className={`grid grid-cols-1 lg:grid-cols-12 gap-8 ${!currentUser ? 'opacity-50 pointer-events-none' : ''}`}>
          
          {/* LEFT: Customer & Ghana Delivery Info & Mobile Money Payment */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Recipient Details */}
            <div className="bg-white p-6 border border-stone-200 shadow-xs rounded-lg space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-serif-brand text-xl text-stone-900 font-bold">
                  1. Customer & Account Information
                </h3>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Account Verified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.fullName}
                    onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                    placeholder="e.g. Hajia Mariama Baako"
                    className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#5B0F2A] rounded bg-white"
                  />
                  {errors.fullName && <p className="text-rose-600 text-[11px] mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Your Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    placeholder="e.g. mariama@example.com"
                    className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#5B0F2A] rounded bg-white"
                  />
                  {errors.email && <p className="text-rose-600 text-[11px] mt-1">{errors.email}</p>}
                </div>

                <div className="sm:col-span-2">
                  <div className="p-3 bg-pink-50/70 border border-pink-200 rounded text-xs text-stone-700 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#5B0F2A] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#5B0F2A] block">Private Customer Tracking:</span>
                      <p className="text-[11px] text-stone-600">
                        Orders are permanently linked to your verified email (<strong>{customer.email || 'your account'}</strong>). Only you and the atelier owner can access your measurements and tailoring messages.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Ghana Location & Delivery Method */}
            <div className="bg-white p-6 border border-stone-200 shadow-xs rounded-lg space-y-4">
              <h3 className="font-serif-brand text-xl text-stone-900 font-bold border-b border-stone-100 pb-3">
                2. Location in Ghana & Delivery Option
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Select Region in Ghana <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={customer.region}
                    onChange={(e) => setCustomer({ ...customer, region: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#5B0F2A] rounded font-medium"
                  >
                    {GHANA_REGIONS.map(reg => (
                      <option key={reg} value={reg}>{reg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Town / City / Suburb <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.townCity}
                    onChange={(e) => setCustomer({ ...customer, townCity: e.target.value })}
                    placeholder="e.g. Oforikrom, Kumasi or Madina, Accra"
                    className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#5B0F2A] rounded"
                  />
                  {errors.townCity && <p className="text-rose-600 text-[11px] mt-1">{errors.townCity}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-800 mb-1">
                    Landmark / Delivery House Address
                  </label>
                  <input
                    type="text"
                    value={customer.landmarkAddress}
                    onChange={(e) => setCustomer({ ...customer, landmarkAddress: e.target.value })}
                    placeholder="e.g. Near Shell filling station, or Behind Central Mosque, Accra Town"
                    className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#5B0F2A] rounded"
                  />
                  {errors.landmarkAddress && <p className="text-rose-600 text-[11px] mt-1">{errors.landmarkAddress}</p>}
                </div>
              </div>

              {/* Delivery Speed / Mode options */}
              <div className="pt-2 space-y-2">
                <span className="text-xs font-bold text-stone-900 block">How would you like to receive your dresses?</span>
                
                <label className={`flex items-start gap-3 p-3 border rounded cursor-pointer transition-colors ${
                  deliveryType === 'pickup' ? 'border-[#5B0F2A] bg-pink-50/60' : 'border-stone-200 hover:bg-stone-50'
                }`}>
                  <input
                    type="radio"
                    name="deliveryType"
                    checked={deliveryType === 'pickup'}
                    onChange={() => setDeliveryType('pickup')}
                    className="mt-0.5 accent-[#5B0F2A]"
                  />
                  <div className="text-xs flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900">Pick Up in Person at Oforikrom Workshop</span>
                      <span className="font-bold text-emerald-700">FREE</span>
                    </div>
                    <span className="text-stone-600 text-[11px]">Accra Town, Behind Central Mosque (Kumasi). Free fitting trial in our boutique room!</span>
                  </div>
                </label>

                <label className={`flex items-start gap-3 p-3 border rounded cursor-pointer transition-colors ${
                  deliveryType === 'dispatch' ? 'border-[#5B0F2A] bg-pink-50/60' : 'border-stone-200 hover:bg-stone-50'
                }`}>
                  <input
                    type="radio"
                    name="deliveryType"
                    checked={deliveryType === 'dispatch'}
                    onChange={() => setDeliveryType('dispatch')}
                    className="mt-0.5 accent-[#5B0F2A]"
                  />
                  <div className="text-xs flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900">Doorstep Rider Dispatch (Kumasi & Accra Metropolis)</span>
                      <span className="font-bold text-stone-800">GH₵ 35</span>
                    </div>
                    <span className="text-stone-600 text-[11px]">Direct motorcycle courier dispatch to your door once sewing finishes.</span>
                  </div>
                </label>

                <label className={`flex items-start gap-3 p-3 border rounded cursor-pointer transition-colors ${
                  deliveryType === 'bus' ? 'border-[#5B0F2A] bg-pink-50/60' : 'border-stone-200 hover:bg-stone-50'
                }`}>
                  <input
                    type="radio"
                    name="deliveryType"
                    checked={deliveryType === 'bus'}
                    onChange={() => setDeliveryType('bus')}
                    className="mt-0.5 accent-[#5B0F2A]"
                  />
                  <div className="text-xs flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900">VIP / STC Bus Parcel Service (All 16 Regions)</span>
                      <span className="font-bold text-stone-800">GH₵ 45</span>
                    </div>
                    <span className="text-stone-600 text-[11px]">Secure dispatch via VIP or STC parcel office to Tamale, Takoradi, Sunyani, Ho, etc.</span>
                  </div>
                </label>
              </div>

            </div>

            {/* 3. STRICT MOBILE MONEY PAYMENT TERMINAL */}
            <div className="bg-white p-6 border-2 border-amber-400/80 shadow-md rounded-lg space-y-5">
              <div className="border-b border-stone-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-amber-400 text-stone-950 font-black text-[11px] rounded uppercase tracking-wider">
                      Required
                    </span>
                    <h3 className="font-serif-brand text-xl text-stone-900 font-bold">
                      3. Mobile Money Payment (MoMo)
                    </h3>
                  </div>
                  <p className="text-xs text-stone-600 mt-1">
                    Payment must be done via Mobile Money to <strong>{OFFICIAL_MOMO_NUMBER}</strong> before sending your order.
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">Total Amount to Pay</span>
                  <span className="font-mono text-xl font-black text-[#5B0F2A]">
                    {formatGHS(totalAmountGhs)}
                  </span>
                </div>
              </div>

              {/* Official MoMo Account Card */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 border border-amber-300 rounded-lg p-4 sm:p-5 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
                    <Smartphone className="w-4 h-4 text-amber-700" />
                    Official Boutique MoMo Account Details
                  </span>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                    Active & Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white/90 p-3.5 rounded border border-amber-200">
                  <div>
                    <span className="text-[10px] uppercase text-stone-500 font-semibold block">MoMo Number:</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <strong className="font-mono text-base text-stone-950 font-black tracking-wide">
                        {OFFICIAL_MOMO_NUMBER}
                      </strong>
                      <button
                        type="button"
                        onClick={copyMomoNumber}
                        className="px-2 py-0.5 bg-amber-200 hover:bg-amber-300 text-stone-900 text-[10px] font-bold rounded cursor-pointer transition-colors"
                        title="Copy MoMo Number"
                      >
                        {copiedNumber ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-stone-500 font-semibold block">Account Name:</span>
                    <strong className="text-xs text-stone-900 font-bold block mt-0.5">
                      {OFFICIAL_MOMO_NAME}
                    </strong>
                    <span className="text-[10px] text-stone-500">Atelier Owner</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-stone-500 font-semibold block">Transfer Amount:</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <strong className="font-mono text-base text-[#5B0F2A] font-black">
                        {formatGHS(totalAmountGhs)}
                      </strong>
                      <button
                        type="button"
                        onClick={copyTotalAmount}
                        className="px-2 py-0.5 bg-pink-100 hover:bg-pink-200 text-[#5B0F2A] text-[10px] font-bold rounded cursor-pointer transition-colors"
                        title="Copy Amount"
                      >
                        {copiedAmount ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step-by-Step Instructions */}
                <div className="pt-2 text-stone-700 text-[11px] space-y-1">
                  <p className="font-bold text-stone-900">How to Send Payment before Submitting:</p>
                  <ol className="list-decimal list-inside space-y-1 text-stone-600 pl-1">
                    <li>Open your phone's dialer or MoMo App (Dial <strong>*170#</strong> for MTN, <strong>*110#</strong> for Telecel).</li>
                    <li>Choose <strong>Transfer Money</strong> &rarr; <strong>MoMo User</strong>.</li>
                    <li>Enter Recipient Phone: <strong className="font-mono text-stone-900">{OFFICIAL_MOMO_NUMBER}</strong> (Al-Ikhlas Fashion Center).</li>
                    <li>Enter Amount: <strong className="font-mono text-stone-900">{totalAmountGhs}</strong> and Reference: <strong className="font-mono text-stone-900">{customer.fullName || 'Abaya Dress'}</strong>.</li>
                    <li>Approve with your MoMo PIN on your phone.</li>
                    <li>Once sent, enter your <strong>MoMo Phone</strong> and the <strong>Transaction ID from your SMS receipt</strong> below.</li>
                  </ol>
                </div>
              </div>

              {/* PAYMENT VERIFICATION INPUTS (REQUIRED) */}
              <div className="space-y-4 pt-1">
                <span className="text-xs font-bold text-stone-900 block border-b border-stone-100 pb-2">
                  Enter Your Payment Confirmation Details Below (Must be Completed):
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">
                      Your MoMo Network <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={momoNetwork}
                      onChange={(e) => setMomoNetwork(e.target.value as any)}
                      className="w-full px-3 py-2 border border-stone-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                    >
                      <option value="MTN Mobile Money">MTN Mobile Money</option>
                      <option value="Telecel Cash">Telecel Cash</option>
                      <option value="AT Money">AT Money (AirtelTigo)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">
                      Paying Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={momoSenderPhone}
                      onChange={(e) => setMomoSenderPhone(e.target.value)}
                      placeholder="e.g. 0541376807"
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                    />
                    {errors.momoSenderPhone && (
                      <p className="text-rose-600 text-[11px] mt-1">{errors.momoSenderPhone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">
                      MoMo Transaction ID / Reference <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={momoTransactionId}
                      onChange={(e) => setMomoTransactionId(e.target.value)}
                      placeholder="e.g. 2948190284"
                      className="w-full px-3 py-2 border border-stone-300 rounded font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                    />
                    {errors.momoTransactionId && (
                      <p className="text-rose-600 text-[11px] mt-1">{errors.momoTransactionId}</p>
                    )}
                  </div>
                </div>

                {/* Mandatory Confirmation Checkbox */}
                <label className={`flex items-start gap-3 p-3 rounded border cursor-pointer transition-colors ${
                  momoConfirmed ? 'border-emerald-500 bg-emerald-50/70' : 'border-stone-300 bg-stone-50 hover:bg-stone-100'
                }`}>
                  <input
                    type="checkbox"
                    checked={momoConfirmed}
                    onChange={(e) => setMomoConfirmed(e.target.checked)}
                    className="mt-0.5 accent-[#5B0F2A] w-4 h-4 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-stone-900 block">
                      I have completed the Mobile Money transfer of {formatGHS(totalAmountGhs)} to 0541376807 <span className="text-rose-500">*</span>
                    </span>
                    <span className="text-stone-600 text-[11px]">
                      I confirm the Transaction ID entered above matches the official SMS receipt sent to my phone.
                    </span>
                  </div>
                </label>
                {errors.momoConfirmed && (
                  <p className="text-rose-600 text-[11px] font-semibold">{errors.momoConfirmed}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Additional Notes or Specific Measurements:
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Need dress length adjusted, bust fitting, or delivered before Friday Jumu'ah prayer."
                  className="w-full p-2.5 text-xs border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                />
              </div>

            </div>

          </div>

          {/* RIGHT: Order items review & submission */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 border border-stone-200 shadow-xs rounded-lg sticky top-28 space-y-5">
              
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-serif-brand text-xl text-stone-900 font-bold">
                  Order Summary ({cart.length})
                </h3>
                <span className="text-xs font-mono font-bold text-[#5B0F2A]">
                  MoMo Payment
                </span>
              </div>

              {/* Item List with Pricing */}
              <div className="space-y-3 max-h-72 overflow-y-auto divide-y divide-stone-100 pr-1">
                {cartWithPricing.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex gap-3 text-xs">
                    <div className="w-14 aspect-[3/4] bg-stone-100 border border-stone-200 rounded-sm shrink-0 overflow-hidden relative">
                      <ColorizedDressImage
                        baseImage={item.image}
                        color={item.color}
                        alt={item.name}
                        showBadge={false}
                        className="w-full h-full object-cover object-top"
                        containerClassName="w-full h-full relative"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif-brand font-bold text-stone-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-stone-600 mt-0.5">
                        Length: <strong className="text-[#5B0F2A]">{item.size}</strong> · Shade: <strong>{item.color.name}</strong>
                      </p>
                      <div className="flex items-center justify-between text-[11px] mt-1">
                        <span className="text-stone-500">Qty: {item.quantity} × {formatGHS(item.unitPrice)}</span>
                        <strong className="font-mono text-stone-900">{formatGHS(item.totalPrice)}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="pt-3 border-t border-stone-200 text-xs space-y-2">
                <div className="flex items-center justify-between text-stone-600">
                  <span>Subtotal ({cart.length} item{cart.length === 1 ? '' : 's'}):</span>
                  <span className="font-mono font-semibold">{formatGHS(subtotalGhs)}</span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span>Delivery ({deliveryType === 'pickup' ? 'Workshop Pickup' : 'Courier Dispatch'}):</span>
                  <span className="font-mono font-semibold">
                    {deliveryFeeGhs === 0 ? 'FREE' : formatGHS(deliveryFeeGhs)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-100">
                  <span>Total Amount Due via MoMo:</span>
                  <span className="font-mono text-lg text-[#5B0F2A]">{formatGHS(totalAmountGhs)}</span>
                </div>
              </div>

              {/* Official Atelier Contact Info */}
              <div className="pt-2 border-t border-stone-200 text-xs text-stone-600 space-y-1.5">
                <div className="flex items-center gap-1.5 text-stone-700">
                  <Smartphone className="w-3.5 h-3.5 text-amber-600" />
                  <span>MoMo Recipient: <strong className="font-mono text-stone-900">{OFFICIAL_MOMO_NUMBER}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-stone-700">
                  <Mail className="w-3.5 h-3.5 text-[#5B0F2A]" />
                  <span>Owner Contact: <strong className="font-mono text-stone-900">{SHOP_TARGET_EMAIL}</strong></span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="space-y-2.5 pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting || !currentUser || !momoTransactionId.trim() || !momoSenderPhone.trim() || !momoConfirmed}
                  className={`w-full py-4 text-xs font-bold uppercase tracking-wider transition-all shadow-md rounded flex items-center justify-center gap-2 cursor-pointer ${
                    !currentUser || !momoTransactionId.trim() || !momoSenderPhone.trim() || !momoConfirmed
                      ? 'bg-stone-300 text-stone-500 cursor-not-allowed opacity-75'
                      : 'bg-[#5B0F2A] hover:bg-[#43091D] text-white'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {isSubmitting 
                      ? 'Transmitting Order & MoMo Details...' 
                      : `Confirm MoMo Payment & Send Order (${formatGHS(totalAmountGhs)})`}
                  </span>
                </button>

                {(!momoTransactionId.trim() || !momoConfirmed) && (
                  <p className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded border border-amber-200 text-center font-medium">
                    ⚠️ Payment must be done via Mobile Money to <strong>0541376807</strong> before sending order. Please enter your MoMo Transaction ID and check the confirmation box above.
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => {
                    const { text, subject } = formatBookingSummary({
                      orderNumber: `MOMO-${Date.now().toString().slice(-4)}`,
                      customer,
                      items: cart,
                      deliveryType,
                      notes: `Payment via MoMo to 0541376807. Tx ID: ${momoTransactionId || 'Pending'}. Total: ${formatGHS(totalAmountGhs)}. Notes: ${notes}`,
                    });
                    openEmailOrder({
                      to: SHOP_TARGET_EMAIL,
                      subject,
                      body: text,
                    });
                  }}
                  className="w-full py-2.5 px-3 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-[11px] font-bold uppercase tracking-wide transition-colors rounded flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-[#5B0F2A]" />
                  <span>Send Order Copy to Boutique Email</span>
                </button>
              </div>

              <p className="text-[11px] text-stone-500 text-center leading-relaxed">
                Every order is directly transmitted to the atelier owner for MoMo verification. You will be able to track sewing progress and chat with the tailor in <strong>My Orders</strong>.
              </p>

            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
