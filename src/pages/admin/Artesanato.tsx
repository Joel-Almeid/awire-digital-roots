import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Package, X, Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { exportArtesanatosCSV, exportArtesanatosPDF } from "@/lib/exportUtils";
import { 
  getArtesanatos, 
  addArtesanato, 
  updateArtesanato,
  deleteArtesanato, 
  uploadImageCloudinary, 
  getCategorias, 
  getAldeias,
  getArtesaos,
  Artesanato as ArtesanatoType, 
  Categoria, 
  Aldeia,
  Artesao 
} from "@/lib/firestore";

const Artesanato = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [aldeiaFilter, setAldeiaFilter] = useState("all");
  const [products, setProducts] = useState<ArtesanatoType[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [aldeias, setAldeias] = useState<Aldeia[]>([]);
  const [artesaos, setArtesaos] = useState<Artesao[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ArtesanatoType | null>(null);
  
  // Imagens (até 3)
  const [selectedImages, setSelectedImages] = useState<(File | null)[]>([null, null, null]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>(["", "", ""]);
  
  // Formulário
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    artesaoId: "",
    artesaoNome: "",
    categoria: "",
    aldeia: ""
  });

  // Carregar dados do Firestore
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [artesanatosData, categoriasData, aldeiasData, artesaosData] = await Promise.all([
      getArtesanatos(),
      getCategorias(),
      getAldeias(),
      getArtesaos()
    ]);
    setProducts(artesanatosData);
    setCategorias(categoriasData);
    setAldeias(aldeiasData);
    setArtesaos(artesaosData);
    setLoading(false);
  };

  const loadArtesanatos = async () => {
    const data = await getArtesanatos();
    setProducts(data);
  };

  const resetForm = () => {
    setFormData({ nome: "", descricao: "", artesaoId: "", artesaoNome: "", categoria: "", aldeia: "" });
    setSelectedImages([null, null, null]);
    setExistingImageUrls(["", "", ""]);
    setEditingProduct(null);
  };

  const openEditDialog = (product: ArtesanatoType) => {
    setEditingProduct(product);
    setFormData({
      nome: product.nome,
      descricao: product.descricao,
      artesaoId: product.artesaoId,
      artesaoNome: product.artesaoNome,
      categoria: product.categoria,
      aldeia: product.aldeia
    });
    // Preencher URLs existentes
    const urls = product.imageUrls || [];
    setExistingImageUrls([urls[0] || "", urls[1] || "", urls[2] || ""]);
    setSelectedImages([null, null, null]);
    setDialogOpen(true);
  };

  const handleImageChange = (index: number, file: File | null) => {
    const newImages = [...selectedImages];
    newImages[index] = file;
    setSelectedImages(newImages);
  };

  const handleArtesaoChange = (artesaoId: string) => {
    const artesao = artesaos.find(a => a.id === artesaoId);
    if (artesao) {
      setFormData({
        ...formData,
        artesaoId: artesao.id!,
        artesaoNome: artesao.nome
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.descricao || !formData.artesaoId || !formData.categoria || !formData.aldeia) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Verificar se tem pelo menos uma imagem
    const hasNewImage = selectedImages.some(img => img !== null);
    const hasExistingImage = existingImageUrls.some(url => url !== "");
    
    if (!hasNewImage && !hasExistingImage) {
      toast.error("Por favor, selecione pelo menos uma imagem para o artesanato.");
      return;
    }

    setUploading(true);

    try {
      // Upload das novas imagens para Cloudinary
      const finalUrls: string[] = [];
      
      for (let i = 0; i < 3; i++) {
        if (selectedImages[i]) {
          // Nova imagem selecionada - fazer upload
          const uploadResult = await uploadImageCloudinary(selectedImages[i]!);
          if (uploadResult.success) {
            finalUrls.push(uploadResult.url!);
          } else {
            toast.error(`Erro ao fazer upload da imagem ${i + 1}.`);
            setUploading(false);
            return;
          }
        } else if (existingImageUrls[i]) {
          // Manter URL existente
          finalUrls.push(existingImageUrls[i]);
        }
      }

      // Garantir que temos pelo menos 1 URL
      if (finalUrls.length === 0) {
        toast.error("Erro: nenhuma imagem válida.");
        setUploading(false);
        return;
      }

      const artesanatoData = {
        nome: formData.nome,
        descricao: formData.descricao,
        imageUrls: finalUrls,
        artesaoId: formData.artesaoId,
        artesaoNome: formData.artesaoNome,
        categoria: formData.categoria,
        aldeia: formData.aldeia
      };

      if (editingProduct) {
        // Atualizar artesanato existente
        const result = await updateArtesanato(editingProduct.id!, artesanatoData);
        if (result.success) {
          toast.success("Artesanato atualizado com sucesso!");
        } else {
          toast.error("Erro ao atualizar artesanato.");
        }
      } else {
        // Adicionar novo artesanato
        const result = await addArtesanato(artesanatoData);
        if (result.success) {
          toast.success("Artesanato adicionado com sucesso!");
        } else {
          toast.error("Erro ao adicionar artesanato.");
        }
      }

      setDialogOpen(false);
      resetForm();
      loadArtesanatos();
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

  const handleExportCSV = () => {
    if (products.length === 0) {
      toast.error("Não há artesanatos para exportar.");
      return;
    }
    exportArtesanatosCSV(products);
    toast.success("CSV exportado com sucesso!");
  };

  const handleExportPDF = () => {
    if (products.length === 0) {
      toast.error("Não há artesanatos para exportar.");
      return;
    }
    exportArtesanatosPDF(products);
    toast.success("PDF exportado com sucesso!");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Gerenciar Artesanato</h1>
              <p className="text-muted-foreground">Adicione, edite ou remova produtos</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                onClick={handleExportCSV}
                className="border-border/20 hover:bg-green-medium/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
              <Button 
                variant="outline" 
                onClick={handleExportPDF}
                className="border-border/20 hover:bg-green-medium/20"
              >
                <FileText className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
              <Dialog open={dialogOpen} onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                <Button className="bg-gold hover:bg-gold/90 text-green-dark font-semibold">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Novo Artesanato
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-card max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-foreground">
                    {editingProduct ? "Editar Artesanato" : "Adicionar Novo Artesanato"}
                  </DialogTitle>
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
                  
                  {/* Upload de 3 Imagens */}
                  <div className="space-y-3">
                    <Label>Imagens do Produto (até 3) *</Label>
                    <div className="grid grid-cols-3 gap-4">
                      {[0, 1, 2].map((index) => (
                        <div key={index} className="space-y-2">
                          <Label className="text-sm text-muted-foreground">Imagem {index + 1}</Label>
                          {existingImageUrls[index] && !selectedImages[index] ? (
                            <div className="relative">
                              <img 
                                src={existingImageUrls[index]} 
                                alt={`Imagem ${index + 1}`} 
                                className="w-full h-24 object-cover rounded"
                              />
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                className="absolute top-1 right-1 h-6 w-6 p-0"
                                onClick={() => {
                                  const newUrls = [...existingImageUrls];
                                  newUrls[index] = "";
                                  setExistingImageUrls(newUrls);
                                }}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : (
                            <Input 
                              type="file" 
                              accept="image/*" 
                              className="bg-background text-xs"
                              onChange={(e) => handleImageChange(index, e.target.files?.[0] || null)}
                            />
                          )}
                          {selectedImages[index] && (
                            <p className="text-xs text-green-400 truncate">✓ {selectedImages[index]!.name}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Artesão *</Label>
                      <Select 
                        value={formData.artesaoId} 
                        onValueChange={handleArtesaoChange}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Selecionar Artesão" />
                        </SelectTrigger>
                        <SelectContent>
                          {artesaos.filter(a => a.ativo !== false).map((artesao) => (
                            <SelectItem key={artesao.id} value={artesao.id!}>
                              {artesao.nome} - {artesao.aldeia}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {artesaos.length === 0 && (
                        <p className="text-xs text-amber-400 mt-1">
                          Nenhum artesão cadastrado. Cadastre primeiro em "Gerenciar Artesãos".
                        </p>
                      )}
                    </div>
                    <div>
                      <Label>Categoria *</Label>
                      <Select value={formData.categoria} onValueChange={(value) => setFormData({...formData, categoria: value})}>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Selecionar Categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categorias.map((cat) => (
                            <SelectItem key={cat.id} value={cat.nome}>{cat.nome}</SelectItem>
                          ))}
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
                        {aldeias.map((ald) => (
                          <SelectItem key={ald.id} value={ald.nome}>{ald.nome}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gold hover:bg-gold/90 text-green-dark font-semibold"
                    disabled={uploading}
                  >
                    {uploading ? "Fazendo upload..." : editingProduct ? "Atualizar Artesanato" : "Salvar Artesanato"}
                  </Button>
                </form>
              </DialogContent>
              </Dialog>
            </div>
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
                  {categorias.map((cat) => (
                    <SelectItem key={cat.id} value={cat.nome.toLowerCase()}>{cat.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={aldeiaFilter} onValueChange={setAldeiaFilter}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Todas Aldeias" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">Todas Aldeias</SelectItem>
                  {aldeias.map((ald) => (
                    <SelectItem key={ald.id} value={ald.nome.toLowerCase()}>{ald.nome}</SelectItem>
                  ))}
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
                  <img 
                    src={product.imageUrls?.[0] || "/placeholder.svg"} 
                    alt={product.nome} 
                    className="w-full h-48 object-cover" 
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-1">{product.nome}</h3>
                    <p className="text-sm text-muted-foreground mb-1">Por: {product.artesaoNome}</p>
                    <div className="flex gap-2 text-xs text-muted-foreground mb-2">
                      <span className="bg-green-medium/20 px-2 py-1 rounded">{product.categoria}</span>
                      <span className="bg-green-medium/20 px-2 py-1 rounded">{product.aldeia}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">
                      {product.imageUrls?.length || 0} imagem(ns)
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-border/20 hover:bg-green-medium/20"
                        onClick={() => openEditDialog(product)}
                      >
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
