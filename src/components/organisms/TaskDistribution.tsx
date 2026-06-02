"use client";

import { useState, useMemo } from "react";
import { ChartPie } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface TaskDistributionProps {
  stats: {
    todo: number;
    inprogress: number;
    done: number;
    total: number;
  };
  className?: string;
}

export function TaskDistribution({ stats, className }: TaskDistributionProps) {
  const t = useTranslations("Dashboard");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const total = stats.total || 1;

  const data = useMemo(() => [
    { id: "done", label: t("done"), value: stats.done, color: "var(--status-done)", className: "text-status-done " },
    { id: "inprogress", label: t("inprogress"), value: stats.inprogress, color: "var(--status-inprogress)", className: "text-status-inprogress" },
    { id: "todo", label: t("todo"), value: stats.todo, color: "var(--status-todo)", className: "text-status-todo" },
  ], [stats, t]);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  const doneOffset = 0;
  const inProgressOffset = (stats.done / total) * circumference;
  const todoOffset = ((stats.done + stats.inprogress) / total) * circumference;

  return (
    <div className={`bg-card p-8 rounded-3xl border border-border shadow-sm space-y-2 flex flex-col items-center h-full transition-all hover:border-primary/30 ${className}`}>
      <h3 className="text-xl font-bold text-foreground self-start flex items-center gap-2">
        <ChartPie size={20} className="text-primary" />
        {t("distribution")}
      </h3>

      <div className="relative w-48 h-48 mt-4 group">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 overflow-visible">
          <circle
            cx="50" cy="50" r={radius}
            fill="transparent"
            stroke="var(--status-done)"
            strokeWidth={hoveredId === 'done' ? 14 : 10}
            strokeDasharray={`${(stats.done / total) * circumference} ${circumference}`}
            strokeDashoffset={-doneOffset}
            className="transition-all duration-300 ease-in-out cursor-pointer hover:opacity-80"
            onMouseEnter={() => setHoveredId('done')}
            onMouseLeave={() => setHoveredId(null)}
          />
          <circle
            cx="50" cy="50" r={radius}
            fill="transparent"
            stroke="var(--status-inprogress)"
            strokeWidth={hoveredId === 'inprogress' ? 14 : 10}
            strokeDasharray={`${(stats.inprogress / total) * circumference} ${circumference}`}
            strokeDashoffset={-inProgressOffset}
            className="transition-all duration-300 ease-in-out cursor-pointer hover:opacity-80"
            onMouseEnter={() => setHoveredId('inprogress')}
            onMouseLeave={() => setHoveredId(null)}
          />
          <circle
            cx="50" cy="50" r={radius}
            fill="transparent"
            stroke="var(--status-todo)"
            strokeWidth={hoveredId === 'todo' ? 14 : 10}
            strokeDasharray={`${(stats.todo / total) * circumference} ${circumference}`}
            strokeDashoffset={-todoOffset}
            className="transition-all duration-300 ease-in-out cursor-pointer hover:opacity-80"
            onMouseEnter={() => setHoveredId('todo')}
            onMouseLeave={() => setHoveredId(null)}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
          <div className="text-center animate-in fade-in duration-300">
            <span className={cn(
              "text-3xl font-black transition-colors block",
              hoveredId === 'done' && "text-status-done",
              hoveredId === 'inprogress' && "text-status-inprogress",
              hoveredId === 'todo' && "text-status-todo",
              !hoveredId && "text-foreground"
            )}>
              {hoveredId ? stats[hoveredId as keyof typeof stats] : stats.total}
            </span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              {hoveredId ? t(hoveredId) : t("totalTasks")}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full space-y-3 pt-4">
        {data.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex items-center justify-between group px-4 py-2.5 rounded-xl transition-all border border-transparent",
              hoveredId === item.id ? "bg-accent/50 border-border" : "hover:bg-accent/30"
            )}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-3 h-3 rounded-full border-2 border-background shadow-sm ring-2 transition-all",
                item.className.replace('text-', 'bg-'),
                hoveredId === item.id ? item.className.replace('text-', 'ring-') : "ring-transparent"
              )} />
              <span className={cn(
                "text-sm font-bold transition-colors",
                hoveredId === item.id ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
              )}>
                {item.label}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm font-black text-foreground">
              <span>{item.value}</span>
              <span className="text-[10px] text-muted-foreground/60 w-8 text-right">
                {Math.round((item.value / total) * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
