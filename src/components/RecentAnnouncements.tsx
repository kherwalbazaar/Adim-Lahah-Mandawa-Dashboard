"use client";

import { Megaphone, ArrowRight } from "lucide-react";

export default function RecentAnnouncements() {
  const announcements = [
    { title: "Night Jatra Program", date: "20 Jan 2026", postedBy: "Admin" },
    {
      title: "Annual General Meeting",
      date: "10 Jan 2026",
      postedBy: "Admin",
    },
    {
      title: "New Member Guidelines",
      date: "05 Jan 2026",
      postedBy: "Admin",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Recent Announcements
        </h3>
        <a
          href="#"
          className="text-xs font-semibold text-emerald-700 hover:underline inline-flex items-center"
        >
          View All <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
        </a>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-4">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 pb-2 border-b border-slate-100">
          <span>Title</span>
          <span>Date</span>
          <span>Posted By</span>
        </div>

        <div className="divide-y divide-slate-100">
          {announcements.map((announcement) => (
            <div
              key={announcement.title}
              className="py-2.5 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2 max-w-[55%]">
                <Megaphone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate font-semibold text-slate-700">
                  {announcement.title}
                </span>
              </div>
              <span className="text-slate-400 text-[11px]">
                {announcement.date}
              </span>
              <span className="text-slate-500 font-medium text-[11px]">
                {announcement.postedBy}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
