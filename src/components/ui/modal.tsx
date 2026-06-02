"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-md transition-all duration-300 animate-in fade-in" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Card */}
      <div 
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative w-full max-w-lg bg-card shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] border border-border/50 rounded-[2.5rem] flex flex-col pointer-events-auto overflow-hidden transition-all duration-300",
          "max-h-[90dvh] sm:max-h-[85vh]",
          "animate-in zoom-in-95 slide-in-from-bottom-10 fade-in duration-300",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 sm:p-8 border-b border-border/40 shrink-0 bg-card/50 backdrop-blur-xl">
          {title && (
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h2>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="rounded-full hover:bg-muted shrink-0 cursor-pointer -me-2 h-10 w-10"
          >
            <X size={24} />
          </Button>
        </div>
        
        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar overscroll-contain">
          <div className="p-6 sm:p-8">
            {children}
            {/* Safe area at bottom */}
            <div className="h-4 sm:h-0" />
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
