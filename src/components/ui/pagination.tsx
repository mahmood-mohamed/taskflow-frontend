import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  translations: {
    previous: string;
    next: string;
    pageOf: (current: number, total: number) => string | React.ReactNode;
  };
}

export function Pagination({ currentPage, totalPages, onPageChange, translations }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-12 p-3 bg-card/30 backdrop-blur-lg border border-border/40 rounded-3xl w-fit mx-auto shadow-xl">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="rounded-2xl px-4 py-2 flex items-center gap-2 cursor-pointer border-border/50 hover:bg-primary hover:text-primary-foreground disabled:pointer-events-none disabled:opacity-40 transition-all duration-300 h-10"
      >
        <ChevronLeft size={16} className="rtl:rotate-180" />
        <span className="font-bold text-sm hidden sm:inline">{translations.previous}</span>
      </Button>

      <span className="text-sm font-black text-foreground min-w-[6rem] text-center bg-background/50 border border-border/30 px-4 py-2 rounded-2xl">
        {translations.pageOf(currentPage, totalPages)}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="rounded-2xl px-4 py-2 flex items-center gap-2 cursor-pointer border-border/50 hover:bg-primary hover:text-primary-foreground disabled:pointer-events-none disabled:opacity-40 transition-all duration-300 h-10"
      >
        <span className="font-bold text-sm hidden sm:inline">{translations.next}</span>
        <ChevronRight size={16} className="rtl:rotate-180" />
      </Button>
    </div>
  );
}
