"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  Filter,
  Loader2,
  PackageOpen,
  Search,
  ShieldAlert,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ArchiveCard } from "@/components/molecules/ArchiveCard";
import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { Pagination } from "../ui/pagination";
import { TaskDetailsModal } from "@/components/molecules/TaskDetailsModal";

type ConfirmState =
  | { open: false }
  | { open: true; type: "single"; taskId: string }
  | { open: true; type: "all" };

export function ArchiveContent() {
  const t = useTranslations("Archive");

  const [tasks, setTasks] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);
  const [confirm, setConfirm] = React.useState<ConfirmState>({ open: false });

  // Modal state for details
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const [detailedTask, setDetailedTask] = React.useState<any>(null);

  // Pagination state
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalTasks, setTotalTasks] = React.useState(0);

  // ── Filter state ──────────────────────────────────────────────────────────
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  // ── Fetch (once — client-side filter from there) ───────────────────────────
  const fetchArchived = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("tasks", {
        params: {
          isDeleted: true,
          page: page,
          limit: 12,
          sortBy: "createdAt",
          sortOrder: "desc",
        },
        headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
      });
      setTasks(res.data.data.tasks ?? []);
      setTotalPages(res.data.data.pagination.totalPages || 1);
      setTotalTasks(res.data.data.pagination.total || 0);
    } catch {
      toast.error("Failed to load archived tasks");
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  React.useEffect(() => {
    fetchArchived();
  }, [fetchArchived]);

  // ── Client-side filtered view ─────────────────────────────────────────────
  const filteredTasks = React.useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        !search.trim() ||
        task.title.toLowerCase().includes(search.trim().toLowerCase()) ||
        (task.description ?? "").toLowerCase().includes(search.trim().toLowerCase()) ||
        (task.tags ?? []).some((tag: string) =>
          tag.toLowerCase().includes(search.trim().toLowerCase())
        );
      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, search, statusFilter]);

  const hasActiveFilter = search.trim() !== "" || statusFilter !== "all";

  // ── Restore ───────────────────────────────────────────────────────────────
  const handleRestore = async (id: string) => {
    setActionLoading(id);
    try {
      await axiosInstance.patch(
        `tasks/${id}/restore`,
        {},
        { headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` } }
      );
      toast.success(t("restoreSuccess"));
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch {
      toast.error("Failed to restore task");
    } finally {
      setActionLoading(null);
    }
  };

  // ── Hard Delete One ───────────────────────────────────────────────────────
  const handleHardDelete = async (id: string) => {
    setConfirm({ open: false });
    setActionLoading(id);
    try {
      await axiosInstance.delete(`tasks/${id}/hard-delete`, {
        headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
      });
      toast.success(t("deleteSuccess"));
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch {
      toast.error("Failed to permanently delete task");
    } finally {
      setActionLoading(null);
    }
  };

  // ── Hard Delete All ───────────────────────────────────────────────────────
  const handleHardDeleteAll = async () => {
    setConfirm({ open: false });
    setActionLoading("all");
    try {
      await axiosInstance.delete("tasks/hard-delete-all", {
        headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
      });
      toast.success(t("deleteAllSuccess"));
      setTasks([]);
    } catch {
      toast.error("Failed to clear archive");
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirm = () => {
    if (!confirm.open) return;
    if (confirm.type === "all") handleHardDeleteAll();
    else handleHardDelete(confirm.taskId);
  };

  // ── Status options for Select ──────────────────────────────────────────────
  const statusOptions = [
    { label: t("allStatuses"), value: "all" },
    { label: t("todo"), value: "todo" },
    { label: t("inprogress"), value: "in-progress" },
    { label: t("done"), value: "done" },
  ];

  return (
    <>
      <ConfirmDialog
        isOpen={confirm.open}
        title={confirm.open && confirm.type === "all" ? t("deleteAll") : t("hardDelete")}
        description={
          confirm.open && confirm.type === "all"
            ? t("deleteAllWarning")
            : t("confirmDelete")
        }
        confirmLabel={
          confirm.open && confirm.type === "all"
            ? t("deleteAllConfirm")
            : t("hardDelete")
        }
        isLoading={actionLoading === "all"}
        onConfirm={handleConfirm}
        onCancel={() => setConfirm({ open: false })}
      />

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8">
        <div className="space-y-2">
          <h1 className="text-2xl lg:text-4xl font-black tracking-tighter text-foreground">
            {t("title")}
          </h1>
          <p className="text-muted-foreground font-medium max-w-lg">
            {t("description")}
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-destructive/10 text-destructive rounded-full text-[10px] font-black tracking-widest uppercase">
              <ShieldAlert size={12} />
              Archived
            </div>
            {/* Count badge — always visible, animates in after load */}
            {!isLoading && (
              <div className="inline-flex items-center gap-1.5 px-3 py-2 bg-muted/70 text-muted-foreground rounded-full text-[10px] font-black tracking-widest animate-in fade-in duration-500">
                <span className="text-foreground font-black">{totalTasks}</span>
                {t("tasksCount", { count: "" }).replace(/\d+\s?/, "").trim()}
              </div>
            )}
          </div>
        </div>
      </div>

      {!isLoading && totalTasks > 0 && (
        <div className="relative z-30 flex flex-col sm:flex-row gap-3 mb-8 p-4 sm:p-5 bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl sm:rounded-[2rem] shadow-md shadow-black/5">
          <div className="flex-1">
            <Input
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search size={17} />}
              className="bg-background/50 border-border/40 focus:border-primary/50 w-full"
            />
          </div>

          <div className="w-full sm:w-48">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder={t("filterByStatus")}
              icon={<Filter size={15} />}
              className="w-full"
            />
          </div>

          {hasActiveFilter && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => { setSearch(""); setStatusFilter("all"); }}
              title="Clear filters"
              className="rounded-2xl h-11 w-11 shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
            >
              <X size={16} />
            </Button>
          )}
        </div>
      )}

      {!isLoading && hasActiveFilter && tasks.length > 0 && (
        <p className="text-xs text-muted-foreground font-bold mb-5 px-1">
          {t("showingCount", { shown: filteredTasks.length, total: tasks.length })}
        </p>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-destructive/20 blur-2xl rounded-full" />
            <Loader2 className="animate-spin text-destructive relative" size={48} />
          </div>
          <p className="text-muted-foreground font-black animate-pulse">
            {t("loading")}
          </p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center bg-card/30 border border-dashed border-border rounded-[3rem] animate-in zoom-in-95 duration-500">
          <div className="p-6 bg-muted/50 rounded-full mb-6">
            <PackageOpen size={48} className="text-muted-foreground/50" />
          </div>
          <h3 className="text-lg lg:text-2xl font-black text-foreground mb-2">
            {t("noTasks")}
          </h3>
          <p className="text-muted-foreground max-w-sm font-medium">
            {t("noTasksDesc")}
          </p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 md:py-10 xl:py-20 text-center bg-card/20 border border-dashed border-border/60 rounded-[3rem] animate-in zoom-in-95 duration-300">
          <div className="p-5 bg-muted/60 rounded-full mb-5">
            <Search size={36} className="text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-black text-foreground mb-2">
            {t("noResults")}
          </h3>
          <Button
            variant="ghost"
            onClick={() => { setSearch(""); setStatusFilter("all"); }}
            className="mt-3 rounded-2xl text-primary border border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-500 hover:scale-105 cursor-pointer font-bold"
          >
            <X size={14} className="me-2" />
            {t("clearFilters")}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredTasks.map((task) => (
            <ArchiveCard
              key={task._id}
              task={task}
              isActioning={actionLoading === task._id}
              onRestore={handleRestore}
              onDelete={(id) => setConfirm({ open: true, type: "single", taskId: id })}
              onViewDetails={(t) => {
                setDetailedTask(t);
                setIsDetailsOpen(true);
              }}
            />
          ))}
        </div>
      )}

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

      {!isLoading && tasks.length > 0 && (
        <div className="mt-16 rounded-[2.5rem] border border-destructive/40 bg-destructive/5 p-6 sm:p-8 space-y-4 animate-in fade-in duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-destructive">
                <ShieldAlert size={18} />
                <h3 className="font-black text-base tracking-tight">
                  {t("dangerZone")}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground font-medium max-w-md">
                {t("deleteAllWarning")}
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => setConfirm({ open: true, type: "all" })}
              disabled={!!actionLoading}
              className="rounded-2xl px-6 gap-2 font-bold shrink-0 hover:bg-destructive/10 hover:text-destructive hover:shadow-md hover:border-destructive/50 transition-all cursor-pointer"
            >
              {actionLoading === "all" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
              {t("deleteAll")}
            </Button>
          </div>
        </div>
      )}

      {/* Details Modal */}
      <TaskDetailsModal
        task={detailedTask}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setDetailedTask(null);
        }}
        onEdit={(id) => {
          handleRestore(id);
        }}
        onDelete={(id) => {
          setConfirm({ open: true, type: "single", taskId: id });
        }}
        isArchived={true}
      />
    </>
  );
}
