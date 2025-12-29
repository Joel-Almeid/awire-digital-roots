import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X, Check, Loader2 } from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  getConfiguracoes,
  saveConfiguracoes,
  getCategorias,
  addCategoria,
  updateCategoria,
  deleteCategoria,
  getAldeias,
  addAldeia,
  updateAldeia,
  deleteAldeia,
  Categoria,
  Aldeia,
} from "@/lib/firestore";

const Configuracoes = () => {
  const { toast } = useToast();
  
  // Estados para configurações
  const [textoComoFunciona, setTextoComoFunciona] = useState("");
  const [textoSobreProjeto, setTextoSobreProjeto] = useState("");
  const [notaComoFunciona, setNotaComoFunciona] = useState("");
  const [passo1, setPasso1] = useState("");
  const [passo2, setPasso2] = useState("");
  const [passo3, setPasso3] = useState("");
  const [passo4, setPasso4] = useState("");
  const [passo5, setPasso5] = useState("");
  const [savingConfig, setSavingConfig] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);

  // Estados para categorias
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [novaCategoria, setNovaCategoria] = useState("");
  const [editingCategoriaId, setEditingCategoriaId] = useState<string | null>(null);
  const [editingCategoriaNome, setEditingCategoriaNome] = useState("");
  const [loadingCategorias, setLoadingCategorias] = useState(true);

  // Estados para aldeias
  const [aldeias, setAldeias] = useState<Aldeia[]>([]);
  const [novaAldeia, setNovaAldeia] = useState("");
  const [editingAldeiaId, setEditingAldeiaId] = useState<string | null>(null);
  const [editingAldeiaNome, setEditingAldeiaNome] = useState("");
  const [loadingAldeias, setLoadingAldeias] = useState(true);

  // Carregar dados iniciais
  useEffect(() => {
    loadConfiguracoes();
    loadCategorias();
    loadAldeias();
  }, []);

  const loadConfiguracoes = async () => {
    setLoadingConfig(true);
    const config = await getConfiguracoes();
    if (config) {
      setTextoComoFunciona(config.textoComoFunciona);
      setTextoSobreProjeto(config.textoSobreProjeto);
      setNotaComoFunciona(config.notaComoFunciona || "");
      setPasso1(config.passo1 || "Navegue pela galeria e escolha as peças que mais lhe interessam");
      setPasso2(config.passo2 || "Clique em \"Ver Detalhes\" para conhecer mais sobre a peça e o artesão");
      setPasso3(config.passo3 || "Use o botão \"Falar com o Artesão\" para entrar em contato via WhatsApp");
      setPasso4(config.passo4 || "Negocie preço, frete e forma de pagamento diretamente com o artesão");
      setPasso5(config.passo5 || "Receba sua peça exclusiva e autêntica em casa!");
    } else {
      // Valores padrão
      setTextoComoFunciona("1. Navegue pela galeria e escolha as peças que mais lhe agradam\n2. Clique no botão 'Ver Detalhes' para conhecer mais sobre o produto\n3. Entre em contato diretamente com o artesão via WhatsApp\n4. Negocie valores, formas de pagamento e entrega\n5. Receba sua peça única, feita com tradição e carinho");
      setTextoSobreProjeto("O projeto de extensão do Instituto Federal do Tocantins (IFTO) que promove a inclusão digital nas comunidades indígenas da Ilha do Bananal.");
      setNotaComoFunciona("Uma pequena comissão de cada venda é destinada ao Projeto AWIRE DIGITAL para apoiar as atividades de inclusão digital nas aldeias.");
      setPasso1("Navegue pela galeria e escolha as peças que mais lhe interessam");
      setPasso2("Clique em \"Ver Detalhes\" para conhecer mais sobre a peça e o artesão");
      setPasso3("Use o botão \"Falar com o Artesão\" para entrar em contato via WhatsApp");
      setPasso4("Negocie preço, frete e forma de pagamento diretamente com o artesão");
      setPasso5("Receba sua peça exclusiva e autêntica em casa!");
    }
    setLoadingConfig(false);
  };

  const loadCategorias = async () => {
    setLoadingCategorias(true);
    const data = await getCategorias();
    setCategorias(data);
    setLoadingCategorias(false);
  };

  const loadAldeias = async () => {
    setLoadingAldeias(true);
    const data = await getAldeias();
    setAldeias(data);
    setLoadingAldeias(false);
  };

  // Handlers de Configurações
  const handleSaveConfiguracoes = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    const result = await saveConfiguracoes({
      textoComoFunciona,
      textoSobreProjeto,
      notaComoFunciona,
      passo1,
      passo2,
      passo3,
      passo4,
      passo5,
    });
    setSavingConfig(false);
    
    if (result.success) {
      toast({ title: "Sucesso", description: "Configurações salvas com sucesso!" });
    } else {
      toast({ title: "Erro", description: "Erro ao salvar configurações.", variant: "destructive" });
    }
  };

  // Handlers de Categorias
  const handleAddCategoria = async () => {
    if (!novaCategoria.trim()) {
      toast({ title: "Atenção", description: "Digite o nome da categoria.", variant: "destructive" });
      return;
    }
    const result = await addCategoria(novaCategoria.trim());
    if (result.success) {
      setNovaCategoria("");
      loadCategorias();
      toast({ title: "Sucesso", description: "Categoria adicionada!" });
    } else {
      toast({ title: "Erro", description: "Erro ao adicionar categoria.", variant: "destructive" });
    }
  };

  const handleEditCategoria = (cat: Categoria) => {
    setEditingCategoriaId(cat.id!);
    setEditingCategoriaNome(cat.nome);
  };

  const handleSaveCategoria = async () => {
    if (!editingCategoriaNome.trim()) {
      toast({ title: "Atenção", description: "Digite o nome da categoria.", variant: "destructive" });
      return;
    }
    const result = await updateCategoria(editingCategoriaId!, editingCategoriaNome.trim());
    if (result.success) {
      setEditingCategoriaId(null);
      setEditingCategoriaNome("");
      loadCategorias();
      toast({ title: "Sucesso", description: "Categoria atualizada!" });
    } else {
      toast({ title: "Erro", description: "Erro ao atualizar categoria.", variant: "destructive" });
    }
  };

  const handleDeleteCategoria = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return;
    const result = await deleteCategoria(id);
    if (result.success) {
      loadCategorias();
      toast({ title: "Sucesso", description: "Categoria excluída!" });
    } else {
      toast({ title: "Erro", description: "Erro ao excluir categoria.", variant: "destructive" });
    }
  };

  // Handlers de Aldeias
  const handleAddAldeia = async () => {
    if (!novaAldeia.trim()) {
      toast({ title: "Atenção", description: "Digite o nome da aldeia.", variant: "destructive" });
      return;
    }
    const result = await addAldeia(novaAldeia.trim());
    if (result.success) {
      setNovaAldeia("");
      loadAldeias();
      toast({ title: "Sucesso", description: "Aldeia adicionada!" });
    } else {
      toast({ title: "Erro", description: "Erro ao adicionar aldeia.", variant: "destructive" });
    }
  };

  const handleEditAldeia = (aldeia: Aldeia) => {
    setEditingAldeiaId(aldeia.id!);
    setEditingAldeiaNome(aldeia.nome);
  };

  const handleSaveAldeia = async () => {
    if (!editingAldeiaNome.trim()) {
      toast({ title: "Atenção", description: "Digite o nome da aldeia.", variant: "destructive" });
      return;
    }
    const result = await updateAldeia(editingAldeiaId!, editingAldeiaNome.trim());
    if (result.success) {
      setEditingAldeiaId(null);
      setEditingAldeiaNome("");
      loadAldeias();
      toast({ title: "Sucesso", description: "Aldeia atualizada!" });
    } else {
      toast({ title: "Erro", description: "Erro ao atualizar aldeia.", variant: "destructive" });
    }
  };

  const handleDeleteAldeia = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta aldeia?")) return;
    const result = await deleteAldeia(id);
    if (result.success) {
      loadAldeias();
      toast({ title: "Sucesso", description: "Aldeia excluída!" });
    } else {
      toast({ title: "Erro", description: "Erro ao excluir aldeia.", variant: "destructive" });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Configurações</h1>
            <p className="text-muted-foreground">Gerencie categorias, aldeias e conteúdo do site</p>
          </div>

          <div className="space-y-6">
            {/* Gerenciar Categorias */}
            <Card className="p-6 bg-card border-border/10">
              <h2 className="text-xl font-semibold text-foreground mb-4">Gerenciar Categorias</h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Nome da nova categoria" 
                    className="flex-1 bg-background"
                    value={novaCategoria}
                    onChange={(e) => setNovaCategoria(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddCategoria()}
                  />
                  <Button 
                    className="bg-gold hover:bg-gold/90 text-green-dark"
                    onClick={handleAddCategoria}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
                <div className="space-y-2">
                  {loadingCategorias ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-6 h-6 animate-spin text-gold" />
                    </div>
                  ) : categorias.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">Nenhuma categoria cadastrada</p>
                  ) : (
                    categorias.map((cat) => (
                      <div key={cat.id} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/10">
                        {editingCategoriaId === cat.id ? (
                          <Input
                            value={editingCategoriaNome}
                            onChange={(e) => setEditingCategoriaNome(e.target.value)}
                            className="flex-1 mr-2"
                            onKeyDown={(e) => e.key === "Enter" && handleSaveCategoria()}
                          />
                        ) : (
                          <span className="text-foreground">{cat.nome}</span>
                        )}
                        <div className="flex gap-2">
                          {editingCategoriaId === cat.id ? (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-green-medium text-green-medium hover:bg-green-medium/20"
                                onClick={handleSaveCategoria}
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-border/20 hover:bg-muted"
                                onClick={() => setEditingCategoriaId(null)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-border/20 hover:bg-green-medium/20"
                                onClick={() => handleEditCategoria(cat)}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-destructive/50 text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteCategoria(cat.id!)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Card>

            {/* Gerenciar Aldeias */}
            <Card className="p-6 bg-card border-border/10">
              <h2 className="text-xl font-semibold text-foreground mb-4">Gerenciar Aldeias/Origens</h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Nome da nova aldeia" 
                    className="flex-1 bg-background"
                    value={novaAldeia}
                    onChange={(e) => setNovaAldeia(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddAldeia()}
                  />
                  <Button 
                    className="bg-gold hover:bg-gold/90 text-green-dark"
                    onClick={handleAddAldeia}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
                <div className="space-y-2">
                  {loadingAldeias ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-6 h-6 animate-spin text-gold" />
                    </div>
                  ) : aldeias.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">Nenhuma aldeia cadastrada</p>
                  ) : (
                    aldeias.map((aldeia) => (
                      <div key={aldeia.id} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/10">
                        {editingAldeiaId === aldeia.id ? (
                          <Input
                            value={editingAldeiaNome}
                            onChange={(e) => setEditingAldeiaNome(e.target.value)}
                            className="flex-1 mr-2"
                            onKeyDown={(e) => e.key === "Enter" && handleSaveAldeia()}
                          />
                        ) : (
                          <span className="text-foreground">{aldeia.nome}</span>
                        )}
                        <div className="flex gap-2">
                          {editingAldeiaId === aldeia.id ? (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-green-medium text-green-medium hover:bg-green-medium/20"
                                onClick={handleSaveAldeia}
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-border/20 hover:bg-muted"
                                onClick={() => setEditingAldeiaId(null)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-border/20 hover:bg-green-medium/20"
                                onClick={() => handleEditAldeia(aldeia)}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-destructive/50 text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteAldeia(aldeia.id!)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Card>

            {/* Conteúdo da Página */}
            <Card className="p-6 bg-card border-border/10">
              <h2 className="text-xl font-semibold text-foreground mb-4">Conteúdo da Página</h2>
              {loadingConfig ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-gold" />
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSaveConfiguracoes}>
                  <div>
                    <Label htmlFor="how-it-works">Texto "Como funciona?"</Label>
                    <Textarea
                      id="how-it-works"
                      rows={6}
                      className="bg-background"
                      value={textoComoFunciona}
                      onChange={(e) => setTextoComoFunciona(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="about-text">Texto "Sobre o Projeto"</Label>
                    <Textarea
                      id="about-text"
                      rows={4}
                      className="bg-background"
                      value={textoSobreProjeto}
                      onChange={(e) => setTextoSobreProjeto(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="nota-como-funciona">Nota do "Como Funciona" (Rodapé)</Label>
                    <Textarea
                      id="nota-como-funciona"
                      rows={3}
                      className="bg-background"
                      placeholder="Ex: Uma pequena comissão de cada venda é destinada ao Projeto..."
                      value={notaComoFunciona}
                      onChange={(e) => setNotaComoFunciona(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Este texto aparece na caixa verde abaixo dos passos do "Como funciona".
                    </p>
                  </div>
                  
                  {/* Passos do Como Funciona */}
                  <div className="border-t border-border pt-4">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Passos do "Como Funciona"</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="passo1">Passo 1</Label>
                        <Input
                          id="passo1"
                          className="bg-background"
                          value={passo1}
                          onChange={(e) => setPasso1(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="passo2">Passo 2</Label>
                        <Input
                          id="passo2"
                          className="bg-background"
                          value={passo2}
                          onChange={(e) => setPasso2(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="passo3">Passo 3</Label>
                        <Input
                          id="passo3"
                          className="bg-background"
                          value={passo3}
                          onChange={(e) => setPasso3(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="passo4">Passo 4</Label>
                        <Input
                          id="passo4"
                          className="bg-background"
                          value={passo4}
                          onChange={(e) => setPasso4(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="passo5">Passo 5</Label>
                        <Input
                          id="passo5"
                          className="bg-background"
                          value={passo5}
                          onChange={(e) => setPasso5(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="bg-gold hover:bg-gold/90 text-green-dark font-semibold"
                    disabled={savingConfig}
                  >
                    {savingConfig ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Salvar Alterações
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Configuracoes;
