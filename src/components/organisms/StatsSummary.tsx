import { ListTodo, CircleEllipsis, CheckCircle2 } from "lucide-react";
import { StatCard } from "../molecules/StatCard";
import { useTranslations } from "next-intl";

interface StatsSummaryProps {
  stats: {
    total: number;
    pending: number;
    completed: number;
  };
}

export function StatsSummary({ stats }: StatsSummaryProps) {
  const t = useTranslations("Dashboard");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        label={t("totalTasks")}
        value={stats.total}
        icon={ListTodo}
        colorClass="text-primary"
        bgClass="bg-primary/10"
      />
      <StatCard
        label={t("pendingTasks")}
        value={stats.pending}
        icon={CircleEllipsis}
        colorClass="text-status-inprogress"
        bgClass="bg-status-inprogress/10"
        borderColorClass="hover:border-status-inprogress/50"
      />
      <StatCard
        label={t("completedTasks")}
        value={stats.completed}
        icon={CheckCircle2}
        colorClass="text-status-done"
        bgClass="bg-status-done/10"
        borderColorClass="hover:border-status-done/50"
      />
    </div>
  );
}
