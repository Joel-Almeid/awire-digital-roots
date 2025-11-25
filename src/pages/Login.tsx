import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import logoAwire from "@/assets/logo-awire.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    
    const result = await login(email, password);
    
    setLoading(false);
    
    if (result.success) {
      toast.success("Login realizado com sucesso!");
      navigate("/admin/dashboard");
    } else {
      toast.error(result.error || "Erro ao fazer login. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-green-medium to-background p-4">
      <Card className="w-full max-w-md p-8 bg-card/95 backdrop-blur-sm border-border animate-scale-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src={logoAwire} alt="AWIRE DIGITAL" className="h-20 w-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground">Painel Administrativo</h1>
          <p className="text-sm text-muted-foreground">AWIRE DIGITAL</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Digite seu email"
                className="pl-10 bg-background"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                className="pl-10 bg-background"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-primary hover:underline">
            ← Voltar para o site
          </a>
        </div>
      </Card>

      <div className="fixed bottom-4 right-4 text-xs text-muted-foreground">
        <p>© 2025 AWIRE DIGITAL</p>
      </div>
    </div>
  );
};

export default Login;
