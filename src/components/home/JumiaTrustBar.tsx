import React from 'react';
import { Truck, Smartphone, Scissors, ShieldCheck, Mail, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const JumiaTrustBar: React.FC = () => {
  const { setIsFlyerModalOpen, setIsSizeGuideOpen } = useShop();

  const trustItems = [
    {
      icon: <Truck className="w-6 h-6 text-[#5B0F2A]" />,
      title: 'Nationwide Delivery',
      desc: 'Accra, Kumasi, Tamale & all 16 regions in Ghana',
      action: () => setIsFlyerModalOpen(true),
    },
    {
      icon: <Smartphone className="w-6 h-6 text-amber-600" />,
      title: 'Mobile Money (0541376807)',
      desc: 'Send payment via MoMo to 0541376807 before sending order',
      action: undefined,
    },
    {
      icon: <Scissors className="w-6 h-6 text-emerald-700" />,
      title: 'Custom Sizing (50"-60")',
      desc: 'Tailored to your exact height & measurements',
      action: () => setIsSizeGuideOpen(true),
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-700" />,
      title: 'Seen by Atelier Owner',
      desc: 'Every order verified by owner with on-website message thread',
      action: undefined,
    },
  ];

  return (
    <div className="bg-[#FAF9F5] pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-stone-200/90 rounded-sm p-4 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-stone-100">
            {trustItems.map((item, idx) => (
              <div
                key={idx}
                onClick={item.action}
                className={`flex items-start gap-3 p-2 ${item.action ? 'cursor-pointer hover:bg-stone-50' : ''} transition-colors rounded-xs`}
              >
                <div className="p-2.5 bg-stone-50 rounded-xs shrink-0 border border-stone-100">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-stone-500 leading-snug mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
