"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

interface LogoutButtonProps {
  isCollapsed?: boolean;
  className?: string;
}

export function LogoutButton({ isCollapsed, className }: LogoutButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations("Sidebar");

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/users/logout");
    } catch (error: any) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem("accessToken");
      Cookies.remove("accessToken");
      toast.success(t("logoutSuccess") || "Logged out successfully");
      router.push(`/${locale}/login`);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setShowModal(true)}
        className={cn(
          "flex items-center gap-4 py-4 cursor-pointer transition-all hover:text-destructive hover:bg-destructive/10 group rounded-xl border-none shadow-none bg-transparent h-auto",
          isCollapsed ? "justify-center w-12 h-12 p-0" : "px-4 w-full justify-start",
          className
        )}
      >
        <LogOut size={20} className="text-muted-foreground group-hover:text-destructive shrink-0" />
        {!isCollapsed && <span className="text-sm font-medium">{t("logout")}</span>}
      </Button>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title={t("logoutConfirmTitle")}
      >
        <div className="space-y-6">
          <p className="text-muted-foreground text-sm font-medium">
            {t("logoutConfirmMessage")}
          </p>
          <div className="flex gap-3 pt-2">
            <Button 
              variant="destructive" 
              className="flex-1 py-6 rounded-2xl font-bold transition-all active:scale-95 cursor-pointer"
              onClick={handleLogout}
            >
              {t("confirmLogout")}
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 py-6 rounded-2xl font-bold transition-all active:scale-95 cursor-pointer"
              onClick={() => setShowModal(false)}
            >
              {t("cancel")}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
