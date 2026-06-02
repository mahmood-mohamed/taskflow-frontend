"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { BottomBar } from "@/components/layout/BottomBar";
import { Footer } from "@/components/layout/Footer";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const [locale, setLocale] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    params.then((p) => setLocale(p.locale));
  }, [params]);

  if (!locale) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar locale={locale} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div 
        className={cn(
          "flex flex-1 flex-col transition-all duration-300 ease-in-out pb-20 md:pb-0",
          isCollapsed ? "md:ps-20" : "md:ps-64"
        )}
      >
        <Navbar />
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
        <Footer />
      </div>
      <BottomBar locale={locale} />
    </div>
  );
}
