"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}
export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className={cn("grid w-full items-center gap-2", className)}>
        <Label htmlFor={props.id || label}>{label}</Label>
        <div className="relative group">
          <Input
            id={props.id || label}
            icon={icon}
            className={cn(error && "border-destructive focus-visible:ring-destructive")}
            ref={ref} // مهم جداً
            {...props}
          />
        </div>
        {error && <p className="text-xs font-medium text-destructive">{error}</p>}
      </div>
    );
  }
);
TextField.displayName = "TextField";
