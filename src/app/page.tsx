"use client"

import { useMembers, useCashBook } from "@/lib/firebase-data"
import { formatINR } from "@/data/members"
import { Users, ArrowRight, ChevronRight } from "lucide-react"
import QuickActions from "@/components/QuickActions"
import RecentMembers from "@/components/RecentMembers"
import RecentActivities from "@/components/RecentActivities"

export default function Home() {
  const { members, loading } = useMembers()
  const { txns } = useCashBook()

  const totalMembers = members.length
  const totalCollection = members.reduce((s, m) => s + m.totalPaid, 0)
  const totalExpenditure = txns
    .filter((t) => t.type === "Expense")
    .reduce((s, t) => s + t.amount, 0)
  const balance = totalCollection - totalExpenditure

  return (
    <>
      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentMembers />
        <RecentActivities />
      </div>
    </>
  )
}
