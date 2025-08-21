import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageSelector: React.FC<{ variant?: 'default' | 'outline' | 'ghost' }> = ({ variant = 'outline' }) => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { 
      code: 'pt', 
      name: 'Português', 
      flag: (
        <div className="w-6 h-4 bg-gradient-to-b from-emerald-500 to-yellow-400 rounded-sm overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-blue-600 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            </div>
          </div>
        </div>
      )
    },
    { 
      code: 'en', 
      name: 'English', 
      flag: (
        <div className="w-6 h-4 bg-gradient-to-r from-blue-600 via-white to-red-500 rounded-sm overflow-hidden relative">
          <div className="absolute inset-0">
            <div className="w-full h-1/3 bg-red-500"></div>
            <div className="w-full h-1/3 bg-white"></div>
            <div className="w-full h-1/3 bg-blue-600"></div>
          </div>
          <div className="absolute top-0 left-0 w-2/5 h-2/3 bg-blue-600 flex items-center justify-center">
            <div className="text-white text-xs">★</div>
          </div>
        </div>
      )
    },
    { 
      code: 'es', 
      name: 'Español', 
      flag: (
        <div className="w-6 h-4 bg-gradient-to-b from-red-500 via-yellow-400 to-red-500 rounded-sm overflow-hidden">
          <div className="w-full h-1/3 bg-red-500"></div>
          <div className="w-full h-1/3 bg-yellow-400"></div>
          <div className="w-full h-1/3 bg-red-500"></div>
        </div>
      )
    },
  ] as const;

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="sm" className="gap-2">
          {currentLanguage?.flag}
          <span className="hidden sm:inline">{currentLanguage?.name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="gap-2 cursor-pointer"
          >
            {lang.flag}
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;