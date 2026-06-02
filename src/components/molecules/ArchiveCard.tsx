"use client";

import { ArchiveRestore, Calendar, Circle, CircleCheck, CircleEllipsis, Clock, Loader2, Tag, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ArchiveCardProps {
  task: {
    _id: string;
    title: string;
    description?: string;
    status: "todo" | "in-progress" | "done";
    priority: "low" | "medium" | "high";
    tags?: string[];
    dueDate?: string;
    createdAt: string;
    updatedAt?: string;
  };
  isActioning: boolean;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetails?: (task: any) => void;
}

export function ArchiveCard({ task, isActioning, onRestore, onDelete, onViewDetails }: ArchiveCardProps) {
  const t = useTranslations("Archive");
  const locale = useLocale();

  // ── Status config ─────────────────────────────────────────────────────────
  const statusConfig: Record<string, { label: string; style: string, icon: React.ReactNode }> = {
    todo: {
      label: t("todo"),
      style: "bg-slate-100 text-slate-600 dark:bg-slate-900/60 dark:text-slate-400",
      icon: <Circle size={10} className="animate-pulse" />,
    },
    "in-progress": {
      label: t("inprogress"),
      style: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
      icon: <CircleEllipsis size={10} className="animate-pulse" />,
    },
    done: {
      label: t("done"),
      style: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
      icon: <CircleCheck size={10} className="animate-pulse" />,
    },
  };

  // ── Priority config ───────────────────────────────────────────────────────
  const priorityConfig: Record<string, { label: string; style: string; dot: string }> = {
    low: {
      label: t("low"),
      style: "bg-priority-low/10 text-priority-low border-priority-low/20",
      dot: "bg-priority-low",
    },
    medium: {
      label: t("medium"),
      style: "bg-priority-medium/10 text-priority-medium border-priority-medium/20",
      dot: "bg-priority-medium",
    },
    high: {
      label: t("high"),
      style: "bg-priority-high/10 text-priority-high border-priority-high/20",
      dot: "bg-priority-high",
    },
  };

  const status = statusConfig[task.status] ?? statusConfig.todo;
  const priority = priorityConfig[task.priority] ?? priorityConfig.low;

  const deletedAt = new Date(task.updatedAt ?? task.createdAt);
  const formattedDeletedAt = deletedAt.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    : null;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      onClick={() => onViewDetails?.(task)}
      className={cn(
        // flex-col + h-full so footer always sticks to bottom in grid rows
        "group relative flex flex-col bg-card border border-border/60 rounded-[2.5rem] p-6 shadow-sm h-full cursor-pointer",
        "hover:border-destructive/30 hover:shadow-xl hover:shadow-destructive/5",
        "transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 duration-500",
        isActioning && "opacity-40 pointer-events-none scale-[0.98]"
      )}
    >
      {/* Decorative glow */}
      <div className="absolute -bottom-8 -end-8 w-28 h-28 bg-destructive/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      <div className="absolute -bottom-8 -start-8 w-28 h-28 bg-primary/8 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* ── Top row: Priority badge + Status badge ──────────────────────────── */}
      <div className="flex items-center justify-between mb-4 animate-in fade-in slide-in-from-top-2 duration-700">
        {/* Priority */}
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black capitalize tracking-widest shadow-sm",
            priority.style
          )}
        >
          <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", priority.dot)} />
          {priority.label}
        </div>

        {/* Status */}
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black capitalize tracking-widest",
            status.style
          )}
        >
          {status.icon}
          {status.label}
        </div>
      </div>

      {/* ── Title ────────────────────────────────────────────────────────────── */}
      <h3 className="font-black text-foreground text-base leading-snug line-clamp-2 mb-2 group-hover:text-destructive/80 transition-colors">
        {task.title}
      </h3>

      {/* ── Description ──────────────────────────────────────────────────────── */}
      {task.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
          {task.description}
        </p>
      )}

      {/* ── Tags ─────────────────────────────────────────────────────────────── */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {task.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-muted/60 text-muted-foreground rounded-full text-[10px] font-bold tracking-wide"
            >
              <Tag size={9} />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* ── Spacer — pushes footer to bottom ─────────────────────────────────── */}
      <div className="flex-1" />

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <div className="mt-4 pt-4 border-t border-border/40 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-700">

        {/* Date rows — each on its own line, clearly labelled */}
        <div className="space-y-1.5">
          {formattedDueDate && (
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-semibold cursor-default group/due">
              <Calendar size={11} className="shrink-0 text-amber-500 group-hover/due:animate-bounce" />
              <span className="text-amber-600 dark:text-amber-400 font-black uppercase tracking-widest ">
                {t("dueDate") ?? "Due"}
              </span>
              <span>{formattedDueDate}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-semibold group/delete cursor-default">
            <Clock size={11} className="shrink-0 text-destructive/60 group-hover/delete:animate-spin" />
            <span className="text-destructive/70 font-black uppercase tracking-widest">
              {t("deletedAt") ?? "Deleted"}
            </span>
            <span>{formattedDeletedAt}</span>
          </div>
        </div>

        {/* Action buttons — always visible, full width, clearly labelled */}
        <div className="flex items-center flex-wrap gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRestore(task._id);
            }}
            disabled={isActioning}
            className="flex-1 rounded-2xl gap-2 h-9 text-xs font-bold border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-200 cursor-pointer"
          >
            {isActioning ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <ArchiveRestore size={13} />
            )}
            {t("restore")}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task._id);
            }}
            disabled={isActioning}
            className="flex-1 rounded-2xl gap-2 h-9 text-xs font-bold border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50 transition-all duration-200 cursor-pointer"
          >
            {isActioning ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Trash2 size={13} />
            )}
            {t("hardDelete")}
          </Button>
        </div>
      </div>
    </div>
  );
}
