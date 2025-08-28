import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'pt' | 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'pt';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const translations = {
  pt: {
    // Login Page
    'login.title': 'IAGRO',
    'login.subtitle': 'Sistema de Gerenciamento Industrial',
    'login.description': 'Controle e Medição de Caldas e Defensivos Agrícolas',
    'login.connect': 'Conecte-se',
    'login.user': 'Usuário',
    'login.userPlaceholder': 'Digite seu usuário',
    'login.password': 'Senha',
    'login.passwordPlaceholder': 'Digite sua senha',
    'login.loginButton': 'Login',
    'login.connecting': 'Conectando...',
    'login.forgotPassword': 'Esqueceu a senha?',
    'login.otherAPI': 'Outra API? Configurar',
    'login.testAccess': 'Acessos para Teste:',
    'login.masterAccess': 'Acesso Master:',
    'login.normalAccess': 'Acesso Normal:',
    'login.goToUnitSelection': 'Vai para seleção de unidades',
    'login.goDirectToHome': 'Vai direto para home',
    'login.masterSuccess': 'Login master realizado com sucesso!',
    'login.success': 'Login realizado com sucesso!',
    'login.error': 'Usuário e senha são obrigatórios',

    // Password Recovery
    'recovery.title': 'Recuperar Senha',
    'recovery.description': 'Digite seu e-mail para receber as instruções de recuperação de senha.',
    'recovery.email': 'E-mail',
    'recovery.emailPlaceholder': 'seu@email.com',
    'recovery.cancel': 'Cancelar',
    'recovery.send': 'Enviar E-mail',
    'recovery.sending': 'Enviando...',
    'recovery.success': 'E-mail de recuperação enviado com sucesso! Verifique sua caixa de entrada.',
    'recovery.emailError': 'Digite um e-mail válido',

    // Home Page
    'home.title': 'Dashboard IAGRO',
    'home.subtitle': 'Controle da Planta Industrial - Unidade Principal',
    'home.systemOperational': 'Sistema Operacional',
    'home.systemInactive': 'Sistema Inativo',
    'home.recipesToday': 'Receitas Hoje',
    'home.activeProducts': 'Produtos Ativos',
    'home.pendingAlerts': 'Alertas Pendentes',
    'home.averageTime': 'Tempo Médio',
    'home.3dVisualization': 'Visualização 3D da Planta',
    'home.interactive3d': 'Modelo 3D Interativo',
    'home.completeVisualization': 'Visualização completa do equipamento Smart Calda',
    'home.load3d': 'Carregar Modelo 3D',
    'home.3dPreview': 'Preview 3D',
    'home.systemStatus': 'Status do Sistema',
    'home.temperature': 'Temperatura',
    'home.pressure': 'Pressão',
    'home.flow': 'Fluxo',
    'home.lastUpdate': 'Última atualização:',
    'home.recentAlerts': 'Alertas Recentes',

    // General
    'general.developmentFeature': 'Funcionalidade em desenvolvimento',
    
    // Footer
    'footer.company': 'Sistema de Controle Industrial',
    'footer.quickLinks': 'Links Rápidos',
    'footer.contact': 'Contato',
    'footer.support': 'Suporte Técnico',
    'footer.rights': 'Todos os direitos reservados.',
    'footer.version': 'Versão',
    'footer.about': 'Sobre',
  },
  en: {
    // Login Page
    'login.title': 'IAGRO',
    'login.subtitle': 'Industrial Management System',
    'login.description': 'Control and Measurement of Broths and Agricultural Pesticides',
    'login.connect': 'Sign In',
    'login.user': 'User',
    'login.userPlaceholder': 'Enter your username',
    'login.password': 'Password',
    'login.passwordPlaceholder': 'Enter your password',
    'login.loginButton': 'Login',
    'login.connecting': 'Connecting...',
    'login.forgotPassword': 'Forgot password?',
    'login.otherAPI': 'Other API? Configure',
    'login.testAccess': 'Test Access:',
    'login.masterAccess': 'Master Access:',
    'login.normalAccess': 'Normal Access:',
    'login.goToUnitSelection': 'Goes to unit selection',
    'login.goDirectToHome': 'Goes directly to home',
    'login.masterSuccess': 'Master login successful!',
    'login.success': 'Login successful!',
    'login.error': 'Username and password are required',

    // Password Recovery
    'recovery.title': 'Recover Password',
    'recovery.description': 'Enter your email to receive password recovery instructions.',
    'recovery.email': 'Email',
    'recovery.emailPlaceholder': 'your@email.com',
    'recovery.cancel': 'Cancel',
    'recovery.send': 'Send Email',
    'recovery.sending': 'Sending...',
    'recovery.success': 'Recovery email sent successfully! Check your inbox.',
    'recovery.emailError': 'Enter a valid email',

    // Home Page
    'home.title': 'IAGRO Dashboard',
    'home.subtitle': 'Industrial Plant Control - Main Unit',
    'home.systemOperational': 'System Operational',
    'home.systemInactive': 'System Inactive',
    'home.recipesToday': 'Recipes Today',
    'home.activeProducts': 'Active Products',
    'home.pendingAlerts': 'Pending Alerts',
    'home.averageTime': 'Average Time',
    'home.3dVisualization': '3D Plant Visualization',
    'home.interactive3d': 'Interactive 3D Model',
    'home.completeVisualization': 'Complete visualization of Smart Calda equipment',
    'home.load3d': 'Load 3D Model',
    'home.3dPreview': '3D Preview',
    'home.systemStatus': 'System Status',
    'home.temperature': 'Temperature',
    'home.pressure': 'Pressure',
    'home.flow': 'Flow',
    'home.lastUpdate': 'Last update:',
    'home.recentAlerts': 'Recent Alerts',

    // General
    'general.developmentFeature': 'Feature under development',
    
    // Footer
    'footer.company': 'Industrial Control System',
    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact',
    'footer.support': 'Technical Support',
    'footer.rights': 'All rights reserved.',
    'footer.version': 'Version',
    'footer.about': 'About',
  },
  es: {
    // Login Page
    'login.title': 'IAGRO',
    'login.subtitle': 'Sistema de Gestión Industrial',
    'login.description': 'Control y Medición de Caldos y Pesticidas Agrícolas',
    'login.connect': 'Iniciar Sesión',
    'login.user': 'Usuario',
    'login.userPlaceholder': 'Ingrese su usuario',
    'login.password': 'Contraseña',
    'login.passwordPlaceholder': 'Ingrese su contraseña',
    'login.loginButton': 'Iniciar Sesión',
    'login.connecting': 'Conectando...',
    'login.forgotPassword': '¿Olvidó la contraseña?',
    'login.otherAPI': '¿Otra API? Configurar',
    'login.testAccess': 'Accesos de Prueba:',
    'login.masterAccess': 'Acceso Master:',
    'login.normalAccess': 'Acceso Normal:',
    'login.goToUnitSelection': 'Va a selección de unidades',
    'login.goDirectToHome': 'Va directamente al inicio',
    'login.masterSuccess': '¡Inicio de sesión master exitoso!',
    'login.success': '¡Inicio de sesión exitoso!',
    'login.error': 'Usuario y contraseña son obligatorios',

    // Password Recovery
    'recovery.title': 'Recuperar Contraseña',
    'recovery.description': 'Ingrese su email para recibir las instrucciones de recuperación de contraseña.',
    'recovery.email': 'Email',
    'recovery.emailPlaceholder': 'su@email.com',
    'recovery.cancel': 'Cancelar',
    'recovery.send': 'Enviar Email',
    'recovery.sending': 'Enviando...',
    'recovery.success': '¡Email de recuperación enviado exitosamente! Revise su bandeja de entrada.',
    'recovery.emailError': 'Ingrese un email válido',

    // Home Page
    'home.title': 'Dashboard IAGRO',
    'home.subtitle': 'Control de Planta Industrial - Unidad Principal',
    'home.systemOperational': 'Sistema Operacional',
    'home.systemInactive': 'Sistema Inactivo',
    'home.recipesToday': 'Recetas Hoy',
    'home.activeProducts': 'Productos Activos',
    'home.pendingAlerts': 'Alertas Pendientes',
    'home.averageTime': 'Tiempo Promedio',
    'home.3dVisualization': 'Visualización 3D de la Planta',
    'home.interactive3d': 'Modelo 3D Interactivo',
    'home.completeVisualization': 'Visualización completa del equipo Smart Calda',
    'home.load3d': 'Cargar Modelo 3D',
    'home.3dPreview': 'Vista Previa 3D',
    'home.systemStatus': 'Estado del Sistema',
    'home.temperature': 'Temperatura',
    'home.pressure': 'Presión',
    'home.flow': 'Flujo',
    'home.lastUpdate': 'Última actualización:',
    'home.recentAlerts': 'Alertas Recientes',

    // General
    'general.developmentFeature': 'Funcionalidad en desarrollo',
    
    // Footer
    'footer.company': 'Sistema de Control Industrial',
    'footer.quickLinks': 'Enlaces Rápidos',
    'footer.contact': 'Contacto',
    'footer.support': 'Soporte Técnico',
    'footer.rights': 'Todos los derechos reservados.',
    'footer.version': 'Versión',
    'footer.about': 'Acerca de',
  },
};