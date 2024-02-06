// WhatsAppChatButton.tsx
'use client'
import { formatPrice } from '@/lib/utils';
import React from 'react';

interface Product {
  name: string;
  price: number;
  description: string | null | undefined;
}

interface WhatsAppChatButtonProps {
  product: Product;
  productUrl: string;
}

const WhatsAppChatButton: React.FC<WhatsAppChatButtonProps> = ({ product, productUrl }) => {
  const openWhatsAppChat = () => {
    const message = `Check out this product: ${product.name}\nPrice: ${formatPrice(product.price)}\nDescription: ${product.description}\nProduct URL: ${productUrl}`;
    const whatsappURL = `https://wa.me/7356323421?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
  };

  return (
    <button
      onClick={openWhatsAppChat}
      className='inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
    >
      Chat for Details
    </button>
  );
};

export default WhatsAppChatButton;
