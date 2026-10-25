import React, { useState } from 'react';
import { 
  Scissors, 
  ArrowRight,
  Mail, 
  Check, 
  Copy, 
  ExternalLink,
  ShoppingBag,
  MessageSquare,
  MapPin,
  Smartphone,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useShop, OFFICIAL_MOMO_NUMBER, OFFICIAL_MOMO_NAME } from '../../context/ShopContext';
import { ColorizedDressImage } from '../shop/ColorizedDressImage';
import { formatGHS } from '../../utils/productPricing';
import { 
  openEmailOrder, 
  createGmailWebUrl, 
  formatBookingSummary,
  SHOP_TARGET_EMAIL
} from '../../utils/sendWhatsAppOrder';

export const OrderSuccessView: React.FC = () => {
  const { lastCreatedOrder, setActiveTab, setCurrentCustomerEmail } = useShop();
  const [copied, setCopied] = useState(false);
  const [copiedTxId, setCopiedTxId] = useState(false);

  if (!lastCreatedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif-brand text-2xl text-stone-900 font-bold">No recent order found</h2>
        <p className="text-xs text-stone-500">
          You have not submitted an order in this active session.
        </p>
        <button
          onClick={() => setActiveTab('shop')}
          className="mt-4 px-6 py-2 bg-[#5B0F2A] text-white text-xs font-bold uppercase rounded cursor-pointer"
        >
          View All Dresses
        </button>
      </div>
    );
  }

  const order = lastCreatedOrder;
  const orderAmount = order.totalAmountGhs || 450;

  const { text: bookingSummaryText, subject: emailSubject } = formatBookingSummary({
    orderNumber: order.orderNumber,
    customer: order.customer,
    items: order.items,
    notes: `Payment via MoMo to 0541376807 (Tx ID: ${order.momoTransactionId || 'Pending'}). Total: ${formatGHS(orderAmount)}. Notes: ${order.notes || ''}`,
  });

  const handleSendEmail = () => {
    openEmailOrder({
      to: SHOP_TARGET_EMAIL,
      subject: emailSubject,
      body: bookingSummaryText,
    });
  };

  const gmailWebLink = createGmailWebUrl({
    to: SHOP_TARGET_EMAIL,
    subject: emailSubject,
    body: bookingSummaryText,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingSummaryText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-12 border-b border-stone-200/80">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Banner Card */}
        <div className="bg-white p-6 sm:p-8 border border-stone-200 shadow-sm rounded-lg text-center space-y-5">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-200 shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-xs uppercase tracking-widest text-[#5B0F2A] font-bold block">
            Order & MoMo Payment Transmitted to Owner
          </span>

          <h1 className="font-serif-brand text-3xl sm:text-4xl text-stone-900 font-bold">
            Thank you, {order.customer.fullName}!
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
            Your dress specifications and Mobile Money payment reference have been registered for our workshop at <strong>Oforikrom, Kumasi</strong>. The atelier owner will verify your payment on <strong>0541376807</strong> and initiate custom tailoring.
          </p>

          {/* MOBILE MONEY PAYMENT AUDIT BOX */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 border border-amber-300 rounded-lg p-4 sm:p-5 text-left text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
              <span className="font-bold text-stone-900 flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
                <Smartphone className="w-4 h-4 text-amber-700" />
                Mobile Money Payment Details Submitted
              </span>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                {order.paymentStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white/90 p-3 rounded border border-amber-200">
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-semibold block">Total Amount:</span>
                <strong className="font-mono text-base text-[#5B0F2A] font-black">{formatGHS(orderAmount)}</strong>
              </div>

              <div>
                <span className="text-[10px] text-stone-500 uppercase font-semibold block">MoMo Number Paid:</span>
                <strong className="font-mono text-stone-900 font-bold block">{OFFICIAL_MOMO_NUMBER}</strong>
                <span className="text-[10px] text-stone-500">{OFFICIAL_MOMO_NAME}</span>
              </div>

              <div>
                <span className="text-[10px] text-stone-500 uppercase font-semibold block">Your MoMo Reference:</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <strong className="font-mono text-stone-900 font-bold text-xs">
                    {order.momoTransactionId || 'Pending'}
                  </strong>
                  {order.momoTransactionId && (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(order.momoTransactionId!);
                        setCopiedTxId(true);
                        setTimeout(() => setCopiedTxId(false), 2000);
                      }}
                      className="text-stone-400 hover:text-stone-700 p-0.5"
                      title="Copy Transaction ID"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  )}
                  {copiedTxId && <span className="text-[9px] text-emerald-700 font-bold">Copied!</span>}
                </div>
                <span className="text-[10px] text-stone-500">Payer Phone: {order.momoSenderPhone || order.customer.phone}</span>
              </div>
            </div>

            <p className="text-[11px] text-stone-600">
              The owner verifies all incoming transfers sent to <strong>0541376807</strong>. You will receive real-time status updates right on the website.
            </p>
          </div>

          {/* Reference Badges */}
          <div className="pt-1 flex flex-wrap items-center justify-center gap-3 text-xs">
            <div className="bg-stone-50 border border-stone-200 px-4 py-2 rounded">
              <span className="text-stone-500 block text-[10px] uppercase font-semibold">Order Reference</span>
              <strong className="text-stone-900 font-mono text-sm">{order.orderNumber}</strong>
            </div>

            <div className="bg-stone-50 border border-stone-200 px-4 py-2 rounded">
              <span className="text-stone-500 block text-[10px] uppercase font-semibold">Destination City</span>
              <strong className="text-stone-900 font-medium">{order.customer.townCity}</strong>
            </div>

            <div className="bg-stone-50 border border-stone-200 px-4 py-2 rounded">
              <span className="text-stone-500 block text-[10px] uppercase font-semibold">Tailoring Status</span>
              <strong className="text-[#5B0F2A] font-bold">{order.orderStatus}</strong>
            </div>
          </div>

          {/* Direct Actions: View in My Orders & Send to Email */}
          <div className="pt-2 space-y-2.5">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <button
                onClick={() => {
                  if (order.customer.email) {
                    setCurrentCustomerEmail(order.customer.email);
                  }
                  setActiveTab('my-orders');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#5B0F2A] hover:bg-[#43091D] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-xs cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Track This Order in My Orders</span>
              </button>

              <button
                onClick={handleSendEmail}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-xs cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Send Copy to Boutique Email</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              <a
                href={gmailWebLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-semibold text-[11px] border border-stone-300 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-rose-700" />
                <span>Open in Gmail</span>
              </a>

              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-semibold text-[11px] border border-stone-300 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-stone-600" />
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Order Text'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Selected Garments details */}
        <div className="mt-8 bg-white p-6 sm:p-8 border border-stone-200 shadow-sm rounded-lg space-y-6">
          <h2 className="font-serif-brand text-xl text-stone-900 font-bold border-b border-stone-200 pb-3">
            Selected Dress Specifications
          </h2>

          <div className="space-y-4 divide-y divide-stone-100">
            {order.items.map((item) => (
              <div key={item.id} className="pt-4 first:pt-0 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-16 aspect-[3/4] bg-stone-100 border border-stone-200 rounded overflow-hidden shrink-0 relative">
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
                    <h4 className="font-serif-brand text-sm text-stone-900 font-bold">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-stone-600 flex items-center gap-1.5 mt-0.5">
                      <span>Length: <strong className="text-[#5B0F2A] font-bold">{item.size}</strong></span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <span>Color:</span>
                        <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: item.color.hex }} />
                        <strong className="text-stone-800 font-semibold">{item.color.name}</strong>
                      </span>
                    </p>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Quantity: {item.quantity} · Custom Bespoke Sewing
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery & Shop Address */}
          <div className="p-4 bg-pink-50 border border-pink-200 rounded text-xs space-y-2 text-stone-800">
            <div className="flex items-center gap-2 font-bold text-[#5B0F2A]">
              <MapPin className="w-4 h-4 text-[#5B0F2A]" />
              <span>Workshop Pickup & Delivery Information</span>
            </div>
            <p>
              Shop Location: <strong>Accra Town Behind the Central Mosque, Oforikrom, Kumasi</strong>.
            </p>
            <p className="text-stone-600">
              For deliveries outside Kumasi (Greater Accra, Tamale, Takoradi, etc.), we send via VIP / OA / Imperial Express bus parcels or direct courier dispatch.
            </p>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setActiveTab('shop')}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#5B0F2A] hover:underline cursor-pointer"
            >
              <span>Explore More Modest Dresses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
