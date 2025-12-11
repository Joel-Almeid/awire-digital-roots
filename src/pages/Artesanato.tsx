import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getArtesanatos, getCategorias, getAldeias, getConfiguracoes, Artesanato as ArtesanatoType, Categoria, Aldeia } from "@/lib/firestore";

import heroBackground from "@/assets/hero-background.jpg";

const Artesanato = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("todas");
  const [aldeiaFilter, setAldeiaFilter] = useState("todas");
  const [crafts, setCrafts] = useState<ArtesanatoType[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [aldeias, setAldeias] = useState<Aldeia[]>([]);
  const [textoComoFunciona, setTextoComoFunciona] = useState("");
  const [loading, setLoading] = useState(true);

  // Carregar dados do Firestore
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [craftsData, categoriasData, aldeiasData, configData] = await Promise.all([
        getArtesanatos(),
        getCategorias(),
        getAldeias(),
        getConfiguracoes()
      ]);
      setCrafts(craftsData);
      setCategorias(categoriasData);
      setAldeias(aldeiasData);
      if (configData?.textoComoFunciona) {
        setTextoComoFunciona(configData.textoComoFunciona);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredCrafts = crafts.filter((craft) => {
    const matchesSearch = craft.nome.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "todas" || craft.categoria === categoryFilter;
    const matchesAldeia = aldeiaFilter === "todas" || craft.aldeia === aldeiaFilter;
    return matchesSearch && matchesCategory && matchesAldeia;
  });

  return (
    <div className="min-h-screen">
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
                <strong>Nota:</strong> Uma pequena comissão de cada venda é destinada ao Projeto AWIRE DIGITAL para apoiar as atividades de inclusão digital nas aldeias.
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
                  <SelectItem value="todas">Todas</SelectItem>
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
                  <SelectItem value="todas">Todas</SelectItem>
                  {aldeias.map((ald) => (
                    <SelectItem key={ald.id} value={ald.nome}>{ald.nome}</SelectItem>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCrafts.map((craft, index) => (
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
                      <p className="text-sm text-muted-foreground mb-2">{craft.descricao}</p>
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
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Artesanato;
