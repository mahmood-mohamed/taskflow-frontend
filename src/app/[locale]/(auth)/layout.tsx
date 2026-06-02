export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 md:p-6">
      <div className="w-full max-w-[480px] space-y-10 rounded-[2.5rem] bg-card p-4 sm:p-8 md:p-12 shadow-2xl shadow-primary/10 border border-border transition-all duration-300 animate-in fade-in slide-in-from-bottom-10 duration-500">
        {children}
      </div>
    </div>
  );
}
