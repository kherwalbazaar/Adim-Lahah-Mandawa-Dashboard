"use client";

import { Menu, Search, Bell, ChevronDown, LogOut, UserRound } from "lucide-react";
import { useState } from "react";

export default function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const [profileOpen, setProfileOpen] = useState(false)

  const handleLogout = () => {
    window.localStorage.removeItem("alm-admin-authenticated")
    window.sessionStorage.removeItem("alm-admin-authenticated")
    window.location.replace("/")
  }

  return (
    <header className="bg-white border-b border-slate-200/80 px-8 py-3.5 flex items-center justify-between gap-4">
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
        title="Toggle sidebar"
        className="text-slate-500 hover:text-slate-800 p-1.5 rounded-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-16 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 border border-slate-200 bg-white px-1.5 py-0.5 rounded text-[11px] font-semibold text-slate-400">
            Ctrl + K
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
            3
          </span>
        </button>

        <div className="relative flex items-center gap-3 border-l border-slate-200 pl-4">
          <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden border border-emerald-600 flex items-center justify-center">
            <img
              src="/Balakram%20Tudu.png"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900">
              Balakram Tudu
            </span>
            <span className="text-[11px] text-slate-400">Admin</span>
          </div>
          <button
            type="button"
            onClick={() => setProfileOpen((open) => !open)}
            aria-label="Open account menu"
            aria-expanded={profileOpen}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full z-50 mt-3 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
              <div className="border-b border-slate-100 px-3 py-2">
                <p className="text-xs font-bold text-slate-800">Balakram Tudu</p>
                <p className="mt-0.5 text-[11px] text-slate-400">Admin account</p>
              </div>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                <UserRound className="h-4 w-4 text-slate-400" />
                <span>My Profile</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
