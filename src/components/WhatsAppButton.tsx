// src/components/WhatsAppButton.tsx

import { FaWhatsapp } from "react-icons/fa";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const WhatsAppButton = () => {
  const defaultMessage = encodeURIComponent(
    "Olá! Visitei o site Awire Digital e gostaria de mais informações."
  );

  const whatsappLink = `https://wa.me/5563992747396?text=${defaultMessage}`;

  const handleClick = () => {
    // Google Analytics event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click_whatsapp', {
        event_category: 'engagement',
        event_label: 'WhatsApp Button Click'
      });
    }
  };

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contato WhatsApp AWIRE DIGITAL"
      onClick={handleClick}
      className="
        fixed bottom-8 right-8 z-50
        w-16 h-16 md:w-20 md:h-20        
        bg-[#25D366]
        rounded-full flex items-center justify-center
        shadow-lg hover-lift hover:bg-green-700 transition-all
        scale-90 md:scale-100
      "
    >
      <FaWhatsapp className="w-10 h-10 md:w-14 md:h-14 text-black" />
    </a>
  );
};

export default WhatsAppButton;
