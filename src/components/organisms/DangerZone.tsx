"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Loader2, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import axiosInstance from "@/lib/axios";
import { toast } from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import Cookies from "js-cookie";
import { handleBackendError } from "@/lib/error-handler";

export function DangerZone() {
  const t = useTranslations("Profile");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await axiosInstance.delete("/users/delete-account");
      toast.success("Account deleted successfully");
      localStorage.removeItem("accessToken");
      Cookies.remove("accessToken");
      router.push(`/${locale}/register`);
    } catch (error: any) {
      handleBackendError(error);
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <Card className="border-destructive/50 bg-card rounded-3xl overflow-hidden shadow-xl">
        <CardHeader className="p-5 sm:p-8 pb-4 sm:pb-4">
          <CardTitle className="text-xl font-bold text-destructive flex items-center gap-2">
            <Trash2 size={20} />
            {t("dangerZone")}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {t("deleteAccountDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 sm:p-8 pt-4 sm:pt-4">
          <Button
            variant="destructive"
            onClick={() => setShowDeleteModal(true)}
            className="w-full h-12 rounded-xl font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer transition-all active:scale-95 shadow-lg shadow-destructive/20"
          >
            {t("deleteAccount")}
          </Button>
        </CardContent>
      </Card>

      <Modal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)}
        title={t("deleteAccount")}
        className="border-destructive/50"
      >
        <div className="space-y-6">
          <div className="flex justify-center py-4">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
              <Trash2 size={40} />
            </div>
          </div>
          <p className="text-muted-foreground text-center font-medium">
            {t("deleteWarning")}
          </p>
          <div className="flex gap-4 pt-4">
            <Button 
              variant="destructive" 
              className="flex-1 py-6 rounded-2xl font-bold bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20 active:scale-95 cursor-pointer"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="animate-spin mr-2" /> : null}
              {t("deleteAccountConfirm")}
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 py-6 rounded-2xl font-bold border-border hover:bg-muted active:scale-95 cursor-pointer"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              {t("cancel")}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
