"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { TaskCard } from "@/components/molecules/TaskCard";
import { TaskFilters } from "@/components/molecules/TaskFilters";
import { CreateTaskButton } from "@/components/molecules/CreateTaskButton";
import axiosInstance from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Loader2, Inbox, ListTodo } from "lucide-react";
import Cookies from "js-cookie";
import { Modal } from "@/components/ui/modal";
import { CreateTaskForm } from "@/components/molecules/CreateTaskForm";
import { Pagination } from "@/components/ui/pagination";
import { TaskDetailsModal } from "@/components/molecules/TaskDetailsModal";

export function TasksContent() {
  const t = useTranslations("Tasks");
  const [tasks, setTasks] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [priority, setPriority] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("createdAt_desc");

  // Pagination state
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalTasks, setTotalTasks] = React.useState(0);

  // Modal state for editing
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<any>(null);

  // Modal state for viewing details
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const [detailedTask, setDetailedTask] = React.useState<any>(null);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const params: any = {};
      if (search.trim()) params.search = search.trim();
      if (tags.trim()) params.tags = tags.trim();
      if (status !== "all") params.status = status;
      if (priority !== "all") params.priority = priority;

      const [sortField, sortOrder] = sortBy.split("_");
      params.isDeleted = false;
      params.sortBy = sortField;
      params.sortOrder = sortOrder;
      params.page = page;
      params.limit = 12;

      const response = await axiosInstance.get("tasks", {
        params
      });
      setTasks(response.data.data.tasks || []);
      setTotalPages(response.data.data.pagination?.totalPages || 1);
      setTotalTasks(response.data.data.pagination?.total || 0);
    } catch (error) {
      toast.error(t("taskFetchFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  // Reset page to 1 when filters change
  React.useEffect(() => {
    setPage(1);
  }, [search, tags, status, priority, sortBy]);

  // Debounce and fetch search / filters / page
  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks();
    }, 400);
    return () => clearTimeout(timer);
  }, [search, tags, status, priority, sortBy, page]);

  const handleEdit = async (id: string) => {
    try {
      const response = await axiosInstance.get(`tasks/${id}`);
      setEditingTask(response.data.data);
      setIsModalOpen(true);
    } catch (error) {
      toast.error("Failed to fetch task details");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axiosInstance.delete(`tasks/${id}/soft-delete`);
      if (response.data.success === true) {
        toast.success(t("taskDeleted"));
        setTasks(tasks.filter(t => t._id !== id));
        await fetchTasks();
      }
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await axiosInstance.patch(`tasks/${id}/status`, { status: newStatus });
      toast.success("Status updated");
      setTasks(tasks.map(t => t._id === id ? { ...t, status: newStatus } : t));
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="flex-1 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* display total number of tasks*/}
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-2">
          <h1 className="text-lg lg:text-3xl font-black tracking-tighter text-foreground">
            {t("listTitle")}
          </h1>
          <p className="text-muted-foreground font-medium">
            {t("listDescription")}
          </p>
        </div>

        <div className="flex items-center justify-between gap-8">
          <p className="flex md:hidden lg:flex items-center justify-center gap-2 font-bold">
            <ListTodo size={22} className="text-primary" />
            {t("totalTasks")}: {totalTasks}
          </p>
          <CreateTaskButton
            variant="default"
            onSuccess={fetchTasks}
          />
        </div>
      </div>

      {/* Filters Section */}
      <TaskFilters
        search={search}
        onSearchChange={setSearch}
        tags={tags}
        onTagsChange={setTags}
        status={status}
        onStatusChange={setStatus}
        priority={priority}
        onPriorityChange={setPriority}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Tasks Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
            <Loader2 className="animate-spin text-primary relative" size={48} />
          </div>
          <p className="text-muted-foreground font-bold animate-pulse">{t("loading")}</p>
        </div>
      ) : tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              onViewDetails={(t) => {
                setDetailedTask(t);
                setIsDetailsOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 md:py-10 lg:py-14 xl:py-18 text-center bg-card/30 border border-dashed border-border rounded-[3rem] animate-in zoom-in-95 duration-500">
          <div className="p-6 bg-muted/50 rounded-full mb-6">
            <Inbox size={48} className="text-muted-foreground/50" />
          </div>
          <h3 className="text-lg lg:text-2xl font-bold text-foreground mb-2">{t("noTasks")}</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-8 font-medium">
            {t("noTasksDescription")}
          </p>
          <CreateTaskButton variant="default" onSuccess={fetchTasks} />
        </div>
      )}

      {/* Pagination Controls */}
      {!isLoading && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          translations={{
            previous: t("previous"),
            next: t("next"),
            pageOf: (current, total) => t("pageOf", { current, total }),
          }}
        />
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        title={t("updateTitle")}
      >
        {editingTask && (
          <CreateTaskForm
            onSuccess={() => {
              setIsModalOpen(false);
              setEditingTask(null);
              fetchTasks();
            }}
            onCancel={() => {
              setIsModalOpen(false);
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
