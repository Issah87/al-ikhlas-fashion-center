import React from 'react';
import { BuyDressModal } from './BuyDressModal';

/**
 * Re-exports BuyDressModal to replace inquiry flow with direct buying and order placement
 */
export const WebsiteInquiryModal: React.FC = () => {
  return <BuyDressModal />;
};
