import { useState, useEffect } from "react";
import { Plus, Trash2, Image } from "lucide-react";
import { toast } from "sonner";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getFotos, addFoto, deleteFoto, uploadImageCloudinary, Foto } from "@/lib/firestore";

const Fotos = () => {
  const [photos, setPhotos] = useState<Foto[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [legenda, setLegenda] = useState("");

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    setLoading(true);
    const data = await getFotos();
    setPhotos(data);
    setLoading(false);
  };

  const resetForm = () => {
    setSelectedFile(null);
    setLegenda("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error("Por favor, selecione uma imagem.");
      return;
    }

    setUploading(true);

    try {
      // Upload para Cloudinary
      const uploadResult = await uploadImageCloudinary(selectedFile);
      
      if (!uploadResult.success || !uploadResult.url) {
        toast.error("Erro ao fazer upload da imagem.");
        setUploading(false);
        return;
      }

      // Salvar no Firestore
      const result = await addFoto({
        imageUrl: uploadResult.url,
        legenda: legenda
      });

      if (result.success) {
        toast.success("Foto adicionada com sucesso!");
        setDialogOpen(false);
        resetForm();
        loadPhotos();
      } else {
        toast.error("Erro ao adicionar foto.");
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao adicionar foto.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photo: Foto) => {
    if (!confirm("Tem certeza que deseja excluir esta foto?")) return;
    
    const result = await deleteFoto(photo.id!, photo.legenda);
    if (result.success) {
      toast.success("Foto excluída com sucesso!");
      loadPhotos();
    } else {
      toast.error("Erro ao excluir foto.");
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Gerenciar Galeria de Fotos</h1>
              <p className="text-muted-foreground">Adicione ou remova fotos institucionais do projeto</p>
            </div>
            
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="bg-gold hover:bg-gold/90 text-green-dark font-semibold">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Nova Foto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg bg-card">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Adicionar Nova Foto</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="photo-upload">Imagem *</Label>
                    <Input 
                      id="photo-upload" 
                      type="file" 
                      accept="image/*" 
                      className="bg-background"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      required
                    />
                    {selectedFile && (
                      <p className="text-xs text-green-400 mt-1">✓ {selectedFile.name}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="photo-legenda">Legenda (opcional)</Label>
                    <Input 
                      id="photo-legenda" 
                      placeholder="Ex: Oficina de Informática" 
                      className="bg-background"
                      value={legenda}
                      onChange={(e) => setLegenda(e.target.value)}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gold hover:bg-gold/90 text-green-dark font-semibold"
                    disabled={uploading}
                  >
                    {uploading ? "Enviando..." : "Publicar Foto"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando fotos...</p>
            </div>
          ) : photos.length === 0 ? (
            <div className="text-center py-12">
              <Image className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nenhuma foto cadastrada ainda. Adicione a primeira!
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                As fotos estáticas do projeto (locais) continuarão sendo exibidas na galeria pública.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {photos.map((photo) => (
                <Card key={photo.id} className="bg-card border-border/10 overflow-hidden hover:border-gold/30 transition-all group">
                  <div className="aspect-square relative overflow-hidden">
                    <img 
                      src={photo.imageUrl} 
                      alt={photo.legenda || "Foto do projeto"} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-foreground mb-3 line-clamp-2">
                      {photo.legenda || "Sem legenda"}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(photo)}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Excluir
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

export default Fotos;
