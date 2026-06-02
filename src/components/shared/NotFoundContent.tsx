"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFoundContent() {
  const t = useTranslations("NotFound");

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-6 text-center overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
        {/* Animated Blobs */}
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse transition-all duration-1000" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse transition-all duration-1000 delay-700" />

        {/* Large Background Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none opacity-[0.08] dark:opacity-[0.15]">
          <h1 className="text-[20rem] md:text-[35rem] font-black tracking-tighter leading-none">
            404 
          </h1>
        </div>
      </div>

      <div className="relative z-10 max-w-2xl w-full flex flex-col items-center">
        {/* Icon Container */}
        <div className="mb-8 p-4 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 shadow-2xl shadow-indigo-500/5 animate-bounce-slow">
          <Search className="w-12 h-12 text-indigo-500" />
        </div>

        {/* Content Card (Glassmorphism) */}
        <div className="backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-white/10 dark:border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent pb-1">
              {t("title")}
            </h1>
            <p className="text-xl md:text-2xl font-medium text-muted-foreground/80">
              {t("description")}
            </p>
          </div>

          <div className="h-px w-24 bg-gradient-to-r from-transparent via-border to-transparent mx-auto" />

          <p className="text-muted-foreground max-w-md mx-auto text-lg leading-relaxed italic">
            "{t("subtext")}"
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              asChild
              size="lg"
              className="h-14 rounded-2xl px-10 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-1 transition-all duration-300 group"
            >
              <Link href="/" className="flex items-center gap-3">
                <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {t("backHome")}
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="h-14 rounded-2xl px-10 text-lg font-bold border-2 hover:bg-accent/50 transition-all duration-300 backdrop-blur-sm"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-5 h-5 mr-3 rtl:ml-3 rtl:mr-0 rtl:rotate-180" />
              {t("goBack")}
            </Button>
          </div>
        </div>

        {/* Extra decorative floating shapes */}
        <div className="mt-4 md:mt-12 flex gap-4 opacity-40">
          <div className="w-3 h-3 rounded-full bg-indigo-500 animate-ping" />
          <div className="w-3 h-3 rounded-full bg-purple-500 animate-ping [animation-delay:0.3s]" />
          <div className="w-3 h-3 rounded-full bg-pink-500 animate-ping [animation-delay:0.6s]" />
        </div>
      </div>
    </div>
  );
}
