"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { Loader2, ShieldCheck } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { toast } from "react-hot-toast";
import { changePasswordSchema, type ChangePasswordFormData } from "@/validations/auth.schema";
import { PasswordField } from "@/components/molecules/PasswordField";
import { handleBackendError } from "@/lib/error-handler";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export function ChangePasswordSection() {
  const t = useTranslations("Profile");
  const [isChanging, setIsChanging] = useState(false);
  const locale = useLocale();
  const router = useRouter();

  const { register, handleSubmit, reset, watch, setError, formState: { errors } } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [oldPwd, newPwd, confirmPwd] = watch(["oldPassword", "newPassword", "confirmPassword"]);
  const isSamePassword = !!(oldPwd && newPwd && oldPwd === newPwd);
  const passwordsDoNotMatch = !!(newPwd && confirmPwd && newPwd !== confirmPwd);


  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsChanging(true);
    try {
      await axiosInstance.patch("/users/update-password", {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      toast.success(t("passwordSuccess"));
      reset();
      localStorage.removeItem("accessToken");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      router.push(`/${locale}/login`);
    } catch (error: any) {
      handleBackendError(error, setError);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <Card className="border-border bg-card rounded-3xl overflow-hidden shadow-xl">
      <CardHeader className="p-5 sm:p-8 pb-4 sm:pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <ShieldCheck size={20} className="text-primary" />
          {t("changePassword")}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {t("changePasswordDesc")}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-5 sm:p-8 pt-4 sm:pt-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <PasswordField
            label={t("oldPassword")}
            {...register("oldPassword")}
            error={errors.oldPassword?.message}
            placeholder="••••••••"
            className="[&>div>input]:bg-background [&>div>input]:border-border [&>div>input]:rounded-xl [&>div>input]:h-12"
          />
          <PasswordField
            label={t("newPassword")}
            {...register("newPassword")}
            error={errors.newPassword?.message}
            placeholder="••••••••"
            className="[&>div>input]:bg-background [&>div>input]:border-border [&>div>input]:rounded-xl [&>div>input]:h-12"
          />
          <PasswordField
            label={t("confirmPassword")}
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
            placeholder="••••••••"
            className="[&>div>input]:bg-background [&>div>input]:border-border [&>div>input]:rounded-xl [&>div>input]:h-12"
          />
          <Button
            type="submit"
            disabled={isSamePassword || passwordsDoNotMatch}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 rounded-xl cursor-pointer transition-all active:scale-95 disabled:opacity-50"
          >
            {isChanging ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
            {t("changePassword")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
