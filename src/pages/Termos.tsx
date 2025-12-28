import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Scale, ShieldAlert, Copyright, Gavel, ArrowLeft } from "lucide-react";

const Termos = () => {
  return (
    <>
      <Helmet>
        <title>Termos de Uso - AWIRE DIGITAL</title>
        <meta name="description" content="Termos de Uso da plataforma AWIRE DIGITAL." />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 lg:px-8 py-12 animate-fade-in">
          {/* Back Button */}
          <div className="mb-8">
            <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Ir para a Página Inicial
              </Link>
            </Button>
          </div>

          {/* Header */}
          <div className="text-center mb-12 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Termos de Uso
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              AWIRE DIGITAL - Regras e condições de utilização da plataforma
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Preâmbulo */}
            <Card className="p-6 md:p-8 bg-card border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Scale className="w-6 h-6 text-primary" />
                Preâmbulo e Definição da Plataforma
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Estes Termos de Uso regem o acesso e a utilização da plataforma AWIRE DIGITAL. 
                O desenvolvimento do site foi realizado por <strong className="text-foreground">Joel Abreu Martins de Almeida</strong> em 
                parceria com o <strong className="text-foreground">Instituto Federal do Tocantins (IFTO)</strong>.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4 bg-primary/10 p-4 rounded-lg">
                <strong className="text-foreground">Ao acessar a plataforma, o usuário concorda com estes Termos.</strong>
              </p>
            </Card>

            {/* Section 1 */}
            <Card className="p-6 md:p-8 bg-card border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">1</span>
                A Natureza da Plataforma
              </h2>
              <ul className="space-y-4 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Proprietário e Desenvolvedor:</strong> O site é o resultado do trabalho de desenvolvimento 
                  de Joel Abreu Martins de Almeida em parceria com o IFTO e é mantido institucionalmente pelo IFTO.
                </li>
                <li>
                  <strong className="text-foreground">Intermediação/Conexão:</strong> A plataforma apenas facilita a conexão entre o 
                  Artesão e o Cliente. <em>Não somos a parte vendedora.</em>
                </li>
              </ul>
            </Card>

            {/* Section 2 */}
            <Card className="p-6 md:p-8 bg-card border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">2</span>
                Responsabilidade sobre as Transações
              </h2>
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
                <p className="text-foreground font-semibold flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-destructive" />
                  A AWIRE DIGITAL e o IFTO NÃO SE RESPONSABILIZAM por:
                </p>
              </div>
              <ul className="space-y-3 text-muted-foreground list-disc list-inside">
                <li>A qualidade, entrega ou frete dos produtos.</li>
                <li>
                  Quaisquer problemas ou perdas financeiras resultantes das negociações ou pagamentos feitos 
                  diretamente entre o Artesão e o Comprador.
                </li>
              </ul>
            </Card>

            {/* Section 3 */}
            <Card className="p-6 md:p-8 bg-card border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">3</span>
                Propriedade Intelectual e Créditos de Desenvolvimento
              </h2>
              
              <div className="space-y-6">
                <div>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">3.1.</strong> A plataforma AWIRE DIGITAL, incluindo seu código-fonte, design visual, 
                    interface de usuário (UI), estrutura de banco de dados, textos e todos os elementos técnicos, é de 
                    <strong className="text-foreground"> propriedade exclusiva de Joel Abreu Martins de Almeida / IFTO</strong>.
                  </p>
                </div>

                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <p className="text-muted-foreground leading-relaxed flex items-start gap-2">
                    <Copyright className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                    <span>
                      <strong className="text-foreground">3.2. Vedação:</strong> É estritamente proibida a reprodução, cópia, plágio ou 
                      engenharia reversa do site, sob pena das sanções civis e criminais previstas no 
                      <strong className="text-foreground"> Art. 184 do Código Penal</strong> e na 
                      <strong className="text-foreground"> Lei de Software (Lei nº 9.609/98)</strong>.
                    </span>
                  </p>
                </div>

                <div className="bg-primary/10 rounded-lg p-4">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Licença de Uso de Imagens:</strong> O Artesão detém a propriedade intelectual sobre 
                    as fotos dos produtos, mas, ao cadastrar o conteúdo, concede à AWIRE DIGITAL e ao IFTO uma 
                    <strong className="text-foreground"> licença de uso não exclusiva e gratuita</strong> para exibir, reproduzir e promover 
                    as imagens na plataforma e em materiais promocionais do projeto.
                  </p>
                </div>
              </div>
            </Card>

            {/* Section 4 */}
            <Card className="p-6 md:p-8 bg-card border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">4</span>
                Disposições Gerais
              </h2>
              <p className="text-muted-foreground leading-relaxed flex items-center gap-2">
                <Gavel className="w-5 h-5 text-primary flex-shrink-0" />
                <span><strong className="text-foreground">Lei Aplicável:</strong> Estes Termos serão regidos pelas leis brasileiras.</span>
              </p>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Termos;
