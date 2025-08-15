import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, Lock, Mail, Key } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogRecuperarAberto, setDialogRecuperarAberto] = useState(false);
  const [emailRecuperacao, setEmailRecuperacao] = useState("");
  const [loadingRecuperacao, setLoadingRecuperacao] = useState(false);
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

  const handleRecuperarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailRecuperacao) {
      toast.error("Digite um e-mail válido");
      return;
    }

    setLoadingRecuperacao(true);
    
    // Simulando envio de e-mail de recuperação
    setTimeout(() => {
      toast.success("E-mail de recuperação enviado com sucesso! Verifique sua caixa de entrada.");
      setDialogRecuperarAberto(false);
      setEmailRecuperacao("");
      setLoadingRecuperacao(false);
    }, 2000);
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

              {/* Informações de Teste para Desenvolvedores */}
              <div className="bg-muted/50 rounded-lg p-4 text-xs space-y-2">
                <h4 className="font-semibold text-foreground">Acessos para Teste:</h4>
                <div className="space-y-1">
                  <div>
                    <span className="font-medium text-primary">Acesso Master:</span>
                    <div className="text-muted-foreground">
                      • Usuário: master, admin, sede (qualquer senha)
                    </div>
                    <div className="text-muted-foreground text-xs">
                      → Vai para seleção de unidades
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-primary">Acesso Normal:</span>
                    <div className="text-muted-foreground">
                      • Usuário: operador, usuario, etc (qualquer senha)
                    </div>
                    <div className="text-muted-foreground text-xs">
                      → Vai direto para home
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-2">
                <Dialog open={dialogRecuperarAberto} onOpenChange={setDialogRecuperarAberto}>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="text-sm text-primary hover:text-primary/80 underline block mx-auto"
                    >
                      Esqueceu a senha?
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        Recuperar Senha
                      </DialogTitle>
                      <DialogDescription>
                        Digite seu e-mail para receber as instruções de recuperação de senha.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleRecuperarSenha} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="emailRecuperacao">E-mail</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="emailRecuperacao"
                            type="email"
                            placeholder="seu@email.com"
                            value={emailRecuperacao}
                            onChange={(e) => setEmailRecuperacao(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" type="button" onClick={() => setDialogRecuperarAberto(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit" disabled={loadingRecuperacao}>
                          {loadingRecuperacao ? "Enviando..." : "Enviar E-mail"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <button
                  type="button"
                  className="text-sm text-muted-foreground hover:text-primary underline block mx-auto"
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