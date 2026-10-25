import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Scissors, 
  MapPin, 
  MessageSquare, 
  Send, 
  Mail, 
  ChevronRight, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  UserCheck
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ColorizedDressImage } from '../shop/ColorizedDressImage';
import { createOrderEmailUrl, SHOP_TARGET_EMAIL } from '../../utils/sendWhatsAppOrder';

export const MyOrdersPage: React.FC = () => {
  const { 
    customerOrders, 
    orders,
    currentCustomerEmail, 
    setCurrentCustomerEmail, 
    addOrderMessage, 
    setActiveTab,
    isOwnerAuthenticated 
  } = useShop();

  const [inputEmail, setInputEmail] = useState(currentCustomerEmail);
  const [activeMessageOrderId, setActiveMessageOrderId] = useState<string | null>(null);
  const [messageInputs, setMessageInputs] = useState<Record<string, string>>({});

  const handleEmailSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputEmail.trim()) {
      setCurrentCustomerEmail(inputEmail.trim());
    }
  };

  const handleSendMessage = (orderId: string, customerName: string) => {
    const text = (messageInputs[orderId] || '').trim();
    if (!text) return;
    addOrderMessage(orderId, text, 'customer', customerName);
    setMessageInputs(prev => ({ ...prev, [orderId]: '' }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Order Confirmed':
      case 'Inquiry Received':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          step: 1
        };
      case 'Fabric Sourced':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          dot: 'bg-blue-500',
          step: 2
        };
      case 'Sewing in Progress':
        return {
          bg: 'bg-purple-50 text-purple-800 border-purple-200',
          dot: 'bg-purple-500',
          step: 3
        };
      case 'Ready for Pickup / Dispatch':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
          step: 4
        };
      case 'Delivered':
        return {
          bg: 'bg-stone-100 text-stone-800 border-stone-300',
          dot: 'bg-stone-500',
          step: 5
        };
      default:
        return {
          bg: 'bg-pink-50 text-[#5B0F2A] border-pink-200',
          dot: 'bg-[#5B0F2A]',
          step: 1
        };
    }
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-10 border-b border-stone-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-pink-50 text-[#5B0F2A] border border-pink-200 text-[11px] font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Customer Orders & Live Tailoring Status</span>
            </div>
            <h1 className="font-serif-brand text-3xl sm:text-4xl text-stone-900 font-bold">
              My Ordered Dresses
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Track your tailored dresses, monitor atelier sewing progress, and chat directly with our dressmakers on the website.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('shop')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#5B0F2A] hover:bg-[#43091D] text-white text-xs font-bold uppercase tracking-wider rounded cursor-pointer transition-colors shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Browse Catalog</span>
            </button>
            {isOwnerAuthenticated && (
              <button
                onClick={() => setActiveTab('owner-portal')}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-800 hover:bg-stone-900 text-amber-300 text-xs font-bold rounded cursor-pointer transition-colors"
              >
                <span>Switch to Owner View (All Orders)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Customer Identity Bar & Privacy Safeguard */}
        <div className="bg-white p-4 sm:p-5 border border-stone-200 rounded-lg shadow-2xs space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-8 h-8 rounded-full bg-pink-50 border border-pink-200 flex items-center justify-center text-[#5B0F2A] font-bold">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block">
                  Active Customer Account
                </span>
                <strong className="text-stone-900 text-xs sm:text-sm font-mono">
                  {currentCustomerEmail || 'Not set'}
                </strong>
              </div>
            </div>

            {/* Email Switcher / Lookup */}
            <form onSubmit={handleEmailSearch} className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="email"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  placeholder="Enter your customer email"
                  className="w-56 sm:w-64 text-xs py-2 pl-3 pr-8 border border-stone-300 rounded bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                />
                <Mail className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-3" />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 bg-[#5B0F2A] hover:bg-[#43091D] text-white text-xs font-bold rounded transition-colors cursor-pointer"
              >
                View
              </button>
            </form>
          </div>

          <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-500">
            <span className="flex items-center gap-1 text-emerald-800 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Strict Privacy: You can only view dresses and orders belonging to your email address.</span>
            </span>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="text-stone-400">Quick Test Accounts:</span>
              <button
                type="button"
                onClick={() => {
                  setInputEmail('mariama.baako@example.com');
                  setCurrentCustomerEmail('mariama.baako@example.com');
                }}
                className="text-[#5B0F2A] hover:underline cursor-pointer font-semibold"
              >
                Mariama (Kumasi)
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => {
                  setInputEmail('amina.d@example.com');
                  setCurrentCustomerEmail('amina.d@example.com');
                }}
                className="text-[#5B0F2A] hover:underline cursor-pointer font-semibold"
              >
                Amina (Accra)
              </button>
            </div>
          </div>
        </div>

        {/* Orders Listing */}
        {customerOrders.length === 0 ? (
          <div className="bg-white p-12 text-center border border-stone-200 rounded-lg shadow-2xs space-y-4">
            <div className="w-14 h-14 bg-pink-50 text-[#5B0F2A] rounded-full flex items-center justify-center mx-auto border border-pink-200">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="font-serif-brand text-2xl text-stone-900 font-bold">
              No orders found for this email
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
              We couldn't find any orders placed under <strong>{currentCustomerEmail}</strong>. If you used a different email during booking, please enter it above.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setActiveTab('shop')}
                className="px-5 py-2.5 bg-[#5B0F2A] hover:bg-[#43091D] text-white text-xs font-bold uppercase tracking-wider rounded cursor-pointer transition-colors"
              >
                Explore Dresses Catalog
              </button>
              <button
                onClick={() => {
                  setInputEmail('mariama.baako@example.com');
                  setCurrentCustomerEmail('mariama.baako@example.com');
                }}
                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded cursor-pointer transition-colors"
              >
                Load Sample Order (Mariama Baako)
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-stone-600 px-1">
              <span>Showing <strong>{customerOrders.length}</strong> active order{customerOrders.length > 1 ? 's' : ''}</span>
              <span className="font-mono text-[11px] text-[#5B0F2A] font-bold">Official Boutique Email: {SHOP_TARGET_EMAIL}</span>
            </div>

            {customerOrders.map((order) => {
              const statusInfo = getStatusBadge(order.orderStatus);
              const messageList = order.messages || [];

              return (
                <div 
                  key={order.id} 
                  className="bg-white border border-stone-200 rounded-lg shadow-2xs overflow-hidden transition-all hover:border-stone-300"
                >
                  {/* Order Top Bar */}
                  <div className="p-4 sm:p-5 bg-stone-50/80 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono text-sm sm:text-base font-bold text-stone-900">
                          Order #{order.orderNumber}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusInfo.bg}`}>
                          <span className={`w-2 h-2 rounded-full ${statusInfo.dot}`} />
                          <span>{order.orderStatus}</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 flex flex-wrap items-center gap-2">
                        <span>Placed on: {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span>·</span>
                        <span>Tracking Code: <strong className="font-mono text-stone-800">{order.trackingNumber}</strong></span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-stone-700">
                          <MapPin className="w-3 h-3 text-[#5B0F2A]" />
                          <span>{order.customer.townCity}</span>
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={createOrderEmailUrl({
                          subject: `Question regarding Order #${order.orderNumber} - ${order.customer.fullName}`,
                          body: `Hello Al-Ikhlas Atelier,\n\nI have a question about my dress Order #${order.orderNumber}:\n\n`
                        })}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 rounded text-xs font-semibold transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5 text-[#5B0F2A]" />
                        <span>Email Atelier</span>
                      </a>
                    </div>
                  </div>

                  {/* Production Step Progression Bar */}
                  <div className="px-5 py-4 bg-pink-50/40 border-b border-stone-100">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-2.5">
                      Atelier Sewing & Crafting Milestones:
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {[
                        { title: '1. Order Confirmed', desc: 'Dress specs & measurements received' },
                        { title: '2. Fabric Sourced', desc: 'High-grade crepe cut' },
                        { title: '3. Sewing in Progress', desc: 'Stitching pleats & hems' },
                        { title: '4. Ready for Dispatch', desc: 'Pickup / Bus delivery' }
                      ].map((step, idx) => {
                        const isDone = statusInfo.step > idx + 1;
                        const isCurrent = statusInfo.step === idx + 1;
                        return (
                          <div 
                            key={idx} 
                            className={`p-2.5 rounded border text-left transition-all ${
                              isCurrent 
                                ? 'bg-white border-[#5B0F2A] shadow-xs' 
                                : isDone 
                                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' 
                                : 'bg-stone-50 border-stone-200 opacity-60 text-stone-500'
                            }`}
                          >
                            <span className={`block font-bold text-[11px] ${isCurrent ? 'text-[#5B0F2A]' : isDone ? 'text-emerald-800' : 'text-stone-700'}`}>
                              {isDone ? '✓ ' : ''}{step.title}
                            </span>
                            <span className="block text-[10px] text-stone-500 mt-0.5">
                              {step.desc}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ordered Dresses List */}
                  <div className="p-5 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                      Ordered Dresses ({order.items.length})
                    </h4>

                    <div className="space-y-4 divide-y divide-stone-100">
                      {order.items.map((item) => (
                        <div key={item.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-20 bg-stone-100 border border-stone-200 rounded overflow-hidden shrink-0 relative">
                              <ColorizedDressImage
                                baseImage={item.image}
                                color={item.color}
                                alt={`${item.name} in ${item.color.name}`}
                                showBadge={false}
                                className="w-full h-full object-cover object-top"
                                containerClassName="w-full h-full relative"
                              />
                            </div>
                            <div>
                              <h5 className="font-serif-brand text-sm sm:text-base text-stone-900 font-bold">
                                {item.name}
                              </h5>
                              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-stone-600">
                                <span className="flex items-center gap-1 font-semibold text-stone-800">
                                  <span>Length:</span>
                                  <strong className="text-[#5B0F2A] font-bold">{item.size}</strong>
                                </span>
                                <span>·</span>
                                <span className="flex items-center gap-1.5">
                                  <span>Color:</span>
                                  <span 
                                    className="w-3 h-3 rounded-full border border-black/20 shrink-0 inline-block" 
                                    style={{ 
                                      background: item.color.secondaryHex 
                                        ? `linear-gradient(135deg, ${item.color.hex} 50%, ${item.color.secondaryHex} 50%)`
                                        : item.color.hex 
                                    }} 
                                  />
                                  <strong className="text-stone-800 font-semibold">{item.color.name}</strong>
                                </span>
                                <span>·</span>
                                <span>Qty: <strong>{item.quantity}</strong></span>
                              </div>

                              {item.customNotes && (
                                <p className="mt-1 text-[11px] text-stone-500 italic bg-stone-50 p-1.5 rounded border border-stone-200 max-w-md">
                                  Tailoring note: "{item.customNotes}"
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="self-end sm:self-center text-right shrink-0">
                            <span className="text-xs font-bold text-[#5B0F2A] block">
                              Custom Sewing Order
                            </span>
                            <span className="text-[10px] text-stone-500">
                              Payment: {order.paymentStatus}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {order.notes && (
                      <div className="p-3 bg-stone-50 rounded border border-stone-200 text-xs text-stone-600">
                        <strong className="text-stone-800 block text-[11px] font-bold">Delivery & Fitting Notes:</strong>
                        <p className="mt-0.5">{order.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Direct On-Website Tailoring Discussion Feed */}
                  <div className="border-t border-stone-200 bg-stone-50/50 p-4 sm:p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-[#5B0F2A]" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                          Direct Communication with Owner (On-Website)
                        </h4>
                      </div>
                      <span className="text-[11px] text-stone-500">
                        {messageList.length} message{messageList.length === 1 ? '' : 's'}
                      </span>
                    </div>

                    {/* Chat Messages */}
                    <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                      {messageList.length === 0 ? (
                        <div className="text-center py-4 text-xs text-stone-500 italic">
                          No messages yet. Send a question to the boutique owner below!
                        </div>
                      ) : (
                        messageList.map((msg) => {
                          const isFromOwner = msg.sender === 'owner';
                          return (
                            <div 
                              key={msg.id} 
                              className={`flex flex-col ${isFromOwner ? 'items-start' : 'items-end'}`}
                            >
                              <div className="text-[10px] text-stone-500 mb-0.5 px-1 flex items-center gap-1.5">
                                <span className="font-semibold text-stone-700">
                                  {isFromOwner ? 'Al-Ikhlas Atelier (Owner)' : msg.senderName || 'You'}
                                </span>
                                <span>·</span>
                                <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <div 
                                className={`p-3 rounded-lg text-xs max-w-[85%] leading-relaxed ${
                                  isFromOwner 
                                    ? 'bg-white text-stone-800 border border-stone-200 rounded-tl-xs shadow-2xs' 
                                    : 'bg-[#5B0F2A] text-white rounded-tr-xs shadow-2xs'
                                }`}
                              >
                                {msg.text}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Message input */}
                    <div className="pt-2 flex items-center gap-2">
                      <input
                        type="text"
                        value={messageInputs[order.id] || ''}
                        onChange={(e) => setMessageInputs(prev => ({ ...prev, [order.id]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSendMessage(order.id, order.customer.fullName);
                          }
                        }}
                        placeholder="Write a message or custom tailoring request to the owner..."
                        className="flex-1 text-xs py-2.5 px-3 border border-stone-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#5B0F2A]"
                      />
                      <button
                        type="button"
                        onClick={() => handleSendMessage(order.id, order.customer.fullName)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#5B0F2A] hover:bg-[#43091D] text-white text-xs font-bold rounded cursor-pointer transition-colors shadow-2xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Send</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
