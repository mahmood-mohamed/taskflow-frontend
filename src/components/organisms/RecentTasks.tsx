import { ArrowRight, ClipboardList, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TaskItem } from "../molecules/TaskItem";
import { useTranslations } from "next-intl";

interface RecentTasksProps {
  locale: string;
  tasks: Array<any>;
  onTaskClick?: (task: any) => void;
  className?: string;
}

export function RecentTasks({ locale, tasks, onTaskClick, className }: RecentTasksProps) {
  const t = useTranslations("Dashboard");

  const EmptyState = () => (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <div className="bg-primary/10 p-3 sm:p-4 rounded-full">
        <Cloud size={40} className="text-muted-foreground" />
      </div>
      <p className="text-muted-foreground text-bold text-center">{t("noTasks")}</p>
    </div>
  );


  return (
    <div className={`lg:col-span-2 bg-card p-8 rounded-3xl border border-border shadow-sm space-y-8 flex flex-col h-full ${className}`}>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <ClipboardList size={20} className="text-primary" />
          {t("recentTasks")}
        </h3>
        <Button asChild variant="ghost" className="text-primary font-bold gap-2 hover:bg-primary/5">
          <Link href={`/${locale}/tasks`}>
            {t("viewAll")} <ArrowRight size={16} />
          </Link>
        </Button>
      </div>

      {
        tasks.length > 0 ? (
          <div className="divide-y divide-border flex-1">
            {tasks.map((task, i) => (
              <TaskItem 
                key={i} 
                title={task.title}
                status={task.displayStatus}
                colorClass={task.colorClass}
                bgClass={task.bgClass}
                time={task.time}
                onClick={() => onTaskClick?.(task)}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )
      }
    </div>
  );
}
