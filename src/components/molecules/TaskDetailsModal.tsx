"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Calendar, Tag, Clock, Circle, CheckCircle2, Trash2, Pencil, RefreshCw, AlertCircle, Info, ArchiveRestore } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

interface TaskDetailsModalProps {
  task: {
    _id: string;
    title: string;
    description?: string;
    status: "todo" | "in-progress" | "done";
    priority: "low" | "medium" | "high";
    tags: string[];
    dueDate?: string;
    createdAt: string;
    updatedAt?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isArchived?: boolean;
}

export function TaskDetailsModal({ task, isOpen, onClose, onEdit, onDelete, isArchived = false }: TaskDetailsModalProps) {
  const locale = useLocale();
  const t = useTranslations("Tasks");
  const ta = useTranslations("Archive");

  if (!task) return null;

  const priorityConfig = {
    low: {
      style: "text-priority-low bg-priority-low/10 border-priority-low/20",
      dot: "bg-priority-low",
      icon: CheckCircle2,
    },
    medium: {
      style: "text-priority-medium bg-priority-medium/10 border-priority-medium/20",
      dot: "bg-priority-medium",
      icon: Circle,
    },
    high: {
      style: "text-priority-high bg-priority-high/10 border-priority-high/20",
      dot: "bg-priority-high",
      icon: AlertCircle,
    },
  };

  const statusConfig = {
    todo: {
      icon: Circle,
      style: "text-slate-500 bg-slate-100 border-slate-200 dark:bg-slate-900/60 dark:text-slate-400 dark:border-slate-800",
      label: t("todo"),
    },
    "in-progress": {
      icon: Clock,
      style: "text-indigo-600 bg-indigo-50 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800",
      label: t("inprogress"),
    },
    done: {
      icon: CheckCircle2,
      style: "text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
      label: t("done"),
    },
  };

  const currentPriority = priorityConfig[task.priority] || priorityConfig.low;
  const currentStatus = statusConfig[task.status] || statusConfig.todo;
  const PriorityIcon = currentPriority.icon;
  const StatusIcon = currentStatus.icon;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString(locale, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("detailsTitle")}
      className="max-w-xl border-border bg-card/95 backdrop-blur-2xl rounded-[3rem]"
    >
      <div className="space-y-6">
        {/* Title and Priority Row */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black capitalize tracking-widest shadow-sm cursor-default",
              currentPriority.style
            )}>
              <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", currentPriority.dot)} />
              {t(task.priority)}
            </div>

            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black capitalize tracking-widest shadow-sm cursor-default",
              currentStatus.style
            )}>
              <StatusIcon size={12} className="animate-pulse" />
              {currentStatus.label}
            </div>
          </div>
          <h2 className="text-2xl font-black text-foreground tracking-tight leading-snug">
            {task.title}
          </h2>
        </div>

        {/* Description Section */}
        <div className="space-y-2">
          <span className="text-[11px] font-black text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Info size={14} className="text-primary/70" />
            {t("descriptionLabel")}
          </span>
          <div className="rounded-2xl border border-border/40 bg-muted/30 dark:bg-muted/10 p-5 min-h-[100px] max-h-[200px] overflow-y-auto custom-scrollbar">
            {task.description ? (
              <p className="text-sm text-foreground/80 leading-relaxed font-medium whitespace-pre-wrap">
                {task.description}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground/60 italic font-medium">
                {t("noDescription")}
              </p>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-border/40 py-5">
          {/* Due Date */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
              <Calendar size={18} />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">
                {t("dueDateLabel")}
              </span>
              <span className="text-sm font-bold text-foreground">
                {formattedDueDate || t("noDate")}
              </span>
            </div>
          </div>

          {/* Status (redundant but cleanly displayed with icon) */}
          <div className="flex items-center gap-3">
            <div className={cn("p-2.5 rounded-xl shrink-0 bg-muted/65", 
              task.status === "done" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
              task.status === "in-progress" && "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
            )}>
              <StatusIcon size={18} />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">
                {t("statusLabel")}
              </span>
              <span className="text-sm font-bold text-foreground">
                {currentStatus.label}
              </span>
            </div>
          </div>

          {/* Created At */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-muted/60 text-muted-foreground shrink-0">
              <Clock size={18} />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">
                {t("createdAtLabel")}
              </span>
              <span className="text-xs font-bold text-foreground/80">
                {formatDate(task.createdAt)}
              </span>
            </div>
          </div>

          {/* Last Updated */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-muted/60 text-muted-foreground shrink-0">
              <RefreshCw size={18} />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">
                {t("updatedAtLabel")}
              </span>
              <span className="text-xs font-bold text-foreground/80">
                {formatDate(task.updatedAt || task.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Tags Section */}
        {task.tags && task.tags.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">
              {t("tagsLabel")}
            </span>
            <div className="flex flex-wrap gap-2">
              {task.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-muted/70 text-foreground/80 rounded-xl border border-border/40 hover:border-primary/40 hover:text-primary transition-all duration-300 cursor-default"
                >
                  <Tag size={12} className="text-primary/70" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions Footer */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <div className="flex gap-2 flex-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onClose();
                onEdit(task._id);
              }}
              className="flex-1 rounded-2xl h-12 gap-2 text-xs font-bold border-border/80 hover:bg-muted cursor-pointer transition-all duration-200"
            >
              {isArchived ? (
                <>
                  <ArchiveRestore size={15} className="text-primary" />
                  {ta("restore")}
                </>
              ) : (
                <>
                  <Pencil size={15} />
                  {t("updateTask")}
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                onClose();
                onDelete(task._id);
              }}
              className="flex-1 rounded-2xl h-12 gap-2 text-xs font-bold transition-all duration-200 cursor-pointer"
            >
              <Trash2 size={15} />
              {isArchived ? ta("hardDelete") : t("deleteTask")}
            </Button>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="rounded-2xl h-12 text-xs font-bold px-6 cursor-pointer bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-200"
          >
            {t("cancelButton")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
