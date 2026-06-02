"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Archive, ChevronLeft, ChevronRight, SquareKanban, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { CreateTaskButton } from "../molecules/CreateTaskButton";
import { LogoutButton } from "../molecules/LogoutButton";
import { SidebarProps } from "./Sidebar.types";

export function Sidebar({ locale, isCollapsed, setIsCollapsed }: SidebarProps) {
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
    <>
      <aside
        className={cn(
          "fixed start-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out border-e border-border bg-background text-foreground hidden md:block",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex h-full flex-col py-6 relative">
          {/* Toggle Button */}
          <Button
            variant="outline"
            size="icon"
            className="absolute -end-3 top-20 h-6 w-6 rounded-full border border-border bg-background shadow-md z-50 hover:bg-slate-50 p-3 cursor-pointer"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </Button>

          {/* Brand Header */}
          <div className={cn("px-6 mb-8 flex items-center gap-3", isCollapsed && "px-4")}>
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shrink-0">
              <LayoutDashboard size={24} />
            </div>
            {!isCollapsed && (
              <span className="text-xl font-extrabold tracking-tight text-foreground truncate cursor-default">
                TaskFlow
              </span>
            )}
          </div>

          {/* Workspace Info */}
          {!isCollapsed && (
            <div className="px-6 mb-10">
              <h3 className="text-sm font-bold text-foreground leading-tight">{t("enterpriseWorkspace")}</h3>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-1">{t("taskManagement")}</p>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 transition-all group relative rounded-xl",
                    isActive
                      ? "text-primary bg-accent font-semibold"
                      : "text-muted-foreground hover:text-primary hover:bg-muted"
                  )}
                >
                  {isActive && (
                    <div className="absolute start-0 top-3 bottom-3 w-1 bg-primary rounded-full" />
                  )}
                  <item.icon
                    size={20}
                    className={cn(
                      "transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                    )}
                  />
                  {!isCollapsed && <span className="text-sm">{item.title}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="px-4 space-y-6">
            <CreateTaskButton variant="sidebar" isCollapsed={isCollapsed} />
            <LogoutButton isCollapsed={isCollapsed} />
          </div>
        </div>
      </aside>
    </>
  );
}
