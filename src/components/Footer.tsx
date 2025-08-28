import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">IAGRO</h3>
            <p className="text-muted-foreground text-sm">
              {t('footer.company')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="/home" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('home.title')}
                </a>
              </li>
              <li>
                <a 
                  href="/dashboard-gerencial" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a 
                  href="/sobre" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('footer.about')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              {t('footer.contact')}
            </h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>{t('footer.support')}</p>
              <p className="text-primary">support@iagro.com</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} IAGRO. {t('footer.rights')}
          </p>
          <p className="text-sm text-muted-foreground mt-2 md:mt-0">
            {t('footer.version')} 1.0.0
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;