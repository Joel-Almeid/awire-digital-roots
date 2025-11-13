import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Lightbox from "@/components/Lightbox";

import heroBackground from "@/assets/hero-background.jpg";
import foto1 from "@/assets/foto-1.jpg";
import foto2 from "@/assets/foto-2.jpg";
import foto3 from "@/assets/foto-3.jpg";
import foto4 from "@/assets/foto-4.jpg";
import foto5 from "@/assets/foto-5.jpg";
import foto6 from "@/assets/foto-6.jpg";
import foto7 from "@/assets/foto-7.jpg";
import foto8 from "@/assets/foto-8.jpg";

const Fotos = () => {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const galleryItems = [
    { type: "video" as const, src: "/videos/projeto-video.mp4", alt: "Vídeo do Projeto AWIRE DIGITAL" },
    { type: "image" as const, src: foto1, alt: "Apresentação do Projeto AWIRE DIGITAL" },
    { type: "image" as const, src: foto2, alt: "Equipe do projeto navegando no rio" },
    { type: "image" as const, src: foto3, alt: "Estudantes em aula de educação digital" },
    { type: "image" as const, src: foto4, alt: "Entrega de materiais do projeto" },
    { type: "image" as const, src: foto5, alt: "Estudantes participando das atividades" },
    { type: "image" as const, src: foto6, alt: "Laboratório de informática na aldeia" },
    { type: "image" as const, src: foto7, alt: "Professor apresentando conteúdo digital" },
    { type: "image" as const, src: foto8, alt: "Alunos em atividade de alfabetização digital" },
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
            {galleryItems.map((item, index) => (
              <div
                key={index}
                className="aspect-square overflow-hidden rounded-lg shadow-md cursor-pointer hover-lift animate-fade-in relative"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => item.type === "image" && setLightboxImage(item.src)}
              >
                {item.type === "video" ? (
                  <video
                    src={item.src}
                    className="w-full h-full object-cover"
                    controls
                    preload="metadata"
                  >
                    Seu navegador não suporta vídeos.
                  </video>
                ) : (
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                )}
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
