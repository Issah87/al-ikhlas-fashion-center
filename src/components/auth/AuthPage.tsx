import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ShoppingBag,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { useShop, OFFICIAL_MOMO_NUMBER, OFFICIAL_MOMO_NAME } from '../../context/ShopContext';
import { GHANA_REGIONS } from '../../data/mockProducts';

interface AuthPageProps {
  onSuccess?: () => void;
  isModal?: boolean;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, isModal = false }) => {
  const { 
    currentUser, 
    registerUser, 
    loginUser, 
    logoutUser, 
    setActiveTab, 
    cart,
    authNoticeMessage, 
    setAuthNoticeMessage,
    setIsAuthModalOpen 
  } = useShop();

  // Mode: 'register' | 'login' - default to 'register' to honor "customer must create account before login in"
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRegion, setRegRegion] = useState(GHANA_REGIONS[0]);
  const [regTown, setRegTown] = useState('Oforikrom, Kumasi');
  const [regAddress, setRegAddress] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigateAfterAuth = () => {
    if (onSuccess) {
      onSuccess();
    } else if (cart.length > 0) {
      setActiveTab('checkout');
    } else {
      setActiveTab('my-orders');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (!loginEmail.trim() || !loginEmail.includes('@')) {
      setFeedback({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    if (!loginPassword.trim()) {
      setFeedback({ type: 'error', text: 'Please enter your account password.' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = loginUser(loginEmail, loginPassword);
      setIsSubmitting(false);
      if (res.success) {
        setFeedback({ type: 'success', text: res.message });
        setAuthNoticeMessage('');
        setTimeout(() => {
          navigateAfterAuth();
        }, 500);
      } else {
        setFeedback({ type: 'error', text: res.message });
      }
    }, 400);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!regName.trim()) {
      setFeedback({ type: 'error', text: 'Please enter your full name.' });
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setFeedback({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    if (!regPhone.trim() || regPhone.replace(/\D/g, '').length < 9) {
      setFeedback({ type: 'error', text: 'Please enter a valid Ghanaian phone number (e.g. 0541376807).' });
      return;
    }
    if (!regTown.trim()) {
      setFeedback({ type: 'error', text: 'Please specify your town or suburb (e.g. Oforikrom, Kumasi).' });
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setFeedback({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setFeedback({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = registerUser({
        fullName: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        region: regRegion,
        townCity: regTown.trim(),
        landmarkAddress: regAddress.trim() || undefined,
        password: regPassword,
      });

      setIsSubmitting(false);
      if (res.success) {
        setFeedback({ type: 'success', text: res.message });
        setAuthNoticeMessage('');
        setTimeout(() => {
          navigateAfterAuth();
        }, 600);
      } else {
        setFeedback({ type: 'error', text: res.message });
      }
    }, 500);
  };

  const handleQuickDemoLogin = (email: string) => {
    setLoginEmail(email);
    setLoginPassword('password123');
    const res = loginUser(email, 'password123');
    if (res.success) {
      setFeedback({ type: 'success', text: res.message });
      setAuthNoticeMessage('');
      setTimeout(() => {
        navigateAfterAuth();
      }, 400);
    }
  };

  // If already logged in
  if (currentUser) {
    return (
      <div className={`${isModal ? 'p-4' : 'min-h-[75vh] py-12'} flex items-center justify-center bg-[#FAF9F5]`}>
        <div className="max-w-md w-full bg-white border border-stone-200 rounded-lg p-6 shadow-md text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h3 className="font-serif-brand text-2xl font-bold text-stone-900">
            Welcome, {currentUser.fullName}!
          </h3>

          <p className="text-xs text-stone-600">
            You are logged in to your verified customer account at Al-Ikhlas Fashion Center.
          </p>

          <div className="p-3.5 bg-stone-50 border border-stone-200 rounded text-xs text-left space-y-1.5 text-stone-700">
            <p><strong>Email:</strong> {currentUser.email}</p>
            <p><strong>Ghana Phone:</strong> {currentUser.phone}</p>
            <p><strong>Delivery Location:</strong> {currentUser.townCity} ({currentUser.region})</p>
            {currentUser.landmarkAddress && <p><strong>Address:</strong> {currentUser.landmarkAddress}</p>}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            {cart.length > 0 && (
              <button
                onClick={() => {
                  if (isModal) setIsAuthModalOpen(false);
                  setActiveTab('checkout');
                }}
                className="w-full py-3 bg-[#5B0F2A] hover:bg-[#43091D] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer shadow-xs"
              >
                Proceed to Checkout with {cart.length} Dress{cart.length === 1 ? '' : 'es'}
              </button>
            )}

            <button
              onClick={() => {
                if (isModal) setIsAuthModalOpen(false);
                setActiveTab('my-orders');
              }}
              className="w-full py-2.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
            >
              View My Ordered Dresses
            </button>

            <button
              onClick={() => {
                if (isModal) setIsAuthModalOpen(false);
                setActiveTab('shop');
              }}
              className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded cursor-pointer transition-colors"
            >
              Continue Shopping
            </button>

            <button
              onClick={logoutUser}
              className="text-xs text-rose-600 hover:underline pt-2 cursor-pointer font-semibold"
            >
              Sign Out of Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isModal ? 'p-2' : 'min-h-screen py-10'} bg-[#FAF9F5] flex items-center justify-center px-4`}>
      <div className="max-w-lg w-full bg-white border border-stone-200 rounded-lg shadow-md overflow-hidden">
        
        {/* Header Ribbon */}
        <div className="bg-[#5B0F2A] text-white p-6 text-center relative">
          <div className="w-12 h-12 bg-amber-400 text-stone-950 font-black rounded-full flex items-center justify-center text-xl mx-auto mb-2 shadow-xs">
            ★
          </div>
          <h2 className="font-serif-brand text-2xl font-bold">
            Al-Ikhlas Fashion Center
          </h2>
          <p className="text-xs text-stone-200 mt-1">
            Ghana's Bespoke Abaya & Boubou Atelier · Oforikrom, Kumasi
          </p>

          {/* Important Customer Notice */}
          <div className="mt-3 p-2.5 bg-amber-300 text-stone-950 rounded text-xs font-bold flex items-center gap-2 justify-center shadow-xs">
            <ShieldCheck className="w-4 h-4 shrink-0 text-stone-950" />
            <span>Policy: Customers must create an account before logging in to order.</span>
          </div>

          {authNoticeMessage && (
            <div className="mt-2 p-2 bg-white/20 text-white rounded text-[11px] font-semibold">
              {authNoticeMessage}
            </div>
          )}
        </div>

        {/* Auth Mode Tabs: 1. Create Account, 2. Log In */}
        <div className="grid grid-cols-2 border-b border-stone-200 text-xs font-bold uppercase tracking-wider bg-stone-50">
          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setFeedback(null);
            }}
            className={`py-3.5 text-center transition-colors cursor-pointer ${
              authMode === 'register'
                ? 'border-b-2 border-[#5B0F2A] text-[#5B0F2A] bg-white font-black'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            1. Create Account (New Customer)
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setFeedback(null);
            }}
            className={`py-3.5 text-center transition-colors cursor-pointer ${
              authMode === 'login'
                ? 'border-b-2 border-[#5B0F2A] text-[#5B0F2A] bg-white font-black'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            2. Log In (Existing Customer)
          </button>
        </div>

        {/* Feedback Alert with 1-Click Action */}
        {feedback && (
          <div className={`m-4 p-3.5 rounded text-xs font-medium space-y-2 ${
            feedback.type === 'error' ? 'bg-rose-50 text-rose-800 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}>
            <div className="flex items-center gap-2">
              {feedback.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0 text-rose-700" /> : <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" />}
              <span className="font-semibold">{feedback.text}</span>
            </div>

            {/* Direct switch to register if email not found */}
            {feedback.text.includes('create an account first') && authMode === 'login' && (
              <button
                type="button"
                onClick={() => {
                  setRegEmail(loginEmail);
                  setAuthMode('register');
                  setFeedback(null);
                }}
                className="w-full py-2 bg-[#5B0F2A] hover:bg-[#43091D] text-white font-bold rounded text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Click Here to Create Account with {loginEmail}
              </button>
            )}
          </div>
        )}

        {/* 1. REGISTRATION FORM (DEFAULT) */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="p-6 space-y-3.5 text-xs">
            <div className="bg-pink-50/70 p-3 rounded border border-pink-200 text-stone-700 text-[11px] leading-relaxed">
              <strong className="text-[#5B0F2A] block font-bold mb-0.5">Creating an account takes less than 30 seconds:</strong>
              You'll be able to send custom measurements, complete Mobile Money payment to <strong>0541376807</strong>, and track tailoring in <strong>My Orders</strong>.
            </div>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  Ghana Phone Number <span className="text-rose-500">*</span>
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
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. mariama@example.com"
                    className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  Region in Ghana <span className="text-rose-500">*</span>
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
                  Town / City / Suburb <span className="text-rose-500">*</span>
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
            </div>

            <div>
              <label className="block font-semibold text-stone-800 mb-1">
                Landmark / Delivery House Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  placeholder="e.g. Near Central Mosque, Accra Town, Kumasi"
                  className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  Create Password <span className="text-rose-500">*</span> (min 6)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-8 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#5B0F2A] hover:bg-[#43091D] text-white font-bold uppercase tracking-wider rounded transition-colors cursor-pointer shadow-xs disabled:opacity-50 text-xs flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Creating Customer Account...' : 'Create Account & Continue'}</span>
            </button>

            <p className="text-center text-[11px] text-stone-600 pt-1">
              Already created your account?{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setFeedback(null);
                }}
                className="text-[#5B0F2A] font-bold hover:underline cursor-pointer"
              >
                Log In to Existing Account
              </button>
            </p>
          </form>
        )}

        {/* 2. LOGIN FORM */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4 text-xs">
            <div className="bg-amber-50 p-3 rounded border border-amber-200 text-stone-800 text-[11px]">
              <strong className="block text-amber-900 font-bold mb-0.5">Please Note:</strong>
              You must have created an account before logging in. If you are a new customer, please click "1. Create Account" above.
            </div>

            <div>
              <label className="block font-semibold text-stone-800 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-9 pr-3 py-2.5 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-800 mb-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2.5 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#5B0F2A] hover:bg-[#43091D] text-white font-bold uppercase tracking-wider rounded transition-colors cursor-pointer shadow-xs disabled:opacity-50 text-xs flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? 'Verifying Account...' : 'Log In & Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Demo Login Helpers */}
            <div className="pt-3 border-t border-stone-100 text-center space-y-2">
              <span className="text-[11px] text-stone-500 block">
                Testing Demo Existing Accounts:
              </span>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('mariama.baako@example.com')}
                className="w-full py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-semibold text-[11px] transition-colors cursor-pointer"
              >
                Log In as Hajia Mariama (mariama.baako@example.com)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('amina.d@example.com')}
                className="w-full py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-semibold text-[11px] transition-colors cursor-pointer"
              >
                Log In as Amina Danlad (amina.d@example.com)
              </button>
            </div>

            <p className="text-center text-[11px] text-stone-600 pt-2">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setFeedback(null);
                }}
                className="text-[#5B0F2A] font-bold hover:underline cursor-pointer"
              >
                Create Account Here First
              </button>
            </p>
          </form>
        )}

        {/* Footer info: MoMo Number and Owner Portal */}
        <div className="bg-stone-50 p-4 border-t border-stone-200 text-xs text-stone-600 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-amber-600" />
            <span>Official MoMo: <strong className="font-mono text-stone-900">{OFFICIAL_MOMO_NUMBER}</strong></span>
          </div>

          <button
            type="button"
            onClick={() => {
              if (isModal) setIsAuthModalOpen(false);
              setActiveTab('owner-portal');
            }}
            className="text-[11px] text-stone-700 hover:text-[#5B0F2A] font-semibold flex items-center gap-1 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Owner / Admin Portal Access</span>
          </button>
        </div>

      </div>
    </div>
  );
};
