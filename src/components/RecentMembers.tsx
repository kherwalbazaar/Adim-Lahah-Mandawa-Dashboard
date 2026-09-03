"use client"

import { useMembers } from "@/lib/firebase-data"
import { formatINR } from "@/data/members"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function RecentMembers() {
  const { members } = useMembers()

  const recentMembers = [...members]
    .sort((a, b) => {
      const aId = a.id.replace("mandwa-", "")
      const bId = b.id.replace("mandwa-", "")
      return Number(bId) - Number(aId)
    })
    .slice(0, 5)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Recent Added Members
        </h3>
        <Link
          href="/members"
          className="text-xs font-semibold text-emerald-700 hover:underline inline-flex items-center"
        >
          View All <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
        </Link>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-4">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 pb-2 border-b border-slate-100">
          <span>Name</span>
          <span>Designation</span>
          <span>Status</span>
          <span>Due</span>
        </div>

        <div className="divide-y divide-slate-100">
          {recentMembers.length === 0 ? (
            <div className="py-6 text-center text-slate-400 text-xs">
              No members found
            </div>
          ) : (
            recentMembers.map((member) => (
              <div
                key={member.id}
                className="py-2.5 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2 max-w-[35%]">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-xs">
                    {member.name.charAt(0)}
                  </div>
                  <span className="truncate font-semibold text-slate-700">
                    {member.name}
                  </span>
                </div>
                <span className="text-slate-500 font-medium text-[11px]">
                  {member.designation}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    member.status === "paid"
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                      : "bg-rose-50 border border-rose-200 text-rose-600"
                  }`}
                >
                  {member.status === "paid" ? "Paid" : "Pending"}
                </span>
                <span
                  className={`font-semibold ${
                    member.due > 0 ? "text-rose-500" : "text-slate-400"
                  }`}
                >
                  {formatINR(member.due)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
