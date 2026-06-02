"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}
export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, error, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
      // select none password for value to prevent password copy by right click and copy context menu
      <div className={cn("grid w-full items-center gap-2", className)}>
        <Label htmlFor={props.id || label}>{label}</Label>
        <div className="relative group">
          <Input
            type={showPassword ? "text" : "password"}
            id={props.id || label}
            icon={<Lock size={18} />}
            ref={ref} // مهم جداً
            rightIcon={
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            className={cn(error && "border-destructive focus-visible:ring-destructive")}
            {...props}
          />
        </div>
        {error && <p className="text-xs font-medium text-destructive">{error}</p>}
      </div>
    );
  }
);
PasswordField.displayName = "PasswordField";
