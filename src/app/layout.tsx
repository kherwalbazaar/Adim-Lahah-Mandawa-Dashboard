import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "@/components/AppLayout";
import AuthGate from "@/components/AuthGate";

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
        <AuthGate>
          <AppLayout>{children}</AppLayout>
        </AuthGate>
      </body>
    </html>
  );
}
