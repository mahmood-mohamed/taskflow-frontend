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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { Loader2, User } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { toast } from "react-hot-toast";
import { updateInfoSchema, type UpdateInfoFormData } from "@/validations/auth.schema";
import { handleBackendError } from "@/lib/error-handler";

interface UpdateInfoFormProps {
  defaultValues: { username: string; email: string };
  onSuccess: (newData: { username: string; email: string }) => void;
}

export function UpdateInfoForm({ defaultValues, onSuccess }: UpdateInfoFormProps) {
  const t = useTranslations("Profile");
  const [isUpdating, setIsUpdating] = useState(false);


  const { register, handleSubmit, watch, setError, formState: { errors } } = useForm<UpdateInfoFormData>({
    resolver: zodResolver(updateInfoSchema),
    defaultValues,
  });

  const currentValues = watch();
  const isChanged = currentValues.username?.trim() !== defaultValues.username || 
                    currentValues.email?.trim() !== defaultValues.email;

  const onSubmit = async (data: UpdateInfoFormData) => {
    setIsUpdating(true);
    try {
      await axiosInstance.patch("/users/update-info", data);
      toast.success(t("updateSuccess"));
      onSuccess(data as { username: string; email: string });
    } catch (error: any) {
      handleBackendError(error, setError);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="border-border bg-card rounded-3xl overflow-hidden shadow-xl">
      <CardHeader className="p-5 sm:p-8 pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <User size={20} className="text-primary" />
          {t("personalInfo")}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-5 sm:p-8 pt-2 sm:pt-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-foreground font-semibold">{t("username")}</Label>
            <Input
              {...register("username")}
              placeholder="Enter your username"
              className="bg-background border-border focus:border-primary rounded-xl h-12"
            />
            {errors.username && (
              <p className="text-xs font-medium text-destructive mt-1">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-semibold">{t("email")}</Label>
            <Input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              className="bg-background border-border focus:border-primary rounded-xl h-12"
            />
            {errors.email && (
              <p className="text-xs font-medium text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={isUpdating || !isChanged}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 rounded-xl transition-all active:scale-95 disabled:opacity-50"
          >
            {isUpdating ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
            {t("saveChanges")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
