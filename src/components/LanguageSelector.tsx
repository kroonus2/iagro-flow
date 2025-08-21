import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageSelector: React.FC<{
  variant?: "default" | "outline" | "ghost";
}> = ({ variant = "outline" }) => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    {
      code: "pt",
      name: "Português",
      flag: <img src="/pt-br-flag.svg" alt="Português" className="w-6 h-6" />,
    },
    {
      code: "en",
      name: "English",
      flag: <img src="/en-flag.svg" alt="English" className="w-6 h-6" />,
    },
    {
      code: "es",
      name: "Español",
      flag: <img src="/es-flag.svg" alt="Español" className="w-6 h-6" />,
    },
  ] as const;

  const currentLanguage = languages.find((lang) => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size="sm"
          className="gap-2 bg-white text-black"
        >
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
