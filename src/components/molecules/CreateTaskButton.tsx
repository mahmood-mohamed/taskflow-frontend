"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { CreateTaskForm } from "./CreateTaskForm";

interface CreateTaskButtonProps {
  variant: "sidebar" | "bottombar" | "default";
  isCollapsed?: boolean;
  onSuccess?: () => void;
}

export function CreateTaskButton({ variant, isCollapsed, onSuccess }: CreateTaskButtonProps) {
  const t = useTranslations("Sidebar");
  const tTasks = useTranslations("Tasks");
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
    // Dispatch a global event so TasksContent/Dashboard can refresh
    window.dispatchEvent(new CustomEvent("task-created"));
    if (onSuccess) onSuccess();
  };

  if (variant === "sidebar") {
    return (
      <>
        <Button
          onClick={() => setIsOpen(true)}
          className="w-full cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Plus size={24} className="font-bold" />
          {!isCollapsed && <span className="text-lg font-bold">{t("createTask")}</span>}
        </Button>

        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={tTasks("createTitle")}
        >
          <CreateTaskForm
            onSuccess={handleSuccess}
            onCancel={() => setIsOpen(false)}
          />
        </Modal>
      </>
    );
  }

  if (variant === "default") {
    return (
      <>
        <Button
          onClick={() => setIsOpen(true)}
          className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-3 py-4 md:py-5 md:px-5 rounded-2xl flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>{tTasks("addTask")}</span>
        </Button>

        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={tTasks("createTitle")}
        >
          <CreateTaskForm
            onSuccess={handleSuccess}
            onCancel={() => setIsOpen(false)}
          />
        </Modal>
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="hidden sm:flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-all active:scale-90"
      >
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 -mt-8 border-4 border-background">
          <Plus size={20} />
        </div>
        <span className="text-[10px] font-medium">{t("createTask")}</span>
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={tTasks("createTitle")}
      >
        <CreateTaskForm
          onSuccess={handleSuccess}
          onCancel={() => setIsOpen(false)}
        />
      </Modal>
    </>
  );
}
