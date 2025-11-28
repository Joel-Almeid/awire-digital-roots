import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Package } from "lucide-react";
import { toast } from "sonner";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getArtesanatos, addArtesanato, deleteArtesanato, uploadImage, Artesanato as ArtesanatoType } from "@/lib/firestore";

const Artesanato = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [aldeiaFilter, setAldeiaFilter] = useState("all");
  const [products, setProducts] = useState<ArtesanatoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  
  // Formulário
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    artesaoNome: "",
    categoria: "",
    aldeia: ""
  });

  // Carregar artesanatos do Firestore
  useEffect(() => {
    loadArtesanatos();
  }, []);

  const loadArtesanatos = async () => {
    setLoading(true);
    const data = await getArtesanatos();
    setProducts(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.descricao || !formData.artesaoNome || !formData.categoria || !formData.aldeia) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (!selectedImage) {
      toast.error("Por favor, selecione uma imagem para o artesanato.");
      return;
    }

    setUploading(true);

    try {
      // Upload da imagem
      const timestamp = Date.now();
      const imagePath = `artesanatos/${timestamp}_${selectedImage.name}`;
      const uploadResult = await uploadImage(selectedImage, imagePath);

      if (!uploadResult.success) {
        toast.error("Erro ao fazer upload da imagem.");
        setUploading(false);
        return;
      }

      // Adicionar artesanato com URL da imagem
      const result = await addArtesanato({
        nome: formData.nome,
        descricao: formData.descricao,
        imageUrl: uploadResult.url!,
        artesaoId: "temp",
        artesaoNome: formData.artesaoNome,
        categoria: formData.categoria,
        aldeia: formData.aldeia
      });

      if (result.success) {
        toast.success("Artesanato adicionado com sucesso!");
        setDialogOpen(false);
        setFormData({ nome: "", descricao: "", artesaoNome: "", categoria: "", aldeia: "" });
        setSelectedImage(null);
        loadArtesanatos();
      } else {
        toast.error("Erro ao adicionar artesanato. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao salvar artesanato.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este artesanato?")) return;
    
    const result = await deleteArtesanato(id);
    if (result.success) {
      toast.success("Artesanato excluído com sucesso!");
      loadArtesanatos();
    } else {
      toast.error("Erro ao excluir artesanato.");
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.categoria.toLowerCase() === categoryFilter.toLowerCase();
    const matchesAldeia = aldeiaFilter === "all" || product.aldeia.toLowerCase() === aldeiaFilter.toLowerCase();
    return matchesSearch && matchesCategory && matchesAldeia;
  });

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Gerenciar Artesanato</h1>
              <p className="text-muted-foreground">Adicione, edite ou remova produtos</p>
            </div>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gold hover:bg-gold/90 text-green-dark font-semibold">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Novo Artesanato
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-card">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Adicionar Novo Artesanato</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="nome">Nome do Produto *</Label>
                    <Input 
                      id="nome" 
                      placeholder="Ex: Cocar Tradicional" 
                      className="bg-background"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="descricao">Descrição Detalhada *</Label>
                    <Textarea 
                      id="descricao" 
                      placeholder="Descreva o artesanato, materiais, significado cultural..." 
                      className="bg-background" 
                      rows={4}
                      value={formData.descricao}
                      onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="image">Imagem do Produto *</Label>
                    <Input 
                      id="image" 
                      type="file" 
                      accept="image/*" 
                      className="bg-background" 
                      onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                      required
                    />
                    {selectedImage && (
                      <p className="text-xs text-green-400 mt-1">✓ {selectedImage.name}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Nome do Artesão *</Label>
                      <Input 
                        placeholder="Ex: Juma Karajá" 
                        className="bg-background"
                        value={formData.artesaoNome}
                        onChange={(e) => setFormData({...formData, artesaoNome: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label>Categoria *</Label>
                      <Select value={formData.categoria} onValueChange={(value) => setFormData({...formData, categoria: value})}>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Selecionar Categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Adornos">Adornos</SelectItem>
                          <SelectItem value="Utilitários">Utilitários</SelectItem>
                          <SelectItem value="Decoração">Decoração</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Aldeia/Origem *</Label>
                    <Select value={formData.aldeia} onValueChange={(value) => setFormData({...formData, aldeia: value})}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Selecionar Aldeia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Canoanã">Canoanã</SelectItem>
                        <SelectItem value="Txuiri">Txuiri</SelectItem>
                        <SelectItem value="Pimentel Barbosa">Pimentel Barbosa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gold hover:bg-gold/90 text-green-dark font-semibold"
                    disabled={uploading}
                  >
                    {uploading ? "Fazendo upload..." : "Salvar Artesanato"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="p-6 bg-card border-border/10 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Todas Categorias" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">Todas Categorias</SelectItem>
                  <SelectItem value="adornos">Adornos</SelectItem>
                  <SelectItem value="utilitarios">Utilitários</SelectItem>
                  <SelectItem value="decoracao">Decoração</SelectItem>
                </SelectContent>
              </Select>
              <Select value={aldeiaFilter} onValueChange={setAldeiaFilter}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Todas Aldeias" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">Todas Aldeias</SelectItem>
                  <SelectItem value="canoana">Canoanã</SelectItem>
                  <SelectItem value="txuiri">Txuiri</SelectItem>
                  <SelectItem value="pimentel">Pimentel Barbosa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando artesanatos...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {products.length === 0 
                  ? "Nenhum artesanato cadastrado ainda. Adicione o primeiro!" 
                  : "Nenhum artesanato encontrado com os filtros selecionados."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="bg-card border-border/10 overflow-hidden hover:border-gold/30 transition-all">
                  <img src={product.imageUrl} alt={product.nome} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-1">{product.nome}</h3>
                    <p className="text-sm text-muted-foreground mb-1">Por: {product.artesaoNome}</p>
                    <div className="flex gap-2 text-xs text-muted-foreground mb-4">
                      <span className="bg-green-medium/20 px-2 py-1 rounded">{product.categoria}</span>
                      <span className="bg-green-medium/20 px-2 py-1 rounded">{product.aldeia}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 border-border/20 hover:bg-green-medium/20">
                        <Edit className="w-3 h-3 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-destructive/50 text-destructive hover:bg-destructive/10"
                        onClick={() => product.id && handleDelete(product.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Artesanato;
