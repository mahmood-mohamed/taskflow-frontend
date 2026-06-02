"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Archive, SquareKanban, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { CreateTaskButton } from "../molecules/CreateTaskButton";

interface BottomBarProps {
  locale: string;
}

export function BottomBar({ locale }: BottomBarProps) {
  const pathname = usePathname();
  const t = useTranslations("Sidebar");

  const navItems = [
    {
      title: t("dashboard"),
      href: `/${locale}`,
      icon: LayoutDashboard,
    },
    {
      title: t("tasks"),
      href: `/${locale}/tasks`,
      icon: SquareKanban,
    },
    {
      title: t("archive"),
      href: `/${locale}/archive`,
      icon: Archive,
    },
    {
      title: t("profile"),
      href: `/${locale}/profile`,
      icon: User,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border px-6 py-3">
      <div className="flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 transition-all",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              <item.icon size={20} className={cn(isActive ? "text-primary" : "text-muted-foreground")} />
              <span className="text-[10px] font-medium">{item.title}</span>
            </Link>
          );
        })}
        <CreateTaskButton variant="bottombar" />
      </div>
    </div>
  );
}
