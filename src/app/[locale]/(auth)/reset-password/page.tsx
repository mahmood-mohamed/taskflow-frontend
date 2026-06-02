"use client";

import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/molecules/PasswordField";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordFormData } from "@/validations/auth.schema";
import axiosInstance from "@/lib/axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { handleBackendError } from "@/lib/error-handler";

export default function ResetPasswordPage() {
  const t = useTranslations("ResetPassword");
  const locale = useLocale();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const resetToken = localStorage.getItem("resetToken");
      if (!resetToken) {
        toast.error("Reset token missing. Please start over.");
        router.push(`/${locale}/forgot-password`);
      } else {
        setToken(resetToken);
      }
    }
  }, [locale, router]);

  const { register, handleSubmit, setError, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;
    setIsLoading(true);
    try {
      await axiosInstance.patch("auth/reset-password", 
        { newPassword: data.password, resetToken: token }, 
      );
      toast.success(t("resetSuccess"));
      
      if (typeof window !== "undefined") {
        localStorage.removeItem("resetToken");
      }
      
      router.push(`/${locale}/login`);
    } catch (error: any) {
      handleBackendError(error, setError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 select-none animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20">
          <ShieldCheck size={32} />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            {t("title")}
          </h1>
          <p className="text-sm font-medium text-muted-foreground">
            {t("description")}
          </p>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <PasswordField
            id="password"
            label={t("newPassword")}
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />
          {/* select none password for value to prevent password copy by right click and copy context menu */}
          <PasswordField
            id="confirmPassword"
            label={t("confirmPassword")}
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </div>

        <Button 
          type="submit" 
          disabled={isLoading} 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-7 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (t("resetButton") || "Reset Password")}
        </Button>
      </form>
        {/* back to forgot password */}
      <div className="text-center text-sm font-medium text-muted-foreground pt-2">
        <Link
          href={`/${locale}/forgot-password`}
          className="inline-flex items-center gap-2  hover:text-primary transition-colors group"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          {t("forgotPasswordLink")}
        </Link>
      </div>
    </div>
  );
}
