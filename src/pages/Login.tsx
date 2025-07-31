import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User, Lock } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulando autenticação
    setTimeout(() => {
      if (usuario && senha) {
        // Verificar se é usuário master (sede)
        const isMaster = usuario.toLowerCase().includes("master") || 
                        usuario.toLowerCase().includes("sede") ||
                        usuario.toLowerCase().includes("admin");
        
        if (isMaster) {
          // Usuário master vai para seleção de unidades
          toast.success("Login master realizado com sucesso!");
          navigate("/selecionar-unidade");
        } else {
          // Usuário normal vai direto para home
          toast.success("Login realizado com sucesso!");
          navigate("/home");
        }
      } else {
        toast.error("Usuário e senha são obrigatórios");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Logo e Branding */}
        <div className="text-center lg:text-left text-white space-y-6">
          <div className="inline-block">
            <h1 className="text-6xl font-bold tracking-wider">IAGRO</h1>
            <div className="h-1 bg-accent w-full mt-2"></div>
          </div>
          <p className="text-xl opacity-90">
            Sistema de Gerenciamento Industrial
          </p>
          <p className="text-lg opacity-75">
            Controle e Medição de Caldas e Defensivos Agrícolas
          </p>
        </div>

        {/* Formulário de Login */}
        <Card className="w-full max-w-md mx-auto lg:mx-0">
          <CardHeader className="text-center pb-2">
            <h2 className="text-2xl font-bold text-foreground">Conecte-se</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="usuario">Usuário</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="usuario"
                    type="text"
                    placeholder="Digite seu usuário"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="senha"
                    type="password"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                disabled={loading}
              >
                {loading ? "Conectando..." : "Login"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-primary hover:text-primary-hover underline"
                  onClick={() => toast.info("Funcionalidade em desenvolvimento")}
                >
                  Outra API? Configurar
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;