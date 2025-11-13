import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Lightbox from "@/components/Lightbox";

import cocar from "@/assets/cocar.jpg";
import colar from "@/assets/colar.jpg";
import pulseira from "@/assets/pulseira.jpg";

const ArtesanatoDetalhe = () => {
  const { id } = useParams();
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState(cocar);

  // Mock data - será substituído por dados do Firebase
  const product = {
    id: 1,
    name: "Cocar Tradicional Javaé",
    images: [cocar, colar, pulseira],
    description: `Este magnífico cocar tradicional representa séculos de cultura e tradição do povo Javaé. 

Confeccionado artesanalmente com penas naturais cuidadosamente selecionadas, cada peça carrega consigo a história e identidade cultural de nossos ancestrais.

O processo de criação envolve técnicas passadas de geração em geração, onde cada pena é tratada com respeito e colocada seguindo padrões geométricos sagrados. As cores vibrantes das penas são obtidas naturalmente, sem o uso de produtos químicos.

Este cocar não é apenas um adorno, mas um símbolo de força, coragem e conexão com a natureza. Tradicionalmente usado em cerimônias e rituais importantes, hoje também pode ser apreciado como uma obra de arte única que preserva e celebra nossa cultura.

Ao adquirir esta peça, você não apenas leva para casa um artesanato de qualidade excepcional, mas também contribui diretamente para a valorização e manutenção das tradições indígenas da Ilha do Bananal.`,
    artisan: {
      name: "Aranã Txuiri",
      photo: cocar,
      village: "Txuiri",
      whatsapp: "5563992747396"
    },
    category: "Adornos",
  };

  const whatsappMessage = `Olá! Tenho interesse no produto: ${product.name}`;
  const whatsappLink = `https://wa.me/${product.artisan.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen">
      <Navigation />
      <WhatsAppButton />

      {/* Breadcrumb */}
      <section className="bg-secondary/30 py-6 mt-20">
        <div className="container mx-auto px-4 lg:px-8">
          <Link to="/artesanato" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Galeria
          </Link>
        </div>
      </section>

      {/* Product Detail */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Gallery */}
            <div>
              <div 
                className="aspect-square overflow-hidden rounded-lg mb-4 cursor-pointer hover-lift"
                onClick={() => setLightboxImage(mainImage)}
              >
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className={`aspect-square overflow-hidden rounded-lg cursor-pointer hover-lift ${
                      mainImage === image ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setMainImage(image)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-4">{product.name}</h1>
              
              <div className="flex gap-2 mb-6">
                <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded">{product.category}</span>
              </div>

              {/* Artisan Card */}
              <Card className="p-6 bg-card border-border mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Sobre o Artesão</h3>
                <div className="flex items-center gap-4">
                  <img
                    src={product.artisan.photo}
                    alt={product.artisan.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{product.artisan.name}</p>
                    <p className="text-sm text-muted-foreground">Aldeia {product.artisan.village}</p>
                  </div>
                </div>
              </Card>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">Sobre esta peça</h3>
                <div className="text-muted-foreground space-y-4 whitespace-pre-line">
                  {product.description}
                </div>
              </div>

              {/* WhatsApp Button */}
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Falar com o Artesão no WhatsApp
                </Button>
              </a>

              <p className="text-sm text-muted-foreground text-center mt-4">
                Entre em contato para negociar preço, frete e forma de pagamento
              </p>
            </div>
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

export default ArtesanatoDetalhe;
