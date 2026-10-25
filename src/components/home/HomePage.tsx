import React from 'react';
import { JumiaHeroSection } from './JumiaHeroSection';
import { JumiaQuickLinks } from './JumiaQuickLinks';
import { JumiaFlashSales } from './JumiaFlashSales';
import { JumiaProductShelf } from './JumiaProductShelf';
import { JumiaTrustBar } from './JumiaTrustBar';
import { BrandStory } from './BrandStory';
import { useShop } from '../../context/ShopContext';

export const HomePage: React.FC = () => {
  const { products } = useShop();

  // Curated shelf product subsets
  const bestsellers = products.filter(p => p.bestseller || p.isFeatured);
  const straightDresses = products.filter(p => p.category === 'Straight Abayas & Dresses');
  const gatheredBoubous = products.filter(p => p.category === 'Gathered Abayas');
  const pleatedAndCapelets = products.filter(
    p => p.category === 'Pleated Abayas' || p.category === 'Capelet & Two-Piece Sets'
  );

  return (
    <div className="w-full bg-[#FAF9F5]">
      {/* 1. Jumia 3-Column Hero Section */}
      <JumiaHeroSection />

      {/* 2. Jumia Quick Links Icon Bar */}
      <JumiaQuickLinks />

      {/* 3. Jumia Flash Sales with Live Countdown */}
      <JumiaFlashSales />

      {/* 4. Jumia Shelf: Top Selling Abayas in Ghana */}
      <JumiaProductShelf
        title="Top Selling Abayas & Boubous"
        subtitle="Handcrafted in Oforikrom, Kumasi"
        badge="BESTSELLERS"
        headerBg="bg-[#43091D]"
        products={bestsellers.length > 0 ? bestsellers : products}
        categoryFilter="All"
      />

      {/* 5. Jumia Shelf: Straight Cut Dresses */}
      <JumiaProductShelf
        title="Straight Cut Modest Abayas"
        subtitle="Clean columns, tailored piping & everyday comfort"
        badge="MINIMALIST"
        headerBg="bg-[#1A2E35]"
        products={straightDresses.length > 0 ? straightDresses : products.slice(2, 8)}
        categoryFilter="Straight Abayas & Dresses"
      />

      {/* 6. Jumia Shelf: Gathered Boubous & Gowns */}
      <JumiaProductShelf
        title="Senegalese-Inspired Gathered Boubous"
        subtitle="Tiered flow, smocked cuffs & royal drape"
        badge="FLOWING"
        headerBg="bg-[#3D2817]"
        products={gatheredBoubous.length > 0 ? gatheredBoubous : products.slice(4, 10)}
        categoryFilter="Gathered Abayas"
      />

      {/* 7. Jumia Shelf: Pleated & Capelet Sets */}
      <JumiaProductShelf
        title="Pleated Luxury & Capelet Two-Piece Sets"
        subtitle="Accordion sunburst pleats and two-tone capelet overlays"
        badge="EID COUTURE"
        headerBg="bg-[#5B0F2A]"
        products={pleatedAndCapelets.length > 0 ? pleatedAndCapelets : products.slice(0, 6)}
        categoryFilter="Capelet & Two-Piece Sets"
      />

      {/* 8. Jumia Trust & Guarantees Bar */}
      <JumiaTrustBar />

      {/* 9. Atelier Brand Story & Flyer Highlights */}
      <BrandStory />
    </div>
  );
};
