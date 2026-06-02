import type { Metadata } from "next";
import { Inter, IBM_Plex_Sans_Arabic } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-arabic",
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TaskFlow | Smart Task Management",
  description: "Organize tasks, boost productivity, and manage your workflow efficiently with TaskFlow.",
  icons: {
    icon: "image (5).png",
  }
};


export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  // Choose correct font based on locale
  const fontClass = locale === "ar" ? ibmPlexSansArabic.variable : inter.variable;

  return (
    <html lang={locale} dir={dir} className={`${fontClass} h-full antialiased overflow-x-hidden`} suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans bg-background text-foreground overflow-x-hidden">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster position="top-center" reverseOrder={false} />
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
