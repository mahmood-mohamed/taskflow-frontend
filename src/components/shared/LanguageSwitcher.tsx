"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "ar" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <Button
      aria-label={locale === "en" ? "Switch to Arabic" : "Switch to English"}
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 cursor-pointer"
    >
      <Languages size={18} />
      <span className="font-medium uppercase">{locale === "en" ? "AR" : "EN"}</span>
    </Button>
  );
}
