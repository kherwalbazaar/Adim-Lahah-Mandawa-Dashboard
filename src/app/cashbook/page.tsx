"use client"

import { useEffect, useMemo, useState } from "react"
import { ref, push } from "firebase/database"
import { database } from "@/lib/firebase"
import { onValue } from "firebase/database"
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  Tooltip,
} from "chart.js"
import { Doughnut, Line } from "react-chartjs-2"
import {
  Wallet,
  ArrowDown,
  ArrowUp,
  Calculator,
  Search,
  Filter,
  Info,
  PieChart,
  ArrowRightLeft,
  Plus,
  X,
} from "lucide-react"
import { buildCashbook, type CashbookData, type RawMap } from "@/lib/cashbook"
import type { Member, Payment } from "@/data/members"

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  Tooltip
)

const fmt = (n: number) =>
  n.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })

function formatTime(ts: number) {
  const d = new Date(ts)
  let hours = d.getHours()
  const minutes = d.getMinutes()
  const ampm = hours >= 12 ? "PM" : "AM"
  hours = hours % 12 || 12
  return `${hours}:${String(minutes).padStart(2, "0")} ${ampm}`
}

function toDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function getPaymentHistory(member: Member): Payment[] {
  const history = member.paymentHistory as Payment[] | Record<string, Payment> | null | undefined
  if (!history) return []
  if (Array.isArray(history)) return history
  return Object.entries(history).map(([id, payment]) => ({ ...payment, id }))
}

type Metric = {
  label: string
  value: string
  icon: React.ElementType
  bg: string
  border: string
}

function MetricCard({ metric }: { metric: Metric }) {
  const Icon = metric.icon
  return (
    <div
      className={`${metric.bg} ${metric.border} border-b-4 rounded-xl p-3 flex flex-col justify-center shadow-sm hover:shadow-md transition-all duration-100 active:translate-y-[2px] active:border-b-2`}
      style={{ color: "#ffffff" }}
    >
      <div className="flex items-center justify-center space-x-2">
        <div className="p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.2)", color: "#ffffff" }}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.9)" }}>{metric.label}</span>
      </div>
      <div className="mt-2 text-center">
        <h3 className="text-xl font-bold" style={{ color: "#ffffff" }}>{metric.value}</h3>
      </div>
    </div>
  )
}

