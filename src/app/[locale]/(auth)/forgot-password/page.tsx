"use client";

import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/molecules/TextField";
import Link from "next/link";
import { Mail, LayoutDashboard, Loader2, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordFormData } from "@/validations/auth.schema";
import axiosInstance from "@/lib/axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { handleBackendError } from "@/lib/error-handler";

export default function ForgotPasswordPage() {
  const t = useTranslations("ForgetPassword");
  const locale = useLocale();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setError, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await axiosInstance.post("/auth/forgot-password", data);
      toast.success(t("otpSent"));
      router.push(`/${locale}/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (error: any) {
      handleBackendError(error, setError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20">
          <LayoutDashboard size={32} />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            {t('title')}
          </h1>
          <p className="text-sm font-medium text-muted-foreground">
            {t("description")}
          </p>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          id="email"
          type="email"
          label={t("email")}
          placeholder="name@company.com"
          icon={<Mail size={18} />}
          error={errors.email?.message}
          {...register("email")}
        />

        <Button 
          type="submit" 
          disabled={isLoading} 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-7 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (t("sendOtpButton"))}
        </Button>
      </form>

      <div className="text-center pt-2">
        <Link 
          href={`/${locale}/login`} 
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          {t("backToLogin")}
        </Link>
      </div>
    </div>
  );
}
