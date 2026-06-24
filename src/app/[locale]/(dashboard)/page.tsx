"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Calendar, Loader2 } from "lucide-react";
import { StatsSummary } from "@/components/organisms/StatsSummary";
import { RecentTasks } from "@/components/organisms/RecentTasks";
import { TaskDistribution } from "@/components/organisms/TaskDistribution";
import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { TaskDetailsModal } from "@/components/molecules/TaskDetailsModal";
import { Modal } from "@/components/ui/modal";
import { CreateTaskForm } from "@/components/molecules/CreateTaskForm";

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const tTasks = useTranslations("Tasks");
  const locale = useLocale();

  const [stats, setStats] = React.useState({
    todo: 0,
    inprogress: 0,
    done: 0,
    total: 0,
    completed: 0,
    pending: 0
  });

  const [recentTasks, setRecentTasks] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Modal states
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const [detailedTask, setDetailedTask] = React.useState<any>(null);

  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<any>(null);

  const fetchDashboardData = React.useCallback(async () => {
    setIsLoading(true);
    try {

      // Fetch stats & last tasks in parallel for ultimate speed!
      const [statsRes, tasksRes] = await Promise.all([
        axiosInstance.get("tasks/stats"),
        axiosInstance.get("tasks", {
          params: {
            limit: 7,
            sortBy: "createdAt",
            sortOrder: "desc",
            isDeleted: false
          }
        })
      ]);

      // Map live stats
      const apiStats = statsRes.data.data;
      setStats({
        todo: apiStats.todo || 0,
        inprogress: apiStats["in-progress"] || 0,
        done: apiStats.done || 0,
        total: apiStats.total || 0,
        completed: apiStats.completed || 0,
        pending: apiStats.pending || 0
      });

      // Map live recent tasks
      const apiTasks = tasksRes.data.data.tasks || [];
      const formattedTasks = apiTasks.map((task: any) => {
        let statusLabel = task.status;
        let colorClass = "text-status-todo";
        let bgClass = "bg-status-todo/10";

        if (task.status === "in-progress") {
          statusLabel = t("inprogress") || "In Progress";
          colorClass = "text-status-inprogress";
          bgClass = "bg-status-inprogress/10";
        } else if (task.status === "done") {
          statusLabel = t("done") || "Done";
          colorClass = "text-status-done";
          bgClass = "bg-status-done/10";
        } else {
          statusLabel = t("todo") || "To Do";
        }

        const date = new Date(task.createdAt);
        const timeFormatted = date.toLocaleDateString(locale, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });

        return {
          ...task,
          status: task.status,
          displayStatus: statusLabel,
          colorClass,
          bgClass,
          time: timeFormatted
        };
      });

      setRecentTasks(formattedTasks);
    } catch (error) {
      toast.error("Failed to load dashboard overview");
    } finally {
      setIsLoading(false);
    }
  }, [locale, t]);

  React.useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleEdit = async (id: string) => {
    try {
      const response = await axiosInstance.get(`tasks/${id}`);
      setEditingTask(response.data.data);
      setIsEditModalOpen(true);
    } catch (error) {
      toast.error("Failed to fetch task details");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axiosInstance.delete(`tasks/${id}/soft-delete`, {
        headers: {
          "Authorization": `Bearer ${Cookies.get("accessToken")}`,
        }
      });
      if (response.data.success === true) {
        toast.success("Task deleted successfully!");
        await fetchDashboardData();
      }
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] space-y-4">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
          <Loader2 className="animate-spin text-primary relative" size={48} />
        </div>
        <p className="text-muted-foreground font-black animate-pulse">
          {t("welcomeBack") ? t("welcomeBack").split("!")[0] + "..." : "Loading Workspace..."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{t("title")}</h1>
          <p className="text-muted-foreground font-medium">{t("welcomeBack")}</p>
        </div>
        <Button variant="outline" className="hidden md:flex bg-card border-border text-muted-foreground font-semibold gap-2 px-4 py-5 rounded-xl shadow-sm hover:bg-accent transition-all">
          <Calendar size={18} />
          {t("today")} {new Date().toLocaleDateString(locale)}
        </Button>
      </header>

      {/* KPI Stats Section */}
      <StatsSummary stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tasks Section */}
        <RecentTasks
          locale={locale}
          tasks={recentTasks}
          onTaskClick={(task) => {
            setDetailedTask(task);
            setIsDetailsOpen(true);
          }}
          className="animate-in fade-in slide-in-from-start-8 duration-1000"
        />

        {/* Task Distribution Section */}
        <TaskDistribution stats={stats} className="animate-in fade-in slide-in-from-end-8 duration-1000" />
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTask(null);
        }}
        title={tTasks("updateTitle") || "Edit Task"}
      >
        {editingTask && (
          <CreateTaskForm
            onSuccess={() => {
              setIsEditModalOpen(false);
              setEditingTask(null);
              fetchDashboardData();
            }}
            onCancel={() => {
              setIsEditModalOpen(false);
              setEditingTask(null);
            }}
            initialData={editingTask}
          />
        )}
      </Modal>

      {/* Details Modal */}
      <TaskDetailsModal
        task={detailedTask}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setDetailedTask(null);
        }}
        onEdit={(id) => {
          handleEdit(id);
        }}
        onDelete={(id) => {
          handleDelete(id);
        }}
      />
    </div>
  );
}
