"use client";

import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/molecules/OtpInput";
import { Loader2, RefreshCw, ArrowLeft, KeyRound } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyOtpSchema, VerifyOtpFormData } from "@/validations/auth.schema";
import axiosInstance from "@/lib/axios";
import { toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { handleBackendError } from "@/lib/error-handler";

const RESEND_COOLDOWN = 60; // seconds

export default function VerifyOtpPage() {
  const t = useTranslations("VerifyOtp");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!email && typeof window !== "undefined") {
      router.push(`/${locale}/forgot-password`);
    }
  }, [email, locale, router]);

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setError,
    formState: { errors },
  } = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { email, otp: "" },
  });

  const otpValue = watch("otp");

  const onSubmit = async (data: VerifyOtpFormData) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("auth/verify-otp", data);
      toast.success(t("otpVerified") || "Code verified successfully!");
      if (typeof window !== "undefined") {
        localStorage.setItem("resetToken", response.data.data.resetToken);
      }
      router.push(`/${locale}/reset-password`);
    } catch (error: any) {
      handleBackendError(error, setError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = useCallback(async () => {
    if (countdown > 0 || isResending) return;
    setIsResending(true);
    try {
      await axiosInstance.post("auth/forgot-password", { email });
      toast.success(t("resendSuccess") || "New code sent to your email!");
      setCountdown(RESEND_COOLDOWN);
    } catch (error: any) {
      handleBackendError(error);
    } finally {
      setIsResending(false);
    }
  }, [email, countdown, isResending, t]);

  return (
    <div className="space-y-8 select-none animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20">
          <KeyRound size={32} />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            {t("verifyOtpTitle")}
          </h1>
          <p className="text-sm font-medium text-muted-foreground max-w-[280px]">
            {t("verifyOtpDescription")}{" "}
            <span className="text-primary font-bold">{email}</span>
          </p>
        </div>
      </div>

      {/* Form */}
      <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
        {/* Hidden email field to satisfy Zod schema */}
        <input type="hidden" {...register("email")} />

        {/* 6-digit OTP input boxes */}
        <Controller
          name="otp"
          control={control}
          render={({ field }) => (
            <OtpInput
              label={t("label")}
              value={field.value}
              onChange={field.onChange}
              error={errors.otp?.message}
              disabled={isLoading}
            />
          )}
        />

        <Button
          type="submit"
          disabled={isLoading || (otpValue?.length ?? 0) < 6}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-7 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            t("verifyButton")
          )}
        </Button>
      </form>

      {/* Resend + Back */}
      <div className="flex flex-col items-center gap-3 pt-2">
        {/* Resend Code */}
        <button
          type="button"
          onClick={handleResend}
          disabled={countdown > 0 || isResending}
          className="inline-flex items-center gap-2 cursor-pointer  text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 text-muted-foreground hover:text-primary enabled:hover:text-primary group"
        >
          <RefreshCw
            size={16}
            className={isResending ? "animate-spin" : "transition-transform group-hover:rotate-180 duration-500"}
          />
          {countdown > 0
            ? `${t("resendCode")} (${countdown}s)`
            : t("resendCode")}
        </button>

        {/* Back */}
        <Link
          href={`/${locale}/forgot-password`}
          className="inline-flex items-center cursor-pointer mt-5 gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          {t("backToEmailEntry")}
        </Link>
      </div>
    </div>
  );
}
