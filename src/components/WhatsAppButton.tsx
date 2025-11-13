// src/components/WhatsAppButton.tsx

import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {

  const defaultMessage = encodeURIComponent(
    "Olá! Visitei o site Awire Digital e gostaria de mais informações."
  );

  const whatsappLink = `https://wa.me/5563992747396?text=${defaultMessage}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contato WhatsApp AWIRE DIGITAL"
      
      className="
        fixed bottom-8 right-8 z-50
        w-20 h-20        
        bg-[#25D366]
        rounded-full flex items-center justify-center
        shadow-lg hover-lift hover:bg-green-700 transition-all
      "
    >
      <FaWhatsapp className="w-14 h-14 text-black" />   {/* 🔥 ícone maior */}
    </a>
  );
};

export default WhatsAppButton;
