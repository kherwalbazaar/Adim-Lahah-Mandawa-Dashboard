import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "@/components/AppLayout";
import AuthGate from "@/components/AuthGate";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Adim Lahah Mandawa - Dashboard",
  description: "Unity • Culture • Education • Welfare",
  icons: {
    icon: "/mandawa-logo.png",
    apple: "/mandawa-logo.png",
  },
  openGraph: {
    title: "Adim Lahah Mandawa - Dashboard",
    description: "Unity • Culture • Education • Welfare",
    images: ["/mandawa-logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <AuthGate>
          <AppLayout>{children}</AppLayout>
        </AuthGate>
      </body>
    </html>
  );
}
