"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  disabled?: boolean;
}

export function OtpInput({
  length = 6,
  value,
  onChange,
  error,
  label,
  disabled = false,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Split the controlled value string into an array of characters
  const digits = value.padEnd(length, "").split("").slice(0, length);

  const update = (index: number, char: string) => {
    const newDigits = [...digits];
    newDigits[index] = char;
    onChange(newDigits.join(""));
  };

  const handleChange = (index: number, raw: string) => {
    const char = raw.replace(/[^0-9]/g, "").slice(-1); // numbers only, last char
    update(index, char);

    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        update(index, "");
      } else if (index > 0) {
        update(index - 1, "");
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, length);

    if (!pasted) return;

    const newDigits = [...digits];
    pasted.split("").forEach((char, i) => {
      newDigits[i] = char;
    });
    onChange(newDigits.join(""));

    // Focus the box after the last pasted digit (or last box)
    const focusIndex = Math.min(pasted.length, length - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="text-sm font-bold text-foreground px-1 block">{label}</label>
      )}

      <div className="flex justify-between gap-2 sm:gap-3 mb-6" onPaste={handlePaste}>
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digits[index] ?? ""}
            disabled={disabled}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={(e) => e.target.select()}
            className={cn(
              "flex-1 min-w-0 aspect-square max-w-[56px]",
              "text-center text-2xl font-extrabold",
              "rounded-2xl border-2 bg-background",
              "transition-all duration-150 outline-none select-none",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              error
                ? "border-destructive text-destructive ring-4 ring-destructive/10"
                : [
                    "border-muted text-foreground",
                    "focus:border-primary focus:ring-4 focus:ring-primary/10",
                    digits[index] ? "border-primary/50 bg-primary/5" : "",
                  ]
            )}
          />
        ))}
      </div>

      {error && (
        <p className="text-xs font-bold text-destructive px-1 animate-in fade-in slide-in-from-top-1 duration-200">
          {error}
        </p>
      )}
    </div>
  );
}
