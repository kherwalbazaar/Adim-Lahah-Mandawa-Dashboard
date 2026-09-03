"use client"

import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useState } from "react"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen flex">
      <Sidebar open={sidebarOpen} />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onToggleSidebar={() => setSidebarOpen((open) => !open)} />
        <div className="flex-1 overflow-y-auto p-8 flex flex-col">
          <div className="flex-1 space-y-7">
            {children}
          </div>
          <footer className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 pt-6 pb-2 mt-6 border-t border-slate-200/60 gap-2">
            <div>© 2026 Adim Lahah Mandawa. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:underline">Privacy Policy</a>
              <span>|</span>
              <a href="#" className="hover:underline">Terms of Use</a>
              <span>|</span>
              <a href="#" className="hover:underline">Help & Support</a>
            </div>
          </footer>
        </div>
      </main>
    </div>
  )
}
