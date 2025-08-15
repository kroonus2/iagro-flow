import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  BarChart3, 
  Users, 
  Package, 
  Settings, 
  FlaskConical,
  Truck,
  Activity,
  ChevronDown,
  ChevronRight,
  X,
  LogOut,
  Building2,
  UserCheck,
  Store,
  Database,
  Download,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface MenuItem {
  title: string;
  icon: any;
  path?: string;
  subItems?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: "Home",
    icon: Home,
    path: "/home"
  },
  {
    title: "Gestão",
    icon: BarChart3,
    subItems: [
      { title: "Dashboard Gerencial", icon: BarChart3, path: "/dashboard-gerencial" },
      { title: "Dashboard Operacional", icon: Activity, path: "/dashboard-operacional" }
    ]
  },
  {
    title: "Cadastros", 
    icon: Package,
    subItems: [
      { title: "Gerenciar Usuários", icon: UserCheck, path: "/gerenciamento-usuarios" },
      { title: "Gerenciar Unidades", icon: Building2, path: "/gerenciamento-unidades" },
      { title: "Fornecedores", icon: Store, path: "/fornecedores" },
      { title: "Defensivos", icon: Package, path: "/defensivos" },
      { title: "Smart Calda", icon: FlaskConical, path: "/carga-smart-calda" },
      { title: "Gestão Smart Caldas", icon: FlaskConical, path: "/gestao-smart-caldas" }
    ]
  },
  {
    title: "Serviços",
    icon: FlaskConical,
    subItems: [
      { title: "Estoque Geral", icon: Package, path: "/cargas" },
      { title: "Estoque Avançado", icon: Database, path: "/estoque-avancado" },
      { title: "Receitas", icon: FlaskConical, path: "/receitas" },
      { title: "Importar Receitas", icon: Download, path: "/importacao-receitas" },
      { title: "Ordens de Produção", icon: Activity, path: "/ordens-producao" },
      { title: "Supervisório", icon: Activity, path: "/supervisorio" }
    ]
  },
  {
    title: "Romaneios",
    icon: Truck,
    path: "/entregas"
  },
  {
    title: "Configurações",
    icon: Settings,
    path: "/configuracoes"
  },
  {
    title: "Sobre",
    icon: HelpCircle,
    path: "/sobre"
  }
];

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(["Gestão", "Cadastros", "Serviços"]);
  const location = useLocation();

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (path: string) => location.pathname === path;

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItems.includes(item.title);
    const IconComponent = item.icon;

    if (hasSubItems) {
      return (
        <div key={item.title}>
          <button
            onClick={() => toggleExpanded(item.title)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors",
              level > 0 && "ml-4"
            )}
          >
            <div className="flex items-center gap-3">
              <IconComponent className="h-5 w-5" />
              <span className="text-sm font-medium">{item.title}</span>
            </div>
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          
          {isExpanded && (
            <div className="ml-4 mt-1 space-y-1">
              {item.subItems.map(subItem => renderMenuItem(subItem, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={item.title}
        to={item.path!}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
            level > 0 && "ml-4",
            isActive 
              ? "bg-primary text-primary-foreground" 
              : "text-gray-300 hover:bg-gray-700 hover:text-white"
          )
        }
        onClick={onClose}
      >
        <IconComponent className="h-5 w-5" />
        {item.title}
      </NavLink>
    );
  };

  return (
    <div className="h-full bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">IA</span>
          </div>
          <span className="text-lg font-bold">IAGRO</span>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden text-gray-300 hover:text-white">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto bg-gray-900 p-4 space-y-2">
        {menuItems.map(item => renderMenuItem(item))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-700 space-y-3 bg-gray-900">
        <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg" alt="João Silva" />
            <AvatarFallback className="bg-blue-600 text-white">JS</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">João Silva</p>
            <p className="text-xs text-gray-400 truncate">Operador</p>
            <div className="flex items-center gap-1 mt-1">
              <Building2 className="h-3 w-3 text-gray-400" />
              <p className="text-xs text-gray-400 truncate">Usina Primavera - Unidade 1</p>
            </div>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white"
          onClick={() => {
            // Handle logout
            console.log('Logout clicked');
          }}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair da conta
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;