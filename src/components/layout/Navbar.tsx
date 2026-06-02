"use client";

import { useLocale, useTranslations } from "next-intl";
import { LayoutDashboard, User } from "lucide-react";
import { ThemeToggle } from "../shared/ThemeToggle";
import { LanguageSwitcher } from "../shared/LanguageSwitcher";
import Link from "next/link";

export function Navbar() {
  const t = useTranslations("Navbar");
  const locale = useLocale();

  return (
    <header className="sticky top-0 z-50 flex h-20 w-full items-center justify-between border-b border-border bg-background/90 backdrop-blur-xl px-4 md:px-10">
      {/* Logo Section - Visible only on mobile */}
      <div className="hidden md:block" />

      <div className="flex md:hidden items-center gap-3">
        <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
          <LayoutDashboard size={22} />
        </div>
        <span className="text-lg font-extrabold tracking-tight text-foreground">
          TaskFlow
        </span>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-2 md:gap-6">
        <ThemeToggle />
        <LanguageSwitcher />
        <div className="hidden md:block h-8 w-[1px] bg-border mx-2" />
        <div className="hidden md:flex items-center gap-3 cursor-pointer group">
          <Link href={`/${locale}/profile`} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-muted border border-border overflow-hidden">
            <User size={20} className="m-1.5 md:m-2 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </header>
  );
}
