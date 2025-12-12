import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Artesanato from "./pages/Artesanato";
import ArtesanatoDetalhe from "./pages/ArtesanatoDetalhe";
import ArtesaoPerfil from "./pages/ArtesaoPerfil";
import Fotos from "./pages/Fotos";
import Login from "./pages/Login";
import AdminSplash from "./pages/admin/AdminSplash";
import Dashboard from "./pages/admin/Dashboard";
import AdminArtesanato from "./pages/admin/Artesanato";
import AdminArtesaos from "./pages/admin/Artesaos";
import AdminFotos from "./pages/admin/Fotos";
import Configuracoes from "./pages/admin/Configuracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/artesanato" element={<Artesanato />} />
              <Route path="/artesanato/:id" element={<ArtesanatoDetalhe />} />
              <Route path="/artesao/:id" element={<ArtesaoPerfil />} />
              <Route path="/fotos" element={<Fotos />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<ProtectedRoute><AdminSplash /></ProtectedRoute>} />
              <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin/artesanato" element={<ProtectedRoute><AdminArtesanato /></ProtectedRoute>} />
              <Route path="/admin/artesaos" element={<ProtectedRoute><AdminArtesaos /></ProtectedRoute>} />
              <Route path="/admin/fotos" element={<ProtectedRoute><AdminFotos /></ProtectedRoute>} />
              <Route path="/admin/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
