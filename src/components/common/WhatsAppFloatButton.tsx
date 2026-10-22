import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';

export const WhatsAppFloatButton: React.FC = () => {
  const { settings, t } = useApp();

  const cleanNumber = (settings.whatsappNumber || '').replace(/[^0-9]/g, '');
  const greeting = encodeURIComponent(
    `Hello ${settings.shopName}! I would like to inquire about customized notebooks and order details.`
  );
  const waUrl = `https://wa.me/${cleanNumber}?text=${greeting}`;

  return (
    <div className="fixed bottom-5 right-5 z-40 group">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order or Inquire on WhatsApp"
        className="flex items-center gap-2 px-3.5 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-medium text-xs sm:text-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline font-semibold">
          {t('WhatsApp Inquiry', 'واٹس ایپ رابطہ')}
        </span>
      </a>
    </div>
  );
};
