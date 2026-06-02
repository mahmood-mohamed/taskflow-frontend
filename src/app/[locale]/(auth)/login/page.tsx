"use client";

import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/molecules/TextField";
import { PasswordField } from "@/components/molecules/PasswordField";
import Link from "next/link";
import { Mail, LayoutDashboard, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/validations/auth.schema";
import axiosInstance from "@/lib/axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";
import { handleBackendError } from "@/lib/error-handler";

export default function LoginPage() {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("auth/login", data);
      console.log("response >>>   ✅✅✅", response);
      // Save access token
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", response.data.data.accessToken);
      }
      Cookies.set('accessToken', response.data.data.accessToken, { expires: 7 }); 

      toast.success(t("loginSuccess") || "Logged in successfully!");
      
      // Redirect to dashboard
      router.push(`/${locale}/tasks`);
      
    } catch (error: any) {
      handleBackendError(error, setError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 select-none">
      {/* Brand & Header */}
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20">
          <LayoutDashboard size={32} />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{t("loginTitle")}</h1>
          <p className="text-sm font-medium text-muted-foreground">{t("loginDescription")}</p>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <TextField
            id="email"
            type="email"
            label={t("email")}
            placeholder="name@company.com"
            icon={<Mail size={18} />}
            error={errors.email?.message}
            {...register("email")}
          />
          
          <PasswordField
            id="password"
            label={t("password")}
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        <div className="flex items-center justify-between px-1">
          <div className="w-1 h-1" />
          <Link href={`/${locale}/forgot-password`} className="text-xs font-bold text-primary hover:text-primary/80 transition-colors">
            {t("forgotPassword")}
          </Link>
        </div>
        
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-7 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : t("loginButton")}
        </Button>
      </form>

      <div className="text-center pt-2">
        <p className="text-sm font-medium text-muted-foreground">
          {t("noAccount")}{" "}
          <Link href={`/${locale}/register`} className="font-bold text-primary hover:text-primary/80 underline underline-offset-4">
            {t("registerLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