export default function CashBookPage() {
  const [data, setData] = useState<CashbookData | null>(null)
  const [memberCollection, setMemberCollection] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const [modalOpen, setModalOpen] = useState(false)
  const [txnType, setTxnType] = useState<"in" | "out">("in")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [mode, setMode] = useState("cash")
  const [date, setDate] = useState("")
  const [remark, setRemark] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    const cashbookRef = ref(database, "cashBook")
    const membersRef = ref(database, "members")

    let cashbookData: RawMap = null
    let membersData: Record<string, Member> | null = null
    let loaded = false

    const updateData = () => {
      // Merge member payments into cashbook entries
      const merged: Record<string, unknown> = {}
      let totalMemberCollection = 0
      if (cashbookData) {
        Object.entries(cashbookData).forEach(([key, val]) => {
          merged[key] = val
        })
      }
      if (membersData) {
        Object.values(membersData).forEach((member) => {
          getPaymentHistory(member).forEach((payment) => {
            totalMemberCollection += Number(payment.amount ?? 0)
            merged[`member-${member.id}-${payment.id}`] = {
              amount: payment.amount,
              category: payment.description || "Membership Fee",
              mode: payment.method?.toLowerCase() || "cash",
              remark: "Member Fees",
              date: payment.date,
              type: "in",
              createdAt: new Date(payment.date).getTime(),
            }
          })
        })
      }
      setMemberCollection(totalMemberCollection)
      setData(buildCashbook(merged as RawMap, new Date()))
      setLoading(false)
    }

    const unsubCashbook = onValue(
      cashbookRef,
      (snap) => {
        cashbookData = (snap.val() as RawMap) ?? null
        if (!loaded) {
          loaded = true
          updateData()
        } else {
          updateData()
        }
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )

    const unsubMembers = onValue(
      membersRef,
      (snap) => {
        membersData = snap.val() as Record<string, Member> | null
        if (!loaded) {
          loaded = true
          updateData()
        } else {
          updateData()
        }
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )

    return () => {
      unsubCashbook()
      unsubMembers()
    }
  }, [])

  const openAdd = (type: "in" | "out") => {
    setTxnType(type)
    setAmount("")
    setCategory("")
    setMode("cash")
    setDate(toDateKey(new Date()))
    setRemark("")
    setFormError(null)
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    const amt = Number(amount)
    if (!amt || amt <= 0) {
      setFormError("Please enter a valid amount.")
      return
    }
    setSubmitting(true)
    setFormError(null)
    try {
      await push(ref(database, "cashBook"), {
        amount: amt,
        category: category.trim() || (txnType === "in" ? "Other Income" : "Other"),
        mode,
        remark: remark.trim(),
        date: date || toDateKey(new Date()),
        type: txnType,
        createdAt: Date.now(),
      })
      setModalOpen(false)
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Failed to save transaction.")
    } finally {
      setSubmitting(false)
    }
  }

  const filtered = useMemo(() => {
    if (!data) return []
    const q = search.trim().toLowerCase()
    if (!q) return data.entries
    return data.entries.filter(
      (e) =>
        e.category.toLowerCase().includes(q) ||
        e.remark.toLowerCase().includes(q) ||
        e.date.includes(q) ||
        e.mode.toLowerCase().includes(q)
    )
  }, [data, search])

  const metrics = data?.metrics
  const metricCards: Metric[] = [
    {
      label: "Available Balance",
      value: metrics ? `₹${fmt(metrics.closing)}` : "—",
      icon: Calculator,
      bg: "bg-amber-500",
      border: "border-amber-700",
    },
    {
      label: "Total Collections",
      value: data ? `₹${fmt(memberCollection)}` : "—",
      icon: ArrowDown,
      bg: "bg-emerald-500",
      border: "border-emerald-700",
    },
    {
      label: "Total Expense",
      value: metrics ? `₹${fmt(metrics.totalOut)}` : "—",
      icon: ArrowUp,
      bg: "bg-red-500",
      border: "border-red-700",
    },
  ]

  const monthIn = metrics?.monthIn ?? 0
  const monthOut = metrics?.monthOut ?? 0
  const totalFlow = monthIn + monthOut
  const inPct = totalFlow > 0 ? Math.round((monthIn / totalFlow) * 1000) / 10 : 0
  const outPct = totalFlow > 0 ? Math.round((monthOut / totalFlow) * 1000) / 10 : 0
  const netFlow = monthIn - monthOut

  const doughnutData = {
    labels: ["Collection", "Expense"],
    datasets: [
      {
        data: [monthIn, monthOut],
        backgroundColor: ["#10b981", "#ef4444"],
        borderWidth: 0,
        hoverOffset: 2,
      },
    ],
  }
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "75%",
    plugins: { legend: { display: false } },
  }

  const trendValues = data?.trend ?? []
  const trendMax = Math.max(
    100000,
    Math.ceil((Math.max(0, ...trendValues.map((t) => t.value)) + 2000) / 1000) * 1000
  )
  const lineData = {
    labels: trendValues.map((t) => t.label),
    datasets: [
      {
        data: trendValues.map((t) => t.value),
        borderColor: "#2563eb",
        borderWidth: 2,
        backgroundColor: "rgba(37, 99, 235, 0.15)",
        fill: true,
        tension: 0.3,
        pointRadius: 3,
        pointBackgroundColor: "#2563eb",
      },
    ],
  }
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 9 }, color: "#94a3b8" },
      },
      y: {
        grid: { color: "#f1f5f9" },
        ticks: {
          font: { size: 9 },
          color: "#94a3b8",
          callback: (v: string | number) =>
            v === 0 ? "₹0" : `${Number(v) / 1000}K`,
        },
        min: 0,
        max: trendMax,
      },
    },
  }

  return (
    <>
      {/* METRIC CARDS */}
      <div className="-mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metricCards.map((m) => (
          <MetricCard key={m.label} metric={m} />
        ))}
      </div>

      {loading && (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-400">
          Loading cash book...
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center text-xs text-red-500">
          Failed to load: {error}
        </div>
      )}

      {!loading && !error && data && (
        <div className="bg-white rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-800 mb-3">
              Cash Book Transactions
            </h3>

            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-slate-400">
                  <Search className="w-3.5 h-3.5" />
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search description or ref..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <button
                type="button"
                className="flex items-center space-x-1 text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-600 hover:bg-slate-100"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filter</span>
              </button>
            </div>

            <div className="space-y-3">
              {filtered.length === 0 && (
                <div className="py-6 text-center text-xs text-slate-400">
                  No transactions found.
                </div>
              )}
              {filtered.map((e) => {
                const isIn = e.type === "in"
                const balance = data.running.get(e.id) ?? 0
                return (
                  <div
                    key={e.id}
                    className={`rounded-xl border-l-4 border p-3 shadow-sm ${
                      isIn
                        ? "border-l-emerald-500 border-emerald-200 bg-emerald-50"
                        : "border-l-red-500 border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="grid gap-3 text-[11px] sm:grid-cols-4">
                      <div className="min-w-0">
                        <p className="whitespace-nowrap text-[10px] text-slate-400">Date &amp; Time</p>
                        <p className="whitespace-nowrap font-semibold text-slate-700">
                          {e.date} <span className="font-normal text-slate-400">{formatTime(e.createdAt)}</span>
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="whitespace-nowrap text-[10px] text-slate-400">Description</p>
                        <p className="truncate font-medium text-slate-800">{e.remark || "—"}</p>
                      </div>
                      <div className="justify-self-end text-right">
                        <p className="whitespace-nowrap text-[10px] text-slate-400">{isIn ? "Collection" : "Expense"}</p>
                        <p className={`font-bold ${isIn ? "text-emerald-700" : "text-red-700"}`}>
                          ₹{fmt(e.amount)}
                        </p>
                      </div>
                      <div className="justify-self-end text-right">
                        <p className="whitespace-nowrap text-[10px] text-slate-400">Close Balance</p>
                        <p className="font-bold text-slate-800">₹{fmt(balance)}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3 text-xs text-slate-500">
              <p>Showing 1 to {filtered.length} of {filtered.length} entries</p>
            </div>
            <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-2.5 mt-3 flex items-center space-x-2 text-xs text-blue-600">
              <Info className="w-4 h-4 shrink-0" />
              <span>Note: Cash Book shows your all cash expenditure and outflow transactions.</span>
            </div>
          </div>
        </div>
      )}

    </>
  )
}
