import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, MessageCircle } from "lucide-react";
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
                className="aspect-square overflow-hidden rounded-lg mb-4 cursor-pointer hover-lift"
                onClick={() => mainImage && setLightboxImage(mainImage)}
              >
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={product.nome}
                    className="w-full h-full object-cover"
                  />
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
                      className={`aspect-square overflow-hidden rounded-lg cursor-pointer hover-lift ${
                        mainImage === image ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setMainImage(image)}
                    >
                      <img
                        src={image}
                        alt={`${product.nome} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
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

              {/* Artisan Card - Fully Clickable */}
              <Link to={`/artesao/${artesao?.id || product.artesaoId}`}>
                <Card className="p-6 bg-card border-border mb-6 cursor-pointer hover:bg-card/80 transition-colors group">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Sobre o Artesão</h3>
                  <div className="flex items-center gap-4">
                    {artesao?.fotoUrl ? (
                      <img
                        src={artesao.fotoUrl}
                        alt={artesao.nome}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                        {(artesao?.nome || product.artesaoNome).charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
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
