import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "@/components/AppLayout";

export const metadata: Metadata = {
  title: "Adim Lahah Mandawa - Dashboard",
  description: "Unity • Culture • Education • Welfare",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
