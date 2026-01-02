import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, MessageCircle, ChevronRight, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Lightbox from "@/components/Lightbox";
import { getArtesanatoById, getArtesaoById, Artesanato, Artesao } from "@/lib/firestore";

const ArtesanatoDetalhe = () => {
  const { id } = useParams();
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string>("");
  const [product, setProduct] = useState<Artesanato | null>(null);
  const [artesao, setArtesao] = useState<Artesao | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      if (!id) return;
      
      setLoading(true);
      const productData = await getArtesanatoById(id);
      
      if (!isMounted) return;

      if (productData) {
        setProduct(productData);
        // Definir a primeira imagem como principal
        if (productData.imageUrls && productData.imageUrls.length > 0) {
          setMainImage(productData.imageUrls[0]);
        }
        
        // Buscar dados do artesão
        if (productData.artesaoId) {
          const artesaoData = await getArtesaoById(productData.artesaoId);
          if (isMounted) {
            setArtesao(artesaoData);
          }
        }
      }
      
      if (isMounted) {
        setLoading(false);
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando produto...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Produto não encontrado.</p>
            <Link to="/artesanato">
              <Button>Voltar para Galeria</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Filtrar apenas URLs válidas
  const validImages = product.imageUrls?.filter(url => url && url.trim() !== "") || [];

  // Configurar WhatsApp com mensagem pré-preenchida
  const whatsappNumber = artesao?.whatsapp?.replace(/\D/g, "") || "5563992747396";
  const whatsappMessage = `Olá, tenho interesse no artesanato: ${product.nome}. Poderia me dar mais informações sobre preço e envio?`;
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  // Meta tags para SEO
  const pageTitle = `${product.nome} - AWIRE DIGITAL`;
  const pageDescription = product.descricao.substring(0, 160);
  const pageImage = validImages[0] || "";

  // Schema.org JSON-LD para o produto (Dados Estruturados)
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.nome,
    "description": product.descricao,
    "image": validImages,
    "brand": {
      "@type": "Brand",
      "name": "Awire Digital"
    },
    "manufacturer": {
      "@type": "Person",
      "name": artesao?.nome || product.artesaoNome,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": product.aldeia,
        "addressRegion": "Tocantins",
        "addressCountry": "BR"
      }
    },
    "category": product.categoria,
    "countryOfOrigin": "BR",
    "isHandmade": true
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:type" content="product" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

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
                className="aspect-square overflow-hidden rounded-lg mb-4 cursor-pointer hover-lift relative"
                onClick={() => mainImage && setLightboxImage(mainImage)}
              >
                {mainImage ? (
                  <>
                    <img
                      src={mainImage}
                      alt={`${product.nome} - Artesanato Indígena ${product.aldeia || ''} - Projeto Awire Digital`}
                      title={`${product.nome} - Artesanato Indígena ${product.aldeia || ''} - Projeto Awire Digital`}
                      className="w-full h-full object-cover"
                    />
                    {/* Watermark */}
                    <div className="absolute bottom-3 right-3 bg-background/60 backdrop-blur-sm px-3 py-1.5 rounded text-sm text-foreground/70 font-medium pointer-events-none">
                      Awire Digital
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">Sem imagem</p>
                  </div>
                )}
              </div>
              
              {/* Thumbnails */}
              {validImages.length > 1 && (
                <div className="grid grid-cols-3 gap-4">
                  {validImages.map((image, index) => (
                    <div
                      key={index}
                      className={`aspect-square overflow-hidden rounded-lg cursor-pointer hover-lift relative ${
                        mainImage === image ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setMainImage(image)}
                    >
                      <img
                        src={image}
                        alt={`${product.nome} - Artesanato Indígena ${product.aldeia || ''} - Imagem ${index + 1} - Projeto Awire Digital`}
                        title={`${product.nome} - Artesanato Indígena ${product.aldeia || ''} - Projeto Awire Digital`}
                        className="w-full h-full object-cover"
                      />
                      {/* Watermark on thumbnails */}
                      <div className="absolute bottom-1 right-1 bg-background/60 backdrop-blur-sm px-1 py-0.5 rounded text-[10px] text-foreground/60 font-medium pointer-events-none">
                        Awire Digital
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-4">{product.nome}</h1>
              
              <div className="flex gap-2 mb-6">
                <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded">{product.categoria}</span>
                <span className="text-sm bg-secondary/50 text-foreground px-3 py-1 rounded">{product.aldeia}</span>
              </div>

              {/* Artisan Card - Fully Clickable with Hover Animation */}
              <Link to={`/artesao/${artesao?.id || product.artesaoId}`}>
                <Card className="p-6 bg-card border-border mb-6 cursor-pointer transition-all duration-300 ease-out group hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] hover:border-primary/30 active:scale-[0.99]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Sobre o Artesão</h3>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    {artesao?.fotoUrl ? (
                      <img
                        src={artesao.fotoUrl}
                        alt={artesao.nome}
                        className="w-16 h-16 rounded-full object-cover ring-2 ring-transparent group-hover:ring-primary/30 transition-all duration-300"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl ring-2 ring-transparent group-hover:ring-primary/30 transition-all duration-300">
                        {(artesao?.nome || product.artesaoNome).charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                        {artesao?.nome || product.artesaoNome}
                      </p>
                      <p className="text-sm text-muted-foreground">Aldeia {artesao?.aldeia || product.aldeia}</p>
                    </div>
                  </div>
                </Card>
              </Link>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">Sobre esta peça</h3>
                <div className="text-muted-foreground space-y-4 whitespace-pre-line">
                  {product.descricao}
                </div>
              </div>

              {/* WhatsApp Button */}
              <div className="flex gap-3">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Falar com o Artesão
                  </Button>
                </a>
                <a 
                  href={`https://wa.me/?text=${encodeURIComponent(`Olha que arte incrível do povo Iny: ${product.nome} - ${window.location.href}`)}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button 
                    variant="outline" 
                    className="h-full px-4 py-6 border-primary text-primary hover:bg-primary/10"
                    title="Compartilhar no WhatsApp"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </a>
              </div>

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
