import React from 'react';
import { X, Ruler, Scissors, MessageCircle, MapPin } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen, openWhatsAppModal } = useShop();

  if (!isSizeGuideOpen) return null;

  const abayaGuide = [
    { heightFeet: '4ft 11in – 5ft 0in', heightCm: '150 – 152 cm', length: '50 inches', advice: 'Ankle length for petite sisters' },
    { heightFeet: '5ft 1in – 5ft 2in', heightCm: '155 – 157 cm', length: '52 inches', advice: 'Standard petite floor sweep' },
    { heightFeet: '5ft 3in – 5ft 4in', heightCm: '160 – 162 cm', length: '54 inches', advice: 'Most popular standard Ghana size' },
    { heightFeet: '5ft 5in – 5ft 6in', heightCm: '165 – 167 cm', length: '56 inches', advice: 'Ideal for taller sisters or with low heels' },
    { heightFeet: '5ft 7in – 5ft 8in', heightCm: '170 – 172 cm', length: '58 inches', advice: 'Tall silhouette with graceful drape' },
    { heightFeet: '5ft 9in – 5ft 11in', heightCm: '175 – 180 cm', length: '60 inches', advice: 'Extra tall floor-length coverage' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
      <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200 rounded-lg space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div>
            <h3 className="font-serif-brand text-2xl text-stone-900 font-bold">
              Abaya & Dress Length Guide
            </h3>
            <span className="text-xs text-[#5B0F2A] font-semibold">
              Al-Ikhlas Fashion Center · Oforikrom, Ghana
            </span>
          </div>

          <button 
            onClick={() => setIsSizeGuideOpen(false)}
            className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Measurement Table */}
        <div className="overflow-x-auto border border-stone-200 rounded">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF9F5] text-stone-800 font-bold uppercase text-[10px] tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-2.5 px-3">Your Height (Feet)</th>
                <th className="py-2.5 px-3">Height (Centimeters)</th>
                <th className="py-2.5 px-3">Recommended Abaya Length</th>
                <th className="py-2.5 px-3">Fit Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
              {abayaGuide.map((row) => (
                <tr key={row.length} className="hover:bg-pink-50/50">
                  <td className="py-2.5 px-3 font-semibold text-stone-900 font-sans">{row.heightFeet}</td>
                  <td className="py-2.5 px-3 text-stone-600">{row.heightCm}</td>
                  <td className="py-2.5 px-3 text-[#5B0F2A] font-bold text-xs">{row.length}</td>
                  <td className="py-2.5 px-3 text-stone-600 font-sans text-[11px]">{row.advice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Measuring Instructions */}
        <div className="p-4 bg-pink-50 border border-pink-200 rounded space-y-2 text-xs text-stone-700">
          <span className="font-bold text-[#5B0F2A] block">How to Measure at Home:</span>
          <p>• <strong>Shoulder to Floor:</strong> Stand straight against a wall without shoes. Place measuring tape at the top center of your shoulder and measure down to the top of your foot/ankle.</p>
          <p>• <strong>Heels & Wedges:</strong> If you plan to wear high heels with your abaya, we recommend choosing one size longer (e.g. 56" instead of 54").</p>
          <p>• <strong>Walk-in Fitting:</strong> You can also come to our shop at <strong>Oforikrom, Accra Town Behind Central Mosque</strong>, where our tailors will take your exact measurements free of charge!</p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-3">
          <button
            onClick={() => {
              setIsSizeGuideOpen(false);
              openWhatsAppModal();
            }}
            className="text-xs text-[#5B0F2A] font-semibold hover:underline cursor-pointer flex items-center gap-1"
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Send your measurements to our Atelier on the website →</span>
          </button>

          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="px-5 py-2 bg-[#5B0F2A] text-white text-xs font-bold cursor-pointer rounded uppercase"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
