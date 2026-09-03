"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  Wallet,
  Receipt,
  User,
  Settings,
  IndianRupee,
} from "lucide-react"

type NavItem = {
  icon: typeof LayoutDashboard
  label: string
  href: string
  badge?: string | number
  disabled?: boolean
}

export default function Sidebar({ open }: { open: boolean }) {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Users, label: "Members", href: "/members" },
    { icon: BookOpen, label: "Cash Book", href: "/cashbook" },
    { icon: IndianRupee, label: "Expenses", href: "/expenses" },
    { icon: Calendar, label: "Events", href: "/events", disabled: true },
    { icon: Wallet, label: "Payments", href: "/payments", disabled: true },
    { icon: Receipt, label: "Payment History", href: "/payment-history", disabled: true },
    { icon: User, label: "My Profile", href: "/profile", disabled: true },
    { icon: Settings, label: "Settings", href: "/settings", disabled: true },
  ]

  return (
    <aside className={`${open ? "w-72 p-6" : "w-0 p-0"} overflow-hidden bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 transition-[width,padding] duration-300 ease-in-out`}>
      <div className={`${open ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"} space-y-6 transition-[transform,opacity] duration-200 ease-out`}>
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full border-2 border-emerald-600 p-1 flex items-center justify-center mb-3">
            <div className="w-full h-full rounded-full bg-emerald-50 flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="ALM Logo" className="w-full h-full object-cover" />
            </div>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-800 uppercase">
            Adim Lahah Mandawa
          </h1>
        </div>

        <nav className="space-y-1.5 pt-2">
          {navItems.map((item) => {
            const isActive = !item.disabled && pathname === item.href
            const content = (
                <div className="flex items-center gap-3.5">
                  <item.icon
                    className={`w-5 h-5 ${isActive ? "" : item.disabled ? "text-slate-300" : "text-slate-400"}`}
                  />
                  <span>{item.label}</span>
                </div>
            )
            const itemClass = `flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
              isActive
                ? "bg-brand-900 text-white shadow-sm shadow-emerald-950/20"
                : item.disabled
                  ? "cursor-not-allowed text-slate-300"
                  : "text-slate-600 hover:bg-slate-100"
            }`
            return item.disabled ? (
              <div key={item.label} className={itemClass} aria-disabled="true">
                {content}
                {item.badge && (
                  <span className="bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
            ) : (
              <Link key={item.label} href={item.href} className={itemClass}>
                {content}
                {item.badge && (
                  <span className="bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
