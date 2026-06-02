import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
  borderColorClass?: string;
}

export function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  colorClass, 
  bgClass,
  borderColorClass 
}: StatCardProps) {
  return (
    <div className={cn(
      "bg-card p-4 sm:p-8 md:p-3 lg:p-8 rounded-2xl border border-border shadow-sm flex items-center gap-4 sm:gap-6 relative overflow-hidden group transition-all",
      borderColorClass || "hover:border-primary/50"
    )}>
      <div className={cn(
        "w-12 h-12 md:w-10 md:h-10 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 animate-in fade-in slide-in-from-start-3 duration-1000",
        bgClass,
        colorClass
      )}>
        <Icon size={24} className="size-6 md:size-5 lg:size-7" />
      </div>
      <div className="animate-in fade-in slide-in-from-end-3 duration-1000">
        <div className="text-3xl md:text-2xl lg:text-4xl font-black text-foreground">{value}</div>
        <div className="text-sm md:text-xs lg:text-sm font-bold text-muted-foreground uppercase tracking-wider">{label}</div>
      </div>
      <div className={cn("absolute bottom-0 left-0 h-1 w-full opacity-20", bgClass)} />
    </div>
  );
}
