"use client";

import { ArrowRight } from "lucide-react";

export default function UpcomingEvents() {
  const events = [
    {
      month: "Jan",
      day: "20",
      title: "Night Jatra Program",
      date: "20 Jan 2026 | Bahanada, Khunta",
    },
    {
      month: "Feb",
      day: "15",
      title: "Annual General Meeting",
      date: "15 Feb 2026 | Mandawa Hall",
    },
    {
      month: "Mar",
      day: "05",
      title: "Cultural Dance Event",
      date: "05 Mar 2026 | Mandawa Ground",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Upcoming Events
        </h3>
        <a
          href="#"
          className="text-xs font-semibold text-emerald-700 hover:underline inline-flex items-center"
        >
          View All <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
        </a>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3.5">
        {events.map((event, index) => (
          <div
            key={event.title}
            className={`flex items-center justify-between ${
              index !== events.length - 1
                ? "pb-3 border-b border-slate-100"
                : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="text-center bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-1 min-w-[48px]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  {event.month}
                </span>
                <span className="text-base font-extrabold text-slate-800 leading-none">
                  {event.day}
                </span>
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-800 leading-snug">
                  {event.title}
                </h5>
                <p className="text-[11px] text-slate-400 font-medium">
                  {event.date}
                </p>
              </div>
            </div>
            <span className="bg-emerald-50 border border-emerald-200/60 text-emerald-700 font-bold text-[10px] px-2 py-0.5 rounded-full">
              Upcoming
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
