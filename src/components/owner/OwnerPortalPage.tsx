import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  ShoppingBag, 
  Scissors, 
  MapPin, 
  Mail, 
  MessageSquare, 
  Send, 
  Check, 
  Clock, 
  Search, 
  Filter, 
  ArrowLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  Smartphone,
  Copy,
  Printer,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw
} from 'lucide-react';
import { useShop, OFFICIAL_MOMO_NUMBER, OFFICIAL_MOMO_NAME } from '../../context/ShopContext';
import { ColorizedDressImage } from '../shop/ColorizedDressImage';
import { Order } from '../../types';
import { formatGHS } from '../../utils/productPricing';
import { SHOP_TARGET_EMAIL } from '../../utils/sendWhatsAppOrder';

export const OwnerPortalPage: React.FC = () => {
  const { 
    orders, 
    updateOrderStatus, 
    verifyMoMoPayment,
    addOrderMessage, 
    inquiries, 
    replyToInquiry,
    isOwnerAuthenticated, 
    loginAsOwner, 
    logoutOwner,
    setActiveTab,
    setCurrentCustomerEmail 
  } = useShop();

  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTabSection, setActiveTabSection] = useState<'orders' | 'inquiries'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'pending' | 'verified'>('all');
  const [copiedTxId, setCopiedTxId] = useState<string | null>(null);
  
  // Message reply states
  const [ownerMessageInputs, setOwnerMessageInputs] = useState<Record<string, string>>({});
  const [inquiryReplyInputs, setInquiryReplyInputs] = useState<Record<string, string>>({});

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAsOwner(pinInput)) {
      setAuthError('');
      setPinInput('');
    } else {
      setAuthError('Invalid PIN or email. Please enter PIN: 1234 or issahn712@gmail.com');
    }
  };

  const handleOwnerSendMessage = (orderId: string) => {
    const text = (ownerMessageInputs[orderId] || '').trim();
    if (!text) return;
    addOrderMessage(orderId, text, 'owner', 'Al-Ikhlas Atelier');
    setOwnerMessageInputs(prev => ({ ...prev, [orderId]: '' }));
  };

  const handleInquiryReply = (inquiryId: string) => {
    const text = (inquiryReplyInputs[inquiryId] || '').trim();
    if (!text) return;
    replyToInquiry(inquiryId, text);
    setInquiryReplyInputs(prev => ({ ...prev, [inquiryId]: '' }));
  };

  const copyTransactionId = (txId: string) => {
    navigator.clipboard.writeText(txId).then(() => {
      setCopiedTxId(txId);
      setTimeout(() => setCopiedTxId(null), 2000);
    });
  };

  // If not authenticated, show Owner Login Shield
  if (!isOwnerAuthenticated) {
    return (
      <div className="bg-[#FAF9F5] min-h-screen py-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-stone-200 shadow-md rounded-lg p-8 space-y-6 text-center">
          <div className="w-16 h-16 bg-[#5B0F2A] text-white rounded-full flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-8 h-8 text-amber-300" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#5B0F2A] bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
              Admin & Owner Access
            </span>
            <h2 className="font-serif-brand text-2xl text-stone-900 font-bold">
              Atelier Owner Portal
            </h2>
            <p className="text-xs text-stone-600">
              Al-Ikhlas Fashion Center management center. View <strong>all customer dress orders</strong>, verify Mobile Money transfers sent to <strong>0541376807</strong>, and update tailoring progress.
            </p>
            <p className="text-[11px] font-mono text-[#5B0F2A] font-bold pt-1">
              Owner Email: {SHOP_TARGET_EMAIL}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Owner PIN or Email Address:
              </label>
              <input
                type="text"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setAuthError('');
                }}
                placeholder="Enter PIN (1234) or issahn712@gmail.com"
                className="w-full text-xs p-3 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                autoFocus
              />
              {authError && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{authError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#5B0F2A] hover:bg-[#43091D] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer shadow-xs"
            >
              Unlock Owner Dashboard
            </button>
          </form>

          <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                loginAsOwner('1234');
              }}
              className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded cursor-pointer transition-colors"
            >
              Quick Unlock with Default Owner PIN (1234)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('shop')}
              className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
            >
              Return to Customer Shop
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered orders list for the owner
  const filteredOrders = orders.filter(ord => {
    // Status filter
    if (statusFilter !== 'All' && ord.orderStatus !== statusFilter) return false;
    
    // MoMo payment filter
    if (paymentFilter === 'pending') {
      const isPending = ord.paymentStatus === 'Pending Verification' || ord.paymentStatus === 'MoMo Paid - Pending Owner Verification';
      if (!isPending) return false;
    } else if (paymentFilter === 'verified') {
      const isVerified = ord.paymentStatus === 'Payment Verified by Owner' || ord.paymentStatus === 'MoMo Confirmed';
      if (!isVerified) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = ord.orderNumber.toLowerCase().includes(q);
      const matchName = ord.customer.fullName.toLowerCase().includes(q);
      const matchEmail = ord.customer.email.toLowerCase().includes(q);
      const matchCity = ord.customer.townCity.toLowerCase().includes(q);
      const matchTx = (ord.momoTransactionId || '').toLowerCase().includes(q);
      const matchPhone = (ord.momoSenderPhone || ord.customer.phone || '').toLowerCase().includes(q);
      const matchDress = ord.items.some(it => it.name.toLowerCase().includes(q));
      if (!matchNum && !matchName && !matchEmail && !matchCity && !matchTx && !matchPhone && !matchDress) return false;
    }
    return true;
  });

  const totalRevenueGhs = orders.reduce((sum, ord) => sum + (ord.totalAmountGhs || 450), 0);
  const totalDressesOrdered = orders.reduce((sum, ord) => {
    return sum + ord.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
  }, 0);

  const pendingMoMoCount = orders.filter(o => 
    o.paymentStatus === 'Pending Verification' || o.paymentStatus === 'MoMo Paid - Pending Owner Verification'
  ).length;

  const sewingCount = orders.filter(o => o.orderStatus === 'Sewing in Progress').length;
  const readyCount = orders.filter(o => o.orderStatus === 'Ready for Pickup / Dispatch').length;

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-8 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Management Bar */}
        <div className="bg-white p-5 border border-stone-200 rounded-lg shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-100 text-[#5B0F2A] border border-amber-300 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Atelier Owner Portal · Full Order Visibility</span>
              </span>
              <span className="text-xs text-stone-500 font-mono">
                {SHOP_TARGET_EMAIL} · MoMo: <strong>{OFFICIAL_MOMO_NUMBER}</strong>
              </span>
            </div>
            <h1 className="font-serif-brand text-2xl sm:text-3xl text-stone-900 font-bold">
              All Boutique Orders & Dress Tailoring
            </h1>
            <p className="text-xs text-stone-600">
              As owner, you can view <strong>every single order placed by all customers</strong>, inspect Mobile Money transfers sent to <strong>0541376807</strong>, confirm payment receipts, and update tailoring progress.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('my-orders');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded cursor-pointer transition-colors"
              title="Preview Customer View"
            >
              <span>View as Customer</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={logoutOwner}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-semibold rounded cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock / Logout</span>
            </button>
          </div>
        </div>

        {/* Highlight Alert if Orders Awaiting MoMo Verification */}
        {pendingMoMoCount > 0 && (
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-black">
                !
              </div>
              <div>
                <strong className="text-stone-900 text-sm block">
                  {pendingMoMoCount} Order{pendingMoMoCount === 1 ? '' : 's'} Awaiting MoMo Verification on 0541376807
                </strong>
                <p className="text-stone-600 text-[11px]">
                  Check your phone SMS messages on <strong>0541376807</strong> for the Transaction IDs listed below, then click "Confirm MoMo Payment Received".
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPaymentFilter('pending')}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded transition-colors cursor-pointer shrink-0"
            >
              View Pending Orders ({pendingMoMoCount})
            </button>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 border border-stone-200 rounded-lg shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block">
              Total Customer Orders
            </span>
            <strong className="text-2xl font-serif-brand text-stone-900 font-bold block mt-1">
              {orders.length}
            </strong>
            <span className="text-[11px] text-stone-500">Across all customers</span>
          </div>

          <div className="bg-white p-4 border border-stone-200 rounded-lg shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-[#5B0F2A] tracking-wider block">
              Total Order Revenue
            </span>
            <strong className="text-2xl font-serif-brand text-[#5B0F2A] font-bold block mt-1">
              {formatGHS(totalRevenueGhs)}
            </strong>
            <span className="text-[11px] text-stone-500">{totalDressesOrdered} dress garments</span>
          </div>

          <div className="bg-white p-4 border border-stone-200 rounded-lg shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider block">
              Awaiting MoMo Verify
            </span>
            <strong className="text-2xl font-serif-brand text-amber-900 font-bold block mt-1">
              {pendingMoMoCount}
            </strong>
            <span className="text-[11px] text-amber-700">Check 0541376807 SMS</span>
          </div>

          <div className="bg-white p-4 border border-stone-200 rounded-lg shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-purple-700 tracking-wider block">
              Active Tailoring
            </span>
            <strong className="text-2xl font-serif-brand text-purple-900 font-bold block mt-1">
              {sewingCount}
            </strong>
            <span className="text-[11px] text-purple-600">{readyCount} ready for dispatch</span>
          </div>
        </div>

        {/* View Switcher Tabs: Orders vs Inquiries */}
        <div className="flex items-center gap-2 border-b border-stone-200">
          <button
            onClick={() => setActiveTabSection('orders')}
            className={`pb-3 px-3 text-xs font-bold uppercase tracking-wider transition-colors relative cursor-pointer ${
              activeTabSection === 'orders'
                ? 'text-[#5B0F2A] border-b-2 border-[#5B0F2A]'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            All Customer Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTabSection('inquiries')}
            className={`pb-3 px-3 text-xs font-bold uppercase tracking-wider transition-colors relative cursor-pointer ${
              activeTabSection === 'inquiries'
                ? 'text-[#5B0F2A] border-b-2 border-[#5B0F2A]'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Website Inquiries & Concierge ({inquiries.length})
          </button>
        </div>

        {/* SECTION: ALL CUSTOMER ORDERS */}
        {activeTabSection === 'orders' && (
          <div className="space-y-4">
            
            {/* Filter & Search Bar */}
            <div className="bg-white p-4 border border-stone-200 rounded-lg shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search order #, customer, MoMo Tx ID, phone..."
                  className="w-full py-2 pl-3 pr-8 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-2.5" />
              </div>

              {/* Payment Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <span className="text-stone-500 font-semibold">Payment:</span>
                <button
                  type="button"
                  onClick={() => setPaymentFilter('all')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                    paymentFilter === 'all' ? 'bg-[#5B0F2A] text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  All ({orders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentFilter('pending')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                    paymentFilter === 'pending' ? 'bg-amber-500 text-white font-bold' : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  Pending MoMo ({pendingMoMoCount})
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentFilter('verified')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                    paymentFilter === 'verified' ? 'bg-emerald-600 text-white font-bold' : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  Verified MoMo
                </button>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-stone-500 shrink-0 font-medium">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="py-1.5 px-3 border border-stone-300 rounded bg-white text-xs focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Order Confirmed">Order Confirmed</option>
                  <option value="Fabric Sourced">Fabric Sourced</option>
                  <option value="Sewing in Progress">Sewing in Progress</option>
                  <option value="Ready for Pickup / Dispatch">Ready for Pickup / Dispatch</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>

            {/* List of Orders */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white p-12 text-center border border-stone-200 rounded-lg text-xs text-stone-500 space-y-2">
                <p className="font-semibold text-stone-700 text-sm">No orders match your filter criteria.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('All');
                    setPaymentFilter('all');
                  }}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-semibold text-xs cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => {
                  const messageList = order.messages || [];
                  const isPaymentVerified = order.paymentStatus === 'Payment Verified by Owner' || order.paymentStatus === 'MoMo Confirmed';
                  const orderTotal = order.totalAmountGhs || 450;

                  return (
                    <div 
                      key={order.id} 
                      className={`bg-white border rounded-lg shadow-sm overflow-hidden transition-all ${
                        !isPaymentVerified ? 'border-amber-300 ring-1 ring-amber-200' : 'border-stone-200'
                      }`}
                    >
                      {/* Order Header */}
                      <div className="p-4 sm:p-5 bg-stone-50/90 border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-base font-bold text-stone-900">
                              Order #{order.orderNumber}
                            </span>
                            <span className="text-stone-300">·</span>
                            <span className="font-semibold text-stone-800 text-xs">
                              Customer: <strong>{order.customer.fullName}</strong>
                            </span>
                            <a 
                              href={`mailto:${order.customer.email}`}
                              className="text-xs font-mono text-[#5B0F2A] hover:underline"
                            >
                              ({order.customer.email})
                            </a>
                            {order.customer.phone && (
                              <span className="text-xs text-stone-600 font-mono">
                                📞 {order.customer.phone}
                              </span>
                            )}
                          </div>

                          <p className="text-[11px] text-stone-500 flex flex-wrap items-center gap-2">
                            <span>Date: {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span>·</span>
                            <span>Destination: <strong className="text-stone-700">{order.customer.townCity} ({order.customer.region})</strong></span>
                            {order.customer.landmarkAddress && (
                              <>
                                <span>·</span>
                                <span>Address: {order.customer.landmarkAddress}</span>
                              </>
                            )}
                          </p>
                        </div>

                        {/* Status Updater Selector */}
                        <div className="flex items-center gap-2 shrink-0">
                          <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wide">
                            Tailoring Status:
                          </label>
                          <select
                            value={order.orderStatus}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['orderStatus'])}
                            className="text-xs font-bold py-1.5 px-3 rounded border border-stone-300 bg-white text-[#5B0F2A] focus:outline-none focus:ring-2 focus:ring-[#5B0F2A]"
                          >
                            <option value="Order Confirmed">Order Confirmed</option>
                            <option value="Fabric Sourced">Fabric Sourced</option>
                            <option value="Sewing in Progress">Sewing in Progress</option>
                            <option value="Ready for Pickup / Dispatch">Ready for Pickup / Dispatch</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>
                      </div>

                      {/* MOBILE MONEY PAYMENT AUDIT CARD */}
                      <div className={`p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isPaymentVerified ? 'bg-emerald-50/70 border-emerald-200' : 'bg-amber-50/80 border-amber-200'
                      }`}>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-lg font-black text-stone-900">
                              {formatGHS(orderTotal)}
                            </span>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                              isPaymentVerified 
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                                : 'bg-amber-200 text-amber-900 border-amber-300 animate-pulse'
                            }`}>
                              {isPaymentVerified ? '✓ Payment Verified' : '⚠️ Awaiting MoMo Verification on 0541376807'}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-stone-700">
                            <span>
                              Network: <strong>{order.momoNetwork || 'MTN Mobile Money'}</strong>
                            </span>
                            <span>·</span>
                            <span>
                              MoMo Sent To: <strong className="font-mono text-stone-900">{OFFICIAL_MOMO_NUMBER}</strong>
                            </span>
                            <span>·</span>
                            <span>
                              Payer Phone: <strong className="font-mono text-stone-900">{order.momoSenderPhone || order.customer.phone || 'N/A'}</strong>
                            </span>
                            {order.momoTransactionId && (
                              <>
                                <span>·</span>
                                <span className="flex items-center gap-1">
                                  <span>Tx ID / Ref:</span>
                                  <strong className="font-mono bg-white px-2 py-0.5 rounded border border-stone-300 font-bold text-stone-900">
                                    {order.momoTransactionId}
                                  </strong>
                                  <button
                                    type="button"
                                    onClick={() => copyTransactionId(order.momoTransactionId!)}
                                    className="p-1 text-stone-500 hover:text-stone-800 cursor-pointer"
                                    title="Copy Transaction ID"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                  {copiedTxId === order.momoTransactionId && (
                                    <span className="text-[10px] text-emerald-700 font-bold">Copied!</span>
                                  )}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* OWNER ACTION: CONFIRM MOMO PAYMENT */}
                        <div>
                          {!isPaymentVerified ? (
                            <button
                              type="button"
                              onClick={() => verifyMoMoPayment(order.id)}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Confirm Payment Received ({formatGHS(orderTotal)})</span>
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-emerald-800 text-xs font-bold">
                              <Check className="w-4 h-4" />
                              <span>Verified on 0541376807</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Ordered Dresses Grid */}
                      <div className="p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                            Ordered Dresses ({order.items.length})
                          </h4>
                          <span className="text-xs text-stone-500">
                            Delivery Mode: <strong>{order.customer.preferredContact || 'Direct Portal'}</strong>
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {order.items.map((item) => (
                            <div 
                              key={item.id} 
                              className="p-3.5 rounded border border-stone-200 bg-stone-50/60 flex items-center gap-3.5 text-xs"
                            >
                              <div className="w-16 h-20 bg-stone-200 border border-stone-300 rounded overflow-hidden shrink-0 relative">
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
                                <h5 className="font-serif-brand font-bold text-stone-900 truncate">
                                  {item.name}
                                </h5>
                                <div className="mt-1 space-y-0.5 text-[11px] text-stone-600">
                                  <p className="flex items-center gap-1.5">
                                    <span>Color:</span>
                                    <span 
                                      className="w-3 h-3 rounded-full border border-black/20 shrink-0 inline-block" 
                                      style={{ background: item.color.hex }} 
                                    />
                                    <strong className="text-stone-900">{item.color.name}</strong>
                                  </p>
                                  <p>Length: <strong className="text-[#5B0F2A] font-bold">{item.size}</strong> · Qty: <strong>{item.quantity}</strong></p>
                                  {item.customNotes && (
                                    <p className="italic text-stone-600 bg-amber-50/70 p-1 rounded mt-1 border border-amber-200">
                                      Custom Measurements: "{item.customNotes}"
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {order.notes && (
                          <div className="p-3 bg-pink-50/60 border border-pink-200 rounded text-xs text-stone-800">
                            <span className="font-bold text-[#5B0F2A] block text-[11px]">Delivery & Tailoring Notes:</span>
                            <p className="mt-0.5">{order.notes}</p>
                          </div>
                        )}
                      </div>

                      {/* On-Website Message Thread with Customer */}
                      <div className="border-t border-stone-200 bg-stone-50 p-4 sm:p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-[#5B0F2A]" />
                            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                              Live On-Website Conversation with {order.customer.fullName}
                            </h4>
                          </div>
                          <a
                            href={`mailto:${order.customer.email}?subject=Al-Ikhlas Fashion Center - Order #${order.orderNumber}`}
                            className="text-[11px] text-[#5B0F2A] hover:underline flex items-center gap-1 font-semibold"
                          >
                            <Mail className="w-3 h-3" />
                            <span>Email Customer Directly</span>
                          </a>
                        </div>

                        {/* Messages Feed */}
                        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                          {messageList.length === 0 ? (
                            <p className="text-xs text-stone-400 italic text-center py-2">
                              No messages on this order yet.
                            </p>
                          ) : (
                            messageList.map((msg) => {
                              const isFromOwner = msg.sender === 'owner';
                              return (
                                <div 
                                  key={msg.id} 
                                  className={`flex flex-col ${isFromOwner ? 'items-end' : 'items-start'}`}
                                >
                                  <div className="text-[10px] text-stone-500 mb-0.5 px-1 flex items-center gap-1">
                                    <span className="font-semibold text-stone-700">
                                      {isFromOwner ? 'You (Al-Ikhlas Atelier)' : msg.senderName || order.customer.fullName}
                                    </span>
                                    <span>·</span>
                                    <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                  </div>
                                  <div 
                                    className={`p-3 rounded-lg text-xs max-w-[85%] leading-relaxed ${
                                      isFromOwner 
                                        ? 'bg-[#5B0F2A] text-white rounded-tr-xs shadow-2xs' 
                                        : 'bg-white text-stone-800 border border-stone-200 rounded-tl-xs shadow-2xs'
                                    }`}
                                  >
                                    {msg.text}
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>

                        {/* Owner Reply Input */}
                        <div className="pt-2 flex items-center gap-2">
                          <input
                            type="text"
                            value={ownerMessageInputs[order.id] || ''}
                            onChange={(e) => setOwnerMessageInputs(prev => ({ ...prev, [order.id]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleOwnerSendMessage(order.id);
                              }
                            }}
                            placeholder={`Reply to ${order.customer.fullName} on the website...`}
                            className="flex-1 text-xs py-2.5 px-3 border border-stone-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                          />
                          <button
                            type="button"
                            onClick={() => handleOwnerSendMessage(order.id)}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#5B0F2A] hover:bg-[#43091D] text-white text-xs font-bold rounded cursor-pointer transition-colors shadow-2xs"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Reply</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* SECTION: WEBSITE INQUIRIES & CONCIERGE */}
        {activeTabSection === 'inquiries' && (
          <div className="space-y-4">
            <div className="bg-white p-4 border border-stone-200 rounded-lg shadow-2xs flex items-center justify-between">
              <span className="text-xs text-stone-600">
                Direct buyer inquiries received through the on-website Concierge.
              </span>
              <span className="text-xs font-bold text-[#5B0F2A]">
                {inquiries.length} inquiry{inquiries.length === 1 ? '' : 's'} recorded
              </span>
            </div>

            {inquiries.length === 0 ? (
              <div className="bg-white p-12 text-center border border-stone-200 rounded-lg text-xs text-stone-500">
                No inquiries submitted yet.
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="bg-white border border-stone-200 rounded-lg p-5 shadow-2xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif-brand font-bold text-stone-900 text-base">
                            {inq.customerName}
                          </h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            inq.status === 'Replied' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {inq.status}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 flex items-center gap-2 mt-0.5">
                          <a href={`mailto:${inq.customerEmail}`} className="text-[#5B0F2A] font-mono hover:underline">
                            {inq.customerEmail}
                          </a>
                          <span>·</span>
                          <span>{new Date(inq.createdAt).toLocaleDateString()} {new Date(inq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </p>
                      </div>

                      {inq.productName && (
                        <div className="text-right text-xs">
                          <span className="font-bold text-stone-800 block">{inq.productName}</span>
                          <span className="text-[11px] text-stone-500">
                            Color: {inq.colorName || 'Default'} · Length: {inq.length || '54"'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Buyer Message */}
                    <div className="p-3 bg-stone-50 rounded border border-stone-200 text-xs text-stone-800">
                      <span className="text-[10px] font-bold uppercase text-stone-500 block">Customer Inquiry:</span>
                      <p className="mt-1 leading-relaxed">{inq.message}</p>
                    </div>

                    {/* Owner Existing Reply */}
                    {inq.ownerReply && (
                      <div className="p-3 bg-pink-50/70 border border-pink-200 rounded text-xs text-[#5B0F2A]">
                        <span className="text-[10px] font-bold uppercase text-[#5B0F2A] block">
                          Your Reply ({inq.repliedAt ? new Date(inq.repliedAt).toLocaleDateString() : ''}):
                        </span>
                        <p className="mt-1 leading-relaxed text-stone-800">{inq.ownerReply}</p>
                      </div>
                    )}

                    {/* Reply Input */}
                    <div className="pt-2 flex items-center gap-2">
                      <input
                        type="text"
                        value={inquiryReplyInputs[inq.id] || ''}
                        onChange={(e) => setInquiryReplyInputs(prev => ({ ...prev, [inq.id]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleInquiryReply(inq.id);
                          }
                        }}
                        placeholder={`Reply to ${inq.customerName}...`}
                        className="flex-1 text-xs py-2 px-3 border border-stone-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                      />
                      <button
                        type="button"
                        onClick={() => handleInquiryReply(inq.id)}
                        className="px-4 py-2 bg-[#5B0F2A] hover:bg-[#43091D] text-white text-xs font-bold rounded cursor-pointer transition-colors shadow-2xs"
                      >
                        Send Reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
