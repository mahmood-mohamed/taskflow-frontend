"use client";

import * as React from "react";
import { PasswordField } from "@/components/molecules/PasswordField";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function ChangePasswordForm() {
  const t = useTranslations("Auth");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Example validation
    const formData = new FormData(e.target as HTMLFormElement);
    const password = formData.get("password");
    const confirm = formData.get("confirm");

    if (password !== confirm) {
      setError("Passwords do not match");
    } else {
      setError(null);
      alert("Password changed successfully!");
    }
  };

  return (
    <section className="bg-card p-8 rounded-3xl border border-border shadow-sm max-w-md w-full space-y-8">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
          {t("resetPasswordTitle")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("resetPasswordDescription")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <PasswordField
          label={t("newPassword")}
          name="password"
          placeholder="••••••••"
          required
        />
        
        <PasswordField
          label={t("confirmPassword")}
          name="confirm"
          placeholder="••••••••"
          error={error || undefined}
          required
        />

        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          {t("resetButton")}
        </Button>
      </form>
    </section>
  );
}
