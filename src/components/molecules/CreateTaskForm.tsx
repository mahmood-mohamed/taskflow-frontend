"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { TextField } from "./TextField";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar, Tag, AlertCircle, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, type TaskFormData } from "@/validations/auth.schema";
import { handleBackendError } from "@/lib/error-handler";
import axiosInstance from "@/lib/axios";
import { toast } from "react-hot-toast";

interface CreateTaskFormProps {
  onSuccess: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function CreateTaskForm({ onSuccess, onCancel, initialData }: CreateTaskFormProps) {
  const t = useTranslations("Tasks");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [tags, setTags] = React.useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = React.useState("");

  const isEdit = !!initialData;
  const today = new Date().toLocaleDateString('en-CA');

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    clearErrors,
    trigger,
    formState: { errors, isDirty },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: isEdit ? {
      title: initialData.title,
      description: initialData.description || "",
      priority: initialData.priority,
      dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : "",
      tags: initialData.tags || [],
    } : {
      priority: "low",
      tags: [],
    },
  });

  const handleAddTag = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const trimmedTag = tagInput.trim();

      if (trimmedTag.length > 15) {
        setError("tags", { type: "manual", message: t("tagTooLong") });
        return;
      }

      if (tags.length >= 4) {
        setError("tags", { type: "manual", message: t("tooManyTags") });
        return;
      }

      clearErrors("tags");

      if (!tags.includes(trimmedTag)) {
        const newTags = [...tags, trimmedTag];
        setTags(newTags);
        setValue("tags", newTags, { shouldDirty: true });
        await trigger("tags");
      }
      setTagInput("");
    }
  };

  const removeTag = async (tagToRemove: string) => {
    const newTags = tags.filter(t => t !== tagToRemove);
    setTags(newTags);
    setValue("tags", newTags, { shouldDirty: true });
    await trigger("tags");
  };

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    try {
      const requestData = { ...data, tags };
      if (!requestData.dueDate) delete requestData.dueDate;
      if (!requestData.description) delete requestData.description;

      if (isEdit) {
        await axiosInstance.patch(`tasks/${initialData._id}`, requestData);
        toast.success(t("updateSuccess"));
      } else {
        await axiosInstance.post("tasks", requestData);
        toast.success(t("createSuccess"));
      }
      onSuccess(requestData);
    } catch (error: any) {
      handleBackendError(error, setError);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Logic to determine if button should be disabled
  const hasChanges = isDirty;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <TextField
        label={t("titleLabel")}
        placeholder={t("titlePlaceholder")}
        error={errors.title?.message}
        {...register("title")}
      />

      <div className="space-y-2">
        <Label>{t("descriptionLabel")}</Label>
        <Textarea
          placeholder={t("descriptionPlaceholder")}
          {...register("description")}
          className={cn(errors.description && "border-destructive")}
        />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label>{t("priorityLabel")}</Label>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <div className="flex gap-2">
                {[
                  { id: "low", icon: CheckCircle2, color: "text-priority-low", bg: "bg-priority-low/10" },
                  { id: "medium", icon: Circle, color: "text-priority-medium", bg: "bg-priority-medium/10" },
                  { id: "high", icon: AlertCircle, color: "text-priority-high", bg: "bg-priority-high/10" }
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => field.onChange(p.id)}
                    className={cn(
                      "flex-1 flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all",
                      field.value === p.id
                        ? cn("border-primary", p.bg)
                        : "border-transparent bg-muted/50 hover:bg-muted"
                    )}
                  >
                    <p.icon size={20} className={cn("mb-1", p.color)} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {t(p.id)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          />
        </div>

        <div className="space-y-4">
          <Label>{t("dueDateLabel")}</Label>
          <div className="relative group">
            <Calendar size={18} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <input
              type="date"
              min={today}
              {...register("dueDate")}
              className={cn(
                "flex h-11 w-full rounded-xl border border-border bg-background ps-12 pe-4 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm",
                errors.dueDate && "border-destructive"
              )}
            />
          </div>
          {errors.dueDate && <p className="text-xs text-destructive">{errors.dueDate.message}</p>}
        </div>
      </div>

      <div className="space-y-3">
        <Label>{t("tagsLabel")}</Label>
        <div className="relative group">
          <Tag size={18} className={cn("absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary", errors.tags && "text-destructive/80 group-focus-within:text-destructive")} />
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder={t("tagsPlaceholder")}
            className={cn(
              "flex h-11 w-full rounded-xl border border-border bg-background ps-11 pe-4 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-200 shadow-sm",
              errors.tags && "border-destructive focus-visible:ring-destructive"
            )}
          />
        </div>
        {errors.tags && (
          <p className="text-xs text-destructive">
            {Array.isArray(errors.tags)
              ? (errors.tags.find((e: any) => e) as any)?.message
              : (errors.tags as any).message}
          </p>
        )}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20 group animate-in zoom-in-90"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-destructive transition-colors"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 py-6 rounded-2xl border-border hover:bg-muted font-bold cursor-pointer"
        >
          {t("cancelButton")}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || (isEdit && !hasChanges)}
          className="flex-1 py-6 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
          {isEdit ? t("updateButton") : t("createButton")}
        </Button>
      </div>
    </form>
  );
}
