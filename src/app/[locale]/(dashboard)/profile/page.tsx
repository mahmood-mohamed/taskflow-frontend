"use client";

import { useEffect, useState } from "react";
import { Loader2, LogOut } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { toast } from "react-hot-toast";
import { ProfileHeader } from "@/components/organisms/ProfileHeader";
import { UpdateInfoForm } from "@/components/organisms/UpdateInfoForm";
import { ChangePasswordSection } from "@/components/organisms/ChangePasswordSection";
import { DangerZone } from "@/components/organisms/DangerZone";
import { LogoutButton } from "@/components/molecules/LogoutButton";
import { useTranslations } from "next-intl";

export default function ProfilePage() {
  const t = useTranslations("Profile");
  const [userData, setUserData] = useState<{ username: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch User Data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("users/me");
        setUserData(response.data.data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!userData) return null;

  return (
    <main className="min-h-screen pb-24 md:pb-10 pt-6 px-2 animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Profile Header Organism */}
        <ProfileHeader 
          username={userData.username} 
          email={userData.email} 
          />
        {/* Update Info Organism */}
        <UpdateInfoForm 
          defaultValues={{ username: userData.username, email: userData.email }} 
          onSuccess={(newData) => setUserData(prev => prev ? { ...prev, ...newData } : null)}
        />

        {/* Change Password Organism */}
        <ChangePasswordSection />

        {/* Logout Section (Mobile Only) */}
        <div className="md:hidden space-y-6">
          <div className="h-px bg-border w-full" />
          <div className="space-y-4">
            <div className="px-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <LogOut size={20} className="text-primary" />
                {t("logoutSectionTitle")}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {t("logoutSectionDesc")}
              </p>
            </div>
            <LogoutButton className="bg-muted border-border hover:bg-accent h-14 rounded-2xl w-full" />
          </div>
        </div>

        {/* Danger Zone Organism */}
        <DangerZone />
      </div>
    </main>
  );
}
