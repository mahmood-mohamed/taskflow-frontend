import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  title: string;
  status: string;
  colorClass: string;
  bgClass: string;
  time: string;
  onClick?: () => void;
}

export function TaskItem({ title, status, colorClass, bgClass, time, onClick }: TaskItemProps) {
  const titleLength = title.slice(0, 20);
  return (
    <div 
      onClick={onClick}
      className={cn(
        "py-3.5 flex items-center justify-between gap-2 group transition-colors px-3 -mx-3 rounded-2xl",
        onClick ? "cursor-pointer hover:bg-muted/30" : "cursor-default"
      )}
    >
      <p className="font-bold text-foreground group-hover:text-primary transition-colors cursor-default line-clamp-1">
        {titleLength}
      </p>
      <div className="flex items-center gap-4">
        <span
          title={`Status: ${status}`}
          className={cn(
          `hidden sm:inline-block text-[10px] font-black px-2 py-1 rounded-lg capitalize tracking-tighter border-1 border-dashed border-border hover:scale-105 hover:rotate-1 transition-transform duration-500 cursor-default`, 
          bgClass, 
          colorClass
        )}>
          {status}
        </span>
        <div 
          title={`Created At: ${time}`}
          className="flex items-center gap-1 text-xs text-muted-foreground font-semibold shrink-0 cursor-default group/clock">
          <Clock size={14} className="group-hover/clock:text-primary group-hover/clock:animate-spin transition-all duration-500" />
          {time}
        </div>
      </div>
    </div>
  );
}
