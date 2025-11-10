import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Lightbox from "@/components/Lightbox";

import heroBackground from "@/assets/hero-background.jpg";
import sectionBg1 from "@/assets/section-background-1.jpg";
import sectionBg2 from "@/assets/section-background-2.jpg";
import sectionBg3 from "@/assets/section-background-3.jpg";
import cocar from "@/assets/cocar.jpg";
import colar from "@/assets/colar.jpg";
import pulseira from "@/assets/pulseira.jpg";

const Fotos = () => {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const photos = [
    { src: heroBackground, alt: "Paisagem da Ilha do Bananal" },
    { src: sectionBg1, alt: "Floresta Amazônica" },
    { src: sectionBg2, alt: "Aldeia Indígena" },
    { src: sectionBg3, alt: "Artesanato Indígena" },
    { src: cocar, alt: "Cocar Tradicional" },
    { src: colar, alt: "Colar de Miçangas" },
    { src: pulseira, alt: "Pulseira Artesanal" },
    { src: heroBackground, alt: "Natureza da Região" },
    { src: sectionBg1, alt: "Rio na Ilha do Bananal" },
    { src: sectionBg2, alt: "Comunidade Indígena" },
    { src: sectionBg3, alt: "Arte e Cultura" },
    { src: cocar, alt: "Artesanato Tradicional" },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        
        <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 animate-fade-in-up">
            Galeria de <span className="text-primary">Fotos</span>
          </h1>
          <p className="text-xl text-foreground/90 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Momentos e memórias do Projeto AWIRE DIGITAL
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="aspect-square overflow-hidden rounded-lg shadow-md cursor-pointer hover-lift animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => setLightboxImage(photo.src)}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Lightbox */}
      {lightboxImage && (
        <Lightbox
          image={lightboxImage}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </div>
  );
};

export default Fotos;
