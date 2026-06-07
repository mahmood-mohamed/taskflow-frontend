"use client";

import * as React from "react";
import { Calendar, Tag, Trash2, CheckCircle2, Circle, Clock, MoreVertical, Pencil, PlayCircle, ChevronDown, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface TaskCardProps {
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
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: string) => void;
  onViewDetails?: (task: any) => void;
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange, onViewDetails }: TaskCardProps) {
  const locale = useLocale();
  const t = useTranslations("Tasks");

  const [isMoreMenuOpen, setIsMoreMenuOpen] = React.useState(false);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = React.useState(false);
  const isAnyMenuOpen = isMoreMenuOpen || isStatusMenuOpen;

  const priorityStyles = {
    low: "text-priority-low bg-priority-low/10 border-priority-low/20",
    medium: "text-priority-medium bg-priority-medium/10 border-priority-medium/20",
    high: "text-priority-high bg-priority-high/10 border-priority-high/20",
  };

  const statusConfig = {
    todo: {
      icon: Circle,
      style: "text-slate-500 bg-slate-100 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800",
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

  const currentStatus = statusConfig[task.status] || statusConfig.todo;

  const date = new Date(task.dueDate || "");
  const timeFormatted = date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className={cn(
        "group relative bg-card border border-border/60 hover:border-primary/40 rounded-[2.5rem] p-6 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col h-full animate-in fade-in zoom-in-95 duration-700",
        isAnyMenuOpen ? "z-30" : "z-10",
        task.status === "done" && "opacity-80"
      )}
    >

      {/* Decorative Glow */}
      <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none">
        <div className="absolute -top-10 -end-10 w-32 h-32 bg-primary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute -bottom-10 -end-10 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>

      {/* Header: Priority & Actions */}
      <div className="flex items-center justify-between mb-5 relative animate-in fade-in slide-in-from-right-3 duration-700">
        <div
          title={t("priority") + ": " + t(task.priority)}
          className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black capitalize tracking-widest shadow-md hover:shadow-lg cursor-default", priorityStyles[task.priority])}>
          <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse",
            task.priority === 'high' ? 'bg-priority-high' :
              task.priority === 'medium' ? 'bg-priority-medium' : 'bg-priority-low'
          )} />
          {t(task.priority)}
        </div>

        <DropdownMenu onOpenChange={setIsMoreMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              title={t("moreOptions")}
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-2xl hover:bg-muted hover:text-primary transition-colors cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical size={18} className="text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={locale === "en" ? "end" : "start"} className="rounded-2xl border-border bg-card shadow-2xl min-w-[160px] p-2 -translate-y-3">
            <DropdownMenuItem
              onClick={() => onViewDetails?.(task)}
              className="rounded-xl px-3 py-2.5 text-primary focus:text-primary focus:bg-primary/10 cursor-pointer gap-3 font-bold"
            >
              <Eye size={16} />
              {t("viewDetails")}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onEdit(task._id)}
              className="rounded-xl px-3 py-2.5 text-primary focus:text-primary focus:bg-primary/10 cursor-pointer gap-3 font-bold"
            >
              <Pencil size={16} />
              {t("updateTask")}
            </DropdownMenuItem>

            {/* Status Sub-menu within Main Actions (Optional) or just separated below */}
            <DropdownMenuItem
              onClick={() => onDelete(task._id)}
              className="rounded-xl px-3 py-2.5 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer gap-3 font-bold"
            >
              <Trash2 size={16} />
              {t("deleteTask")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Body: Title & Description */}
      <div className="flex-1 space-y-3 relative">
        <h3
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails?.(task);
          }}
          className={cn(
            "cursor-pointer font-black text-foreground text-xl group-hover:text-primary transition-colors line-clamp-1 tracking-tight",
            task.status === "done" && "line-through decoration-emerald-500/50 decoration-2 text-muted-foreground"
          )}>
          {task.title}
        </h3>
        <p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed font-medium">
          {task.description || "..."}
        </p>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {task.tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1.5 text-[10px] group/tag hover:text-primary transition-colors font-bold px-3 py-1.5 bg-muted/50 text-muted-foreground rounded-xl border border-transparent group-hover:border-border transition-all cursor-default">
                <Tag size={12} className="text-primary/60 group-hover/tag:text-foreground/60 transition-all" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer: Date & Status Management */}
      <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between flex-wrap gap-3 animate-in slide-in-from-bottom-4 duration-700 relative">
        <div
          title={task.dueDate ? t("dueDate") + ': ' + timeFormatted : t("noDate")}
          className="flex items-center gap-2 text-xs text-muted-foreground font-bold cursor-default group/date">
          <Calendar size={14} className="text-primary/70 transition-all group-hover/date:text-primary group-hover/date:animate-bounce" />
          {task.dueDate ? timeFormatted : t("noDate")}
        </div>

        <div className="flex items-center gap-2">
          {/* Status Dropdown / Button */}
          <DropdownMenu onOpenChange={setIsStatusMenuOpen}>
            <DropdownMenuTrigger asChild>
              {task.status === "done" ? (
                <Button
                  onClick={(e) => e.stopPropagation()}
                  variant="ghost"
                  size="sm"
                  className={cn("h-9 px-4 rounded-xl text-[11px] font-black capitalize tracking-tight gap-2 cursor-pointer border border-transparent hover:border-emerald-500/20", currentStatus.style)}
                >
                  <CheckCircle2 size={14} />
                  {t("done")}
                  <ChevronDown size={12} className="opacity-50" />
                </Button>
              ) : task.status === "in-progress" ? (
                <Button
                  onClick={(e) => e.stopPropagation()}
                  variant="ghost"
                  size="sm"
                  className={cn("h-9 px-2 lg:px-4 rounded-xl text-[11px] font-black capitalize tracking-tight gap-2 cursor-pointer border border-transparent hover:border-indigo-500/20", currentStatus.style)}
                >
                  <Clock size={14} />
                  {t("inprogress")}
                  <ChevronDown size={12} className="opacity-50" />
                </Button>
              ) : (
                <Button
                  onClick={(e) => e.stopPropagation()}
                  variant="ghost"
                  size="sm"
                  className={cn("h-9 px-4 rounded-xl text-[11px] font-black capitalize tracking-tight gap-2 cursor-pointer border border-transparent hover:border-slate-500/20", currentStatus.style)}
                >
                  <Circle size={14} />
                  {t("todo")}
                  <ChevronDown size={12} className="opacity-60" />
                </Button>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align={locale === "en" ? "end" : "start"} className="rounded-2xl border-border bg-card shadow-2xl p-2 min-w-[140px]">
              <DropdownMenuItem
                onClick={() => onStatusChange(task._id, "todo")}
                className="rounded-xl px-3 py-2 text-xs font-bold gap-2 cursor-pointer text-slate-500 focus:bg-slate-100"
              >
                <Circle size={14} />
                {t("todo")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onStatusChange(task._id, "in-progress")}
                className="rounded-xl px-3 py-2 text-xs font-bold gap-2 cursor-pointer text-indigo-600 focus:bg-indigo-50"
              >
                <Clock size={14} />
                {t("inprogress")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onStatusChange(task._id, "done")}
                className="rounded-xl px-3 py-2 text-xs font-bold gap-2 cursor-pointer text-emerald-600 focus:bg-emerald-50"
              >
                <CheckCircle2 size={14} />
                {t("done")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Quick Action Button (Shows only if NOT done) */}
          {task.status !== "done" && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(task._id, task.status === "todo" ? "in-progress" : "done");
              }}
              size="icon"
              className={cn(
                "h-8 w-8 rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer",
                task.status === "todo" ? "bg-indigo-500 hover:bg-indigo-600 shadow-indigo-500/20" : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
              )}
            >
              {task.status === "todo" ? <PlayCircle size={14} /> : <CheckCircle2 size={14} />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
