import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search, Loader2 } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { 
  getArtesanatosPaginated, 
  getCategorias, 
  getAldeias, 
  getConfiguracoes, 
  getArtesaos,
  Artesanato as ArtesanatoType, 
  Categoria, 
  Aldeia,
  Artesao,
  PaginatedResult
} from "@/lib/firestore";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

import heroBackground from "@/assets/hero-background.jpg";

const ITEMS_PER_PAGE = 12;

const Artesanato = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("todas");
  const [aldeiaFilter, setAldeiaFilter] = useState("todas");
  const [artesaoFilter, setArtesaoFilter] = useState("todos");
  
  const [crafts, setCrafts] = useState<ArtesanatoType[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [aldeias, setAldeias] = useState<Aldeia[]>([]);
  const [artesaos, setArtesaos] = useState<Artesao[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Configurações dinâmicas
  const [notaComoFunciona, setNotaComoFunciona] = useState<string>("");

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  // Carregar dados iniciais
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      setLoading(true);
      const [result, categoriasData, aldeiasData, artesaosData, configData] = await Promise.all([
        getArtesanatosPaginated(ITEMS_PER_PAGE),
        getCategorias(),
        getAldeias(),
        getArtesaos(),
        getConfiguracoes()
      ]);
      
      if (!isMounted) return;
      
      setCrafts(result.items);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
      setCategorias(categoriasData);
      setAldeias(aldeiasData);
      setArtesaos(artesaosData.filter(a => a.ativo !== false));
      
      // Carregar nota do como funciona
      if (configData?.notaComoFunciona) {
        setNotaComoFunciona(configData.notaComoFunciona);
      }
      
      setLoading(false);
    };
    
    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Função para carregar mais itens
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || !lastDoc) return;
    
    setLoadingMore(true);
    const result = await getArtesanatosPaginated(ITEMS_PER_PAGE, lastDoc);
    
    setCrafts(prev => [...prev, ...result.items]);
    setLastDoc(result.lastDoc);
    setHasMore(result.hasMore);
    setLoadingMore(false);
  }, [lastDoc, hasMore, loadingMore]);

  // Carregar mais quando o elemento estiver visível
  useEffect(() => {
    if (inView && hasMore && !loadingMore && !loading) {
      loadMore();
    }
  }, [inView, hasMore, loadingMore, loading, loadMore]);

  // Filtrar os crafts localmente - inclui busca por título, descrição E nome do artesão
  const filteredCrafts = crafts.filter((craft) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === "" || 
      craft.nome.toLowerCase().includes(searchLower) ||
      craft.descricao.toLowerCase().includes(searchLower) ||
      (craft.artesaoNome && craft.artesaoNome.toLowerCase().includes(searchLower));
    const matchesCategory = categoryFilter === "todas" || craft.categoria === categoryFilter;
    const matchesAldeia = aldeiaFilter === "todas" || craft.aldeia === aldeiaFilter;
    const matchesArtesao = artesaoFilter === "todos" || craft.artesaoId === artesaoFilter;
    return matchesSearch && matchesCategory && matchesAldeia && matchesArtesao;
  });

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Artesanato Indígena - AWIRE DIGITAL</title>
        <meta name="description" content="Conheça e adquira peças autênticas de artesanato indígena produzidas pelos artesãos das aldeias Canoanã e Txuiri na Ilha do Bananal." />
        <meta property="og:title" content="Artesanato Indígena - AWIRE DIGITAL" />
        <meta property="og:description" content="Conheça e adquira peças autênticas de artesanato indígena produzidas pelos artesãos das aldeias Canoanã e Txuiri na Ilha do Bananal." />
        <meta property="og:image" content={heroBackground} />
      </Helmet>

      <Navigation />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        
        <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 animate-fade-in-up">
            Artesanato <span className="text-primary">Indígena</span>
          </h1>
          <p className="text-xl text-foreground/90 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Conheça e adquira peças autênticas produzidas pelos artesãos das aldeias Canoanã e Txuiri
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <Card className="p-8 bg-card border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Como funciona?</h2>
            <ol className="space-y-4 max-w-2xl mx-auto">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">1</span>
                <p className="text-muted-foreground">Navegue pela galeria e escolha as peças que mais lhe interessam</p>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">2</span>
                <p className="text-muted-foreground">Clique em "Ver Detalhes" para conhecer mais sobre a peça e o artesão</p>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">3</span>
                <p className="text-muted-foreground">Use o botão "Falar com o Artesão" para entrar em contato via WhatsApp</p>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">4</span>
                <p className="text-muted-foreground">Negocie preço, frete e forma de pagamento diretamente com o artesão</p>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">5</span>
                <p className="text-muted-foreground">Receba sua peça exclusiva e autêntica em casa!</p>
              </li>
            </ol>
            <div className="mt-6 p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-foreground text-center">
                <strong>Nota:</strong> {notaComoFunciona || "Uma pequena comissão de cada venda é destinada ao Projeto AWIRE DIGITAL para apoiar as atividades de inclusão digital nas aldeias."}
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              Galeria de <span className="text-primary">Artesanato</span>
            </h2>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar por nome..."
                  className="pl-10 bg-card"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48 bg-card">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas Categorias</SelectItem>
                  {categorias.map((cat) => (
                    <SelectItem key={cat.id} value={cat.nome}>{cat.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={aldeiaFilter} onValueChange={setAldeiaFilter}>
                <SelectTrigger className="w-full md:w-48 bg-card">
                  <SelectValue placeholder="Aldeia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas Aldeias</SelectItem>
                  {aldeias.map((ald) => (
                    <SelectItem key={ald.id} value={ald.nome}>{ald.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={artesaoFilter} onValueChange={setArtesaoFilter}>
                <SelectTrigger className="w-full md:w-48 bg-card">
                  <SelectValue placeholder="Artesão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos Artesãos</SelectItem>
                  {artesaos.map((art) => (
                    <SelectItem key={art.id} value={art.id!}>{art.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Results */}
            {loading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Carregando artesanatos...</p>
              </div>
            ) : filteredCrafts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">
                  {crafts.length === 0 
                    ? "Nenhum artesanato cadastrado ainda." 
                    : "Nenhum artesanato encontrado com os filtros selecionados."}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredCrafts.map((craft, index) => (
                    <Card
                      key={craft.id}
                      className="overflow-hidden bg-card border-border hover-lift animate-fade-in"
                      style={{ animationDelay: `${Math.min(index, 5) * 0.1}s` }}
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
                        
                        {/* Link para o artesão */}
                        {craft.artesaoId && craft.artesaoNome && (
                          <Link 
                            to={`/artesao/${craft.artesaoId}`}
                            className="text-sm text-primary hover:text-primary/80 hover:underline mb-3 block"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Artesão: {craft.artesaoNome}
                          </Link>
                        )}
                        
                        <div className="flex gap-2 mb-4 flex-wrap">
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

                {/* Infinite Scroll Trigger / Load More Button */}
                {hasMore && (
                  <div ref={loadMoreRef} className="flex justify-center mt-12">
                    {loadingMore ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Carregando mais...</span>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={loadMore}
                        className="border-primary/20 hover:bg-primary/10"
                      >
                        Carregar Mais
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Artesanato;