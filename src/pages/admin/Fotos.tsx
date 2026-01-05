import { useState, useEffect } from "react";
import { Plus, Trash2, Image, Play } from "lucide-react";
import { toast } from "sonner";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import GalleryCardSkeleton from "@/components/skeletons/GalleryCardSkeleton";
import { getFotos, addFoto, deleteFoto, Foto } from "@/lib/firestore";
import { uploadMediaCloudinary } from "@/lib/cloudinaryUpload";

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

  // Verifica se é vídeo
  const isVideoFile = (file: File | null) => {
    if (!file) return false;
    return file.type.startsWith('video/');
  };

  const isVideoUrl = (url: string) => {
    const videoExtensions = ['.mp4', '.mov', '.webm', '.avi', '.mkv'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error("Por favor, selecione um arquivo de mídia.");
      return;
    }

    setUploading(true);

    try {
      // Upload para Cloudinary com resource_type: auto
      const uploadResult = await uploadMediaCloudinary(selectedFile);
      
      if (!uploadResult.success || !uploadResult.url) {
        toast.error("Erro ao fazer upload do arquivo.");
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
                    <Label htmlFor="photo-upload">Arquivo de Mídia (Foto ou Vídeo) *</Label>
                    <Input 
                      id="photo-upload" 
                      type="file" 
                      accept="image/*,video/*" 
                      className="bg-background"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      required
                    />
                    {selectedFile && (
                      <p className="text-xs text-green-400 mt-1">
                        ✓ {selectedFile.name} {isVideoFile(selectedFile) && "(Vídeo)"}
                      </p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <GalleryCardSkeleton key={i} />
              ))}
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
                    {isVideoUrl(photo.imageUrl) ? (
                      <div className="relative w-full h-full">
                        <video 
                          src={photo.imageUrl} 
                          className="w-full h-full object-cover"
                          controls
                          preload="metadata"
                        />
                        <div className="absolute top-2 left-2 bg-background/80 px-2 py-1 rounded text-xs flex items-center gap-1">
                          <Play className="w-3 h-3" />
                          Vídeo
                        </div>
                      </div>
                    ) : (
                      <img 
                        src={photo.imageUrl} 
                        alt={photo.legenda || "Foto do projeto"} 
                        className="w-full h-full object-cover"
                      />
                    )}
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
