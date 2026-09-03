"use client";

import { Users, ChevronRight } from "lucide-react";

export default function WelcomeBanner() {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-sm bg-gradient-to-r from-emerald-800 to-teal-900 min-h-[170px] flex items-center px-8 text-white">
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1600"
        alt="Scenery"
        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
      />
      <div className="relative z-10 flex-1">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Johar, Balakram Tudu</h2>
          <span className="text-2xl">👋</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm text-emerald-100 font-medium">
            Welcome back, Admin!
          </p>
          <span className="bg-emerald-500/20 text-emerald-200 text-xs px-2 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1 font-semibold">
            <span className="w-3.5 h-3.5">🛡️</span> Admin
          </span>
        </div>
      </div>

      <div className="relative z-10 bg-brand-900/90 border border-white/10 rounded-2xl p-4 px-6 flex items-center gap-5 backdrop-blur-sm min-w-[240px]">
        <div className="p-3 bg-white/10 rounded-xl">
          <Users className="w-7 h-7 text-white" />
        </div>
        <div>
          <span className="text-3xl font-extrabold text-white leading-none">
            53
          </span>
          <p className="text-xs text-slate-300 font-medium mt-1">
            Total Members
          </p>
          <button className="mt-2 text-xs text-emerald-300 font-semibold hover:underline flex items-center gap-1">
            View Members <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
