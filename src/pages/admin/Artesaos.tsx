import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Users, Download, FileText, Eye, Upload, Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { exportArtesaosCSV, exportArtesaosPDF } from "@/lib/exportUtils";
import { uploadDocumentCloudinary } from "@/lib/cloudinaryUpload";
import { 
  getArtesaos, 
  addArtesao, 
  updateArtesao, 
  deleteArtesao,
  getAldeias,
  uploadImageCloudinary,
  Artesao,
  Aldeia 
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
  
  const [formData, setFormData] = useState({
    nome: "",
    whatsapp: "",
    aldeia: "",
    ativo: true,
    urlTermoAssinado: ""
  });
  const [existingPhotoUrl, setExistingPhotoUrl] = useState("");

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
    setFormData({ nome: "", whatsapp: "", aldeia: "", ativo: true, urlTermoAssinado: "" });
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
      urlTermoAssinado: artesao.urlTermoAssinado || ""
    });
    setExistingPhotoUrl(artesao.fotoUrl || "");
    setSelectedPhoto(null);
    setSelectedTermo(null);
    setDialogOpen(true);
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
        ativo: formData.ativo,
        urlTermoAssinado: formData.urlTermoAssinado
      };

      if (editingArtesao) {
        const result = await updateArtesao(editingArtesao.id!, artesaoData);
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

  const handleDownloadTermo = (url: string, nome: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `termo_adesao_${nome.replace(/\s+/g, '_').toLowerCase()}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

                  {/* Termo de Adesão Section */}
                  <div className="border-t border-border pt-4">
                    <Label htmlFor="termo" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Termo de Adesão Assinado
                    </Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Formatos aceitos: PDF, JPG, PNG (máx. 10MB)
                    </p>
                    
                    {formData.urlTermoAssinado ? (
                      <div className="flex items-center gap-4 mt-2 p-3 bg-green-medium/10 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-light" />
                        <span className="text-sm text-foreground flex-1">Termo anexado</span>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(formData.urlTermoAssinado, '_blank')}
                          >
                            <Eye className="w-4 h-4" />
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
                      <Badge className="bg-green-light/20 text-green-light border-green-light/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        OK
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="bg-destructive/20 text-destructive border-destructive/30">
                        <XCircle className="w-3 h-3 mr-1" />
                        Pendente
                      </Badge>
                    )}
                  </div>

                  {/* Document Actions */}
                  {artesao.urlTermoAssinado && (
                    <div className="flex gap-2 mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-border/20"
                        onClick={() => window.open(artesao.urlTermoAssinado, '_blank')}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Ver Termo
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-border/20"
                        onClick={() => handleDownloadTermo(artesao.urlTermoAssinado!, artesao.nome)}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Baixar
                      </Button>
                    </div>
                  )}

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
    </div>
  );
};

export default Artesaos;
