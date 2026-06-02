"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { Button } from "./button";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  confirmVariant?: "destructive" | "default";
  cancelLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel,
  confirmVariant = "destructive",
  cancelLabel = "Cancel",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        role="alertdialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-md bg-card border border-border/50 rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-6 fade-in duration-300 space-y-6"
      >
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-5 end-5 p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Icon + Text */}
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-destructive/10 shrink-0 mt-0.5">
            <AlertTriangle size={22} className="text-destructive" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-foreground leading-tight">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-2">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-2xl px-6 font-bold cursor-pointer"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-2xl px-6 gap-2 font-bold cursor-pointer"
          >
            {isLoading && <Loader2 size={14} className="animate-spin" />}
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
