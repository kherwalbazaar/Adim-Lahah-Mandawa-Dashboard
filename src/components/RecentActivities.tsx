"use client"

import { useMembers, useCashBook } from "@/lib/firebase-data"
import { UserPlus, ArrowRight } from "lucide-react"

function formatDate(dateStr: string) {
  if (!dateStr) return "Recently"
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days} days ago`

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export default function RecentActivities() {
  const { members } = useMembers()
  const { txns } = useCashBook()

  const activities: { icon: React.ReactNode; title: string; highlight?: string; suffix?: string; time: string; date: string; iconBg: string; iconText: string }[] = []

  // Get recent members (last 2)
  const recentMembers = [...members]
    .sort((a, b) => {
      const aId = a.id.replace("mandwa-", "")
      const bId = b.id.replace("mandwa-", "")
      return Number(bId) - Number(aId)
    })
    .slice(0, 2)

  recentMembers.forEach((m) => {
    activities.push({
      icon: <UserPlus className="w-4 h-4" />,
      title: `New member`,
      highlight: m.name,
      suffix: ` joined`,
      time: formatDate(m.paidDate || ""),
      date: m.paidDate || "",
      iconBg: "bg-emerald-100",
      iconText: "text-emerald-700",
    })
  })

  // Get recent payments (last 3)
  const recentPayments = [...txns]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  recentPayments.forEach((t) => {
    activities.push({
      icon: <span className="text-xs font-bold">₹</span>,
      title: `${t.type === "Income" ? "Received" : "Paid"} ₹${t.amount.toLocaleString("en-IN")}`,
      highlight: t.description,
      time: formatDate(t.date),
      date: t.date,
      iconBg: t.type === "Income" ? "bg-emerald-100" : "bg-rose-100",
      iconText: t.type === "Income" ? "text-emerald-700" : "text-rose-600",
    })
  })

  // Sort all activities by date
  activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const displayActivities = activities.slice(0, 5)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Recent Activities
        </h3>
        <a
          href="#"
          className="text-xs font-semibold text-emerald-700 hover:underline inline-flex items-center"
        >
          View All <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
        </a>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3">
        {displayActivities.length === 0 ? (
          <div className="py-6 text-center text-slate-400 text-xs">
            No recent activities
          </div>
        ) : (
          displayActivities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3">
              <div
                className={`w-8 h-8 rounded-full ${activity.iconBg} ${activity.iconText} flex items-center justify-center shrink-0 mt-0.5`}
              >
                {activity.icon}
              </div>
              <div className="flex-1">
                <h6 className="text-xs font-bold text-slate-800">
                  {activity.title}
                  {activity.highlight && (
                    <span className="text-brand-600"> {activity.highlight}</span>
                  )}
                  {activity.suffix && activity.suffix}
                </h6>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-slate-400">{activity.time}</span>
                  {activity.date && (
                    <>
                      <span className="text-[10px] text-slate-300">•</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(activity.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
