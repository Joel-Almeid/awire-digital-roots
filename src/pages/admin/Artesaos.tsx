import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Users, Download, FileText, Eye, Upload, Loader2, CheckCircle, XCircle, Package, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { exportArtesaosCSV, exportArtesaosPDF } from "@/lib/exportUtils";
import { uploadDocumentCloudinary } from "@/lib/cloudinaryUpload";
import { isPdfUrl } from "@/lib/cloudinaryUrls";
import { 
  getArtesaos, 
  addArtesao, 
  updateArtesaoWithCascade, 
  deleteArtesao,
  getAldeias,
  getArtesanatosByArtesaoId,
  uploadImageCloudinary,
  Artesao,
  Aldeia,
  Artesanato
} from "@/lib/firestore";

const Artesaos = () => {
  const [artesaos, setArtesaos] = useState<Artesao[]>([]);
  const [aldeias, setAldeias] = useState<Aldeia[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingTermo, setUploadingTermo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editingArtesao, setEditingArtesao] = useState<Artesao | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [selectedTermo, setSelectedTermo] = useState<File | null>(null);

  // Modal de produtos
  const [productsModalOpen, setProductsModalOpen] = useState(false);
  const [selectedArtesaoProducts, setSelectedArtesaoProducts] = useState<Artesanato[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedArtesaoName, setSelectedArtesaoName] = useState("");

  const [formData, setFormData] = useState({
    nome: "",
    whatsapp: "",
    aldeia: "",
    ativo: true,
    urlTermoAssinado: "",
    bio: ""
  });
  const [existingPhotoUrl, setExistingPhotoUrl] = useState("");

  // Para visualizar PDFs: troca .pdf por .jpg (exibe 1ª página como imagem)
  const getPdfPreviewUrl = (url: string) => {
    if (!isPdfUrl(url)) return url;
    return url.replace(/\.pdf$/i, '.jpg');
  };
  
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [artesaosData, aldeiasData] = await Promise.all([
      getArtesaos(),
      getAldeias()
    ]);
    setArtesaos(artesaosData);
    setAldeias(aldeiasData);
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({ nome: "", whatsapp: "", aldeia: "", ativo: true, urlTermoAssinado: "", bio: "" });
    setSelectedPhoto(null);
    setSelectedTermo(null);
    setExistingPhotoUrl("");
    setEditingArtesao(null);
    setUploadProgress(0);
  };

  const openEditDialog = (artesao: Artesao) => {
    setEditingArtesao(artesao);
    setFormData({
      nome: artesao.nome,
      whatsapp: artesao.whatsapp,
      aldeia: artesao.aldeia,
      ativo: artesao.ativo !== false,
      urlTermoAssinado: artesao.urlTermoAssinado || "",
      bio: artesao.bio || ""
    });
    setExistingPhotoUrl(artesao.fotoUrl || "");
    setSelectedPhoto(null);
    setSelectedTermo(null);
    setDialogOpen(true);
  };

  // Função para ver produtos do artesão
  const handleViewProducts = async (artesao: Artesao) => {
    if (!artesao.id) return;
    
    setLoadingProducts(true);
    setSelectedArtesaoName(artesao.nome);
    setProductsModalOpen(true);
    
    const products = await getArtesanatosByArtesaoId(artesao.id);
    setSelectedArtesaoProducts(products);
    setLoadingProducts(false);
  };

  // Função para excluir termo de adesão
  const handleDeleteTermo = async (artesao: Artesao) => {
    if (!artesao.id) return;
    
    const result = await updateArtesaoWithCascade(artesao.id, { urlTermoAssinado: "" });
    if (result.success) {
      toast.success("Termo de adesão removido com sucesso!");
      loadData();
    } else {
      toast.error("Erro ao remover termo.");
    }
  };

  const handleTermoUpload = async (file: File) => {
    setUploadingTermo(true);
    setUploadProgress(0);
    
    // Simulate progress for UX
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 200);
    
    const result = await uploadDocumentCloudinary(file, {
      folder: "awire/termos_artesaos",
      tags: ["termo_adesao"],
      maxSize: 10
    });
    
    clearInterval(progressInterval);
    setUploadProgress(100);
    
    if (result.success && result.url) {
      setFormData(prev => ({ ...prev, urlTermoAssinado: result.url! }));
      toast.success("Termo de adesão enviado com sucesso!");
    } else {
      toast.error(typeof result.error === 'string' ? result.error : "Erro ao enviar o termo.");
    }
    
    setTimeout(() => {
      setUploadingTermo(false);
      setUploadProgress(0);
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.whatsapp || !formData.aldeia) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setUploading(true);

    try {
      let fotoUrl = existingPhotoUrl;

      // Upload da foto se uma nova foi selecionada
      if (selectedPhoto) {
        const uploadResult = await uploadImageCloudinary(selectedPhoto);
        if (uploadResult.success) {
          fotoUrl = uploadResult.url!;
        } else {
          toast.error("Erro ao fazer upload da foto.");
          setUploading(false);
          return;
        }
      }

      const artesaoData = {
        nome: formData.nome,
        whatsapp: formData.whatsapp,
        aldeia: formData.aldeia,
        fotoUrl: fotoUrl,
        bio: formData.bio,
        ativo: formData.ativo,
        urlTermoAssinado: formData.urlTermoAssinado
      };

      if (editingArtesao) {
        const result = await updateArtesaoWithCascade(editingArtesao.id!, artesaoData);
        if (result.success) {
          toast.success("Artesão atualizado com sucesso!");
        } else {
          toast.error("Erro ao atualizar artesão.");
        }
      } else {
        const result = await addArtesao(artesaoData);
        if (result.success) {
          toast.success("Artesão adicionado com sucesso!");
        } else {
          toast.error("Erro ao adicionar artesão.");
        }
      }

      setDialogOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao salvar artesão.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este artesão?")) return;
    
    const result = await deleteArtesao(id);
    if (result.success) {
      toast.success("Artesão excluído com sucesso!");
      loadData();
    } else {
      toast.error("Erro ao excluir artesão.");
    }
  };

  const handleExportCSV = () => {
    if (artesaos.length === 0) {
      toast.error("Não há artesãos para exportar.");
      return;
    }
    exportArtesaosCSV(artesaos);
    toast.success("CSV exportado com sucesso!");
  };

  const handleExportPDF = async () => {
    if (artesaos.length === 0) {
      toast.error("Não há artesãos para exportar.");
      return;
    }
    await exportArtesaosPDF(artesaos);
    toast.success("PDF exportado com sucesso!");
  };


  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Gerenciar Artesãos</h1>
              <p className="text-muted-foreground">Adicione, edite ou remova artesãos</p>
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
                    Adicionar Novo Artesão
                  </Button>
                </DialogTrigger>
              <DialogContent className="max-w-2xl bg-card max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-foreground">
                    {editingArtesao ? "Editar Artesão" : "Adicionar Novo Artesão"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="artisan-name">Nome do Artesão *</Label>
                    <Input 
                      id="artisan-name" 
                      placeholder="Ex: Juma Karajá" 
                      className="bg-background"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="photo">Foto do Artesão</Label>
                    {existingPhotoUrl && !selectedPhoto ? (
                      <div className="flex items-center gap-4 mt-2">
                        <img 
                          src={existingPhotoUrl} 
                          alt="Foto atual" 
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => setExistingPhotoUrl("")}
                        >
                          Trocar foto
                        </Button>
                      </div>
                    ) : (
                      <Input 
                        id="photo" 
                        type="file" 
                        accept="image/*" 
                        className="bg-background"
                        onChange={(e) => setSelectedPhoto(e.target.files?.[0] || null)}
                      />
                    )}
                    {selectedPhoto && (
                      <p className="text-xs text-green-400 mt-1">✓ {selectedPhoto.name}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="whatsapp">Número do WhatsApp *</Label>
                    <Input 
                      id="whatsapp" 
                      placeholder="5563999999999" 
                      className="bg-background"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Formato: código do país + DDD + número (ex: 5563999999999)
                    </p>
                  </div>
                  <div>
                    <Label>Aldeia/Origem Principal *</Label>
                    <Select 
                      value={formData.aldeia} 
                      onValueChange={(value) => setFormData({...formData, aldeia: value})}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Selecionar Aldeia" />
                      </SelectTrigger>
                      <SelectContent>
                        {aldeias.map((aldeia) => (
                          <SelectItem key={aldeia.id} value={aldeia.nome}>
                            {aldeia.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {aldeias.length === 0 && (
                      <p className="text-xs text-amber-400 mt-1">
                        Nenhuma aldeia cadastrada. Cadastre primeiro em "Configurações".
                      </p>
                    )}
                  </div>

                  {/* Biografia / Minha História */}
                  <div>
                    <Label htmlFor="bio">Biografia / Minha História</Label>
                    <Textarea 
                      id="bio" 
                      placeholder="Conte um pouco sobre a história e a jornada deste artesão..." 
                      className="bg-background min-h-[100px]"
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Esta biografia será exibida na página pública do artesão.
                    </p>
                  </div>

                  {/* Termo de Adesão Section */}
                  <div className="border-t border-border pt-4">
                    <Label htmlFor="termo" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Termo de Artesão Assinado
                    </Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Formatos aceitos: PDF, JPG, PNG (máx. 10MB)
                    </p>
                    
                    {formData.urlTermoAssinado ? (
                      <div className="flex items-center gap-4 mt-2 p-3 bg-green-medium/10 rounded-lg">
                        {isPdfUrl(formData.urlTermoAssinado) ? (
                          <FileText className="w-5 h-5 text-red-500" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-blue-500" />
                        )}
                        <span className="text-sm text-foreground flex-1">
                          {isPdfUrl(formData.urlTermoAssinado) ? "PDF anexado" : "Imagem anexada"}
                        </span>
                        <div className="flex gap-2">
                          <Button type="button" variant="outline" size="sm" asChild>
                            <a
                              href={getPdfPreviewUrl(formData.urlTermoAssinado)}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Ver"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setFormData({...formData, urlTermoAssinado: ""})}
                          >
                            Trocar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Input 
                          id="termo" 
                          type="file" 
                          accept=".pdf,.jpg,.jpeg,.png" 
                          className="bg-background"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setSelectedTermo(file);
                              handleTermoUpload(file);
                            }
                          }}
                          disabled={uploadingTermo}
                        />
                        {uploadingTermo && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin text-primary" />
                              <span className="text-sm text-muted-foreground">Enviando termo...</span>
                            </div>
                            <Progress value={uploadProgress} className="h-2" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="status">Status Ativo</Label>
                    <Switch 
                      id="status" 
                      checked={formData.ativo}
                      onCheckedChange={(checked) => setFormData({...formData, ativo: checked})}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gold hover:bg-gold/90 text-green-dark font-semibold"
                    disabled={uploading || uploadingTermo}
                  >
                    {uploading ? "Salvando..." : editingArtesao ? "Atualizar Artesão" : "Salvar Artesão"}
                  </Button>
                </form>
              </DialogContent>
              </Dialog>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando artesãos...</p>
            </div>
          ) : artesaos.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nenhum artesão cadastrado ainda. Adicione o primeiro!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artesaos.map((artesao) => (
                <Card key={artesao.id} className="p-6 bg-card border-border/10 hover:border-gold/30 transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    {artesao.fotoUrl ? (
                      <img 
                        src={artesao.fotoUrl} 
                        alt={artesao.nome}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-green-medium/30 flex items-center justify-center text-gold font-bold text-xl">
                        {artesao.nome.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{artesao.nome}</h3>
                      <p className="text-sm text-muted-foreground mb-1">Aldeia {artesao.aldeia}</p>
                      <p className="text-xs text-muted-foreground">{artesao.whatsapp}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <span className={`text-sm font-medium ${artesao.ativo !== false ? 'text-green-light' : 'text-destructive'}`}>
                      {artesao.ativo !== false ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  
                  {/* Documentação Status */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">Documentação:</span>
                    {artesao.urlTermoAssinado ? (
                      <div className="group relative">
                        <Badge className="bg-green-light/20 text-green-light border-green-light/30 cursor-help">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          OK
                        </Badge>
                        {artesao.createdAt && (
                          <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-popover border border-border rounded text-xs text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                            Enviado em: {artesao.createdAt.toDate ? artesao.createdAt.toDate().toLocaleDateString('pt-BR') : 'Data não disponível'}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Badge variant="destructive" className="bg-destructive/20 text-destructive border-destructive/30">
                        <XCircle className="w-3 h-3 mr-1" />
                        Pendente
                      </Badge>
                    )}
                  </div>

                  {/* Document Actions */}
                  {artesao.urlTermoAssinado && (
                    <div className="mb-4">
                      {/* File Type Indicator */}
                      <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                        {isPdfUrl(artesao.urlTermoAssinado) ? (
                          <>
                            <FileText className="w-3.5 h-3.5 text-red-500" />
                            <span>Documento PDF</span>
                          </>
                        ) : (
                          <>
                            <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                            <span>Imagem</span>
                          </>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full flex-1 border-border/20"
                          asChild
                        >
                          <a
                            href={getPdfPreviewUrl(artesao.urlTermoAssinado)}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Ver"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Ver
                          </a>
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full flex-1 border-border/20"
                          asChild
                        >
                          <a
                            href={artesao.urlTermoAssinado}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Baixar"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Baixar
                          </a>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-destructive/50 text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remover Termo de Adesão?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Deseja remover o termo anexado de {artesao.nome}? 
                                O status voltará para "Pendente". Esta ação não exclui o artesão.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteTermo(artesao)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Remover Termo
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  )}

                  {/* Ver Produtos Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mb-4 border-primary/30 text-primary hover:bg-primary/10"
                    onClick={() => handleViewProducts(artesao)}
                  >
                    <Package className="w-3 h-3 mr-1" />
                    Ver Produtos Cadastrados
                  </Button>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-border/20 hover:bg-green-medium/20"
                      onClick={() => openEditDialog(artesao)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-destructive/50 text-destructive hover:bg-destructive/10"
                      onClick={() => artesao.id && handleDelete(artesao.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal de Produtos do Artesão */}
      <Dialog open={productsModalOpen} onOpenChange={setProductsModalOpen}>
        <DialogContent className="max-w-2xl bg-card max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Produtos de {selectedArtesaoName}
            </DialogTitle>
            <DialogDescription>
              Lista de artesanatos cadastrados por este artesão
            </DialogDescription>
          </DialogHeader>
          
          {loadingProducts ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : selectedArtesaoProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum produto cadastrado.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedArtesaoProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-4 p-3 bg-background rounded-lg">
                  <img 
                    src={product.imageUrls?.[0] || "/placeholder.svg"} 
                    alt={product.nome}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{product.nome}</h4>
                    <p className="text-sm text-muted-foreground">{product.categoria}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Artesaos;
