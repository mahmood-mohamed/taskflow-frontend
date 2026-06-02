"use client";

import { Mail, ShieldCheck, User } from "lucide-react";

interface ProfileHeaderProps {
  username: string;
  email: string;
}

export function ProfileHeader({ username, email }: ProfileHeaderProps) {
  const avatarLetter = username?.charAt(0).toUpperCase() || "?";

  return (
    <div className="relative overflow-hidden rounded-3xl bg-card border border-border p-5 sm:p-8 shadow-2xl">
      <div className="absolute top-0 end-0 p-4 sm:p-8 hidden sm:block opacity-10">
        <User size={80} className="text-primary" />
      </div>
      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 relative z-10">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-4xl font-bold shadow-lg shadow-primary/20 ring-4 ring-background">
          {avatarLetter}
        </div>
        <div className="text-center sm:text-left space-y-1 py-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{username}</h1>
          <p className="text-muted-foreground font-medium flex items-center justify-center sm:justify-start gap-2 break-all">
            <Mail size={16} className="shrink-0" />
            {email}
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
            <ShieldCheck size={14} />
            Verified Account
          </div>
        </div>
      </div>
    </div>
  );
}
