import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, MessageCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getArtesaoById, getArtesanatosByArtesaoId, Artesanato, Artesao } from "@/lib/firestore";

const ArtesaoPerfil = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artesao, setArtesao] = useState<Artesao | null>(null);
  const [products, setProducts] = useState<Artesanato[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!id) return;
      
      setLoading(true);
      
      try {
        const artesaoData = await getArtesaoById(id);
        if (!isMounted) return;
        setArtesao(artesaoData);

        if (artesaoData) {
          const productsData = await getArtesanatosByArtesaoId(id);
          if (!isMounted) return;
          setProducts(productsData);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do artesão:", error);
      }
      
      if (isMounted) {
        setLoading(false);
      }
    };

    loadData();

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
            <p className="text-muted-foreground">Carregando perfil...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!artesao) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Artesão não encontrado.</p>
            <Link to="/artesanato">
              <Button>Voltar para Galeria</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Configurar WhatsApp com mensagem pré-preenchida
  const whatsappNumber = artesao.whatsapp?.replace(/\D/g, "") || "5563992747396";
  const whatsappMessage = `Olá ${artesao.nome}, encontrei seu perfil no site AWIRE DIGITAL e gostaria de saber mais sobre seus artesanatos!`;
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  // Meta tags para SEO
  const pageTitle = `${artesao.nome} - Artesão | AWIRE DIGITAL`;
  const pageDescription = artesao.bio || `Conheça os artesanatos de ${artesao.nome}, artesão da Aldeia ${artesao.aldeia}.`;

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        {artesao.fotoUrl && <meta property="og:image" content={artesao.fotoUrl} />}
        <meta property="og:type" content="profile" />
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

      {/* Profile Header */}
      <section className="py-16 bg-secondary/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Photo */}
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
              {artesao.fotoUrl ? (
                <img
                  src={artesao.fotoUrl}
                  alt={artesao.nome}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-5xl">
                  {artesao.nome.charAt(0)}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl font-bold text-foreground mb-2">{artesao.nome}</h1>
              <p className="text-lg text-muted-foreground flex items-center justify-center md:justify-start gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                Aldeia {artesao.aldeia}
              </p>
              {artesao.bio && (
                <p className="text-muted-foreground max-w-2xl mb-6">{artesao.bio}</p>
              )}
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Falar com o Artesão no WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Products Gallery */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Artesanatos de <span className="text-primary">{artesao.nome}</span>
          </h2>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">
                Este artesão ainda não possui produtos cadastrados.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((craft, index) => (
                <Card
                  key={craft.id}
                  className="overflow-hidden bg-card border-border hover-lift animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={craft.imageUrls?.[0] || "/placeholder.svg"}
                      alt={craft.nome}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-2">{craft.nome}</h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{craft.descricao}</p>
                    <div className="flex gap-2 mb-4">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{craft.categoria}</span>
                      <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">{craft.aldeia}</span>
                    </div>
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={() => navigate(`/artesanato/${craft.id}`)}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ArtesaoPerfil;
