"use client";

import { ArrowRight } from "lucide-react";

export default function GroupChatActivity() {
  const chats = [
    {
      name: "General Discussion",
      messages: "12 new messages",
      time: "10:20 AM",
      badge: 12,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80",
    },
    {
      name: "Event Organizers",
      messages: "Ramesh: Meeting at 5 PM",
      time: "09:15 AM",
      badge: 3,
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=80",
    },
    {
      name: "Youth Group",
      messages: "Sita: Don't forget practice.",
      time: "Yesterday",
      badge: 0,
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Group Chat Activity
        </h3>
        <a
          href="#"
          className="text-xs font-semibold text-emerald-700 hover:underline inline-flex items-center"
        >
          View All <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
        </a>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3">
        {chats.map((chat) => (
          <div key={chat.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h6 className="text-xs font-bold text-slate-800">{chat.name}</h6>
                <span className="text-[11px] text-slate-400 truncate max-w-[130px] block">
                  {chat.messages}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">
                {chat.time}
              </span>
              {chat.badge > 0 && (
                <span className="inline-block bg-rose-500 text-white text-[10px] font-bold px-1.5 rounded-full">
                  {chat.badge}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
