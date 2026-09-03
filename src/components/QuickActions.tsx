"use client"

import { useMembers, useCashBook } from "@/lib/firebase-data"
import { formatINR } from "@/data/members"
import { Users, IndianRupee, Receipt, Wallet } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type Metric = {
  title: string
  value: string
  subtitle: string
  icon: LucideIcon
  bg: string
  border: string
}

export default function QuickActions() {
  const { members, loading } = useMembers()
  const { txns } = useCashBook()

  const totalMembers = members.length
  const totalCollection = members.reduce((s, m) => s + m.totalPaid, 0)
  const totalExpenditure = txns
    .filter((t) => t.type === "Expense")
    .reduce((s, t) => s + t.amount, 0)
  const balance = totalCollection - totalExpenditure

  const metrics: Metric[] = [
    {
      title: "Total Members",
      value: loading ? "..." : String(totalMembers),
      subtitle: "",
      icon: Users,
      bg: "bg-emerald-500",
      border: "border-emerald-700",
    },
    {
      title: "Total Collection",
      value: loading ? "..." : formatINR(totalCollection),
      subtitle: "",
      icon: IndianRupee,
      bg: "bg-blue-500",
      border: "border-blue-700",
    },
    {
      title: "Total Expenditure",
      value: loading ? "..." : formatINR(totalExpenditure),
      subtitle: "",
      icon: Receipt,
      bg: "bg-red-500",
      border: "border-red-700",
    },
    {
      title: "Available Balance",
      value: loading ? "..." : formatINR(balance),
      subtitle: "",
      icon: Wallet,
      bg: "bg-purple-500",
      border: "border-purple-700",
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {metrics.map((metric) => {
        const Icon = metric.icon
        return (
          <div
            key={metric.title}
            className={`${metric.bg} ${metric.border} border-b-4 rounded-xl p-3 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-100 active:translate-y-[2px] active:border-b-2`}
            style={{ color: "#ffffff" }}
          >
            <div className="flex items-center justify-center space-x-2">
              <div className="p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.2)", color: "#ffffff" }}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.9)" }}>{metric.title}</span>
            </div>
            <div className="mt-2 text-center">
              <h3 className="text-xl font-bold" style={{ color: "#ffffff" }}>{metric.value}</h3>
            </div>
          </div>
        )
      })}
    </div>
  )
}
