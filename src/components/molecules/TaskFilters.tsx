"use client";

import { Search, Filter, SortAsc, SortDesc, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useTranslations } from "next-intl";

interface TaskFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  tags: string;
  onTagsChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  priority: string;
  onPriorityChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function TaskFilters({
  search,
  onSearchChange,
  tags,
  onTagsChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  sortBy,
  onSortChange,
}: TaskFiltersProps) {
  const t = useTranslations("Tasks");

  const statusOptions = [
    { label: t("statusFilter"), value: "all" },
    { label: t("todo"), value: "todo" },
    { label: t("inprogress"), value: "in-progress" },
    { label: t("done"), value: "done" },
  ];

  const priorityOptions = [
    { label: t("priorityFilter"), value: "all" },
    { label: t("low"), value: "low" },
    { label: t("medium"), value: "medium" },
    { label: t("high"), value: "high" },
  ];

  const sortOptions = [
    { label: t("newest"), value: "createdAt_desc" },
    { label: t("oldest"), value: "createdAt_asc" },
    { label: t("dueDateAsc"), value: "dueDate_asc" },
    { label: t("dueDateDesc"), value: "dueDate_desc" },
    { label: t("priorityDesc"), value: "priority_desc" },
    { label: t("priorityAsc"), value: "priority_asc" },
    { label: t("statusDesc"), value: "status_desc" },
    { label: t("statusAsc"), value: "status_asc" },
  ];

  return (
    <div className="relative z-30 flex flex-col xl:flex-row gap-4 mb-8 p-4 sm:p-6 bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl sm:rounded-[2.2rem] shadow-lg shadow-black/5">
      {/* Search Inputs */}
      <div className="flex-[3] flex flex-col sm:flex-row gap-4 w-full">
        <div className="flex-1">
          <Input
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            icon={<Search size={18} />}
            className="bg-background/50 border-border/40 focus:border-primary/50 w-full"
          />
        </div>
        <div className="flex-1">
          <Input
            placeholder={t("searchTagsPlaceholder")}
            value={tags}
            onChange={(e) => onTagsChange(e.target.value)}
            icon={<Tag size={18} />}
            className="bg-background/50 border-border/40 focus:border-primary/50 w-full"
          />
        </div>
      </div>

      {/* Select Filters & Sorter Grid */}
      <div className="flex-[2] grid grid-cols-2 md:flex md:items-center gap-3 w-full xl:w-auto xl:justify-end">
        <div className="col-span-1 w-full md:w-44">
          <Select
            options={statusOptions}
            value={status}
            onChange={onStatusChange}
            placeholder={t("statusFilter")}
            icon={<Filter size={16} />}
            className="w-full"
          />
        </div>

        <div className="col-span-1 w-full md:w-44">
          <Select
            options={priorityOptions}
            value={priority}
            onChange={onPriorityChange}
            placeholder={t("priorityFilter")}
            className="w-full"
          />
        </div>

        <div className="hidden xl:block h-8 w-[1px] bg-border/50 mx-1" />

        <div className="col-span-2 w-full md:w-52">
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={onSortChange}
            placeholder={t("sortBy")}
            icon={sortBy.endsWith("_desc") ? <SortDesc size={16} /> : <SortAsc size={16} />}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
