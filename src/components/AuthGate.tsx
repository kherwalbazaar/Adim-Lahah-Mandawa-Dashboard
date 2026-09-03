"use client"

import { FormEvent, useEffect, useState } from "react"
import { BarChart3, Eye, EyeOff, LockKeyhole, Shield, ShieldCheck, UserRound, Users, Wallet } from "lucide-react"

const AUTH_KEY = "alm-admin-authenticated"
const ADMIN_ID = "adimlahamandawa@gmail.com"
const ADMIN_PASSWORD = "Mandawa2026"

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [ready, setReady] = useState(false)
  const [adminId, setAdminId] = useState(ADMIN_ID)
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setAuthenticated(
      window.localStorage.getItem(AUTH_KEY) === "true" ||
      window.sessionStorage.getItem(AUTH_KEY) === "true"
    )
    setReady(true)
  }, [])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (adminId.trim().toLowerCase() !== ADMIN_ID || password !== ADMIN_PASSWORD) {
      setError("Invalid Admin ID or password.")
      return
    }

    if (rememberMe) {
      window.localStorage.setItem(AUTH_KEY, "true")
      window.sessionStorage.removeItem(AUTH_KEY)
    } else {
      window.sessionStorage.setItem(AUTH_KEY, "true")
      window.localStorage.removeItem(AUTH_KEY)
    }
    setAuthenticated(true)
    setError("")
  }

  if (!ready) return null
  if (authenticated) return <>{children}</>

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b121e]/95 via-[#0d1c33]/80 to-[#102a4e]/70 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="grid w-full max-w-5xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <section className="hidden text-center lg:block">
            <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-xl border-2 border-amber-300/70 p-3 shadow-2xl shadow-amber-500/10">
              <div className="h-full w-full overflow-hidden rounded-lg border border-dashed border-amber-300/50">
                <img src="/logo.png" alt="Adim Lahah Mandawa logo" className="h-full w-full object-contain" />
              </div>
            </div>
            <h1
              className="mt-6 text-3xl font-extrabold uppercase tracking-[0.2em] text-white"
              style={{ color: "#ffffff" }}
            >
              Adim Lahah Mandawa
            </h1>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-200">Admin Portal</p>
            <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-white">
              Manage members, collections, expenses, and community records in one place.
            </p>
            <div className="mt-8 flex items-center justify-center gap-6 md:gap-8">
              {[
                { icon: Users, label: "Members" },
                { icon: Wallet, label: "Transactions" },
                { icon: BarChart3, label: "Reports" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="group flex flex-col items-center gap-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-lg backdrop-blur-md transition-all duration-200 group-hover:bg-white/20">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs font-medium tracking-wide text-white">{label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-[#0e1c31]/85 p-7 shadow-2xl shadow-black/70 backdrop-blur-xl sm:p-9">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-blue-300/30 bg-[#1b3d75] shadow-inner shadow-blue-500/20">
              <ShieldCheck className="h-8 w-8 text-blue-100" />
            </div>
            <h2
              className="mt-4 text-center text-xl font-bold uppercase tracking-wider text-white"
              style={{ color: "#ffffff" }}
            >
              Admin Login
            </h2>
            <div className="mx-auto my-3 h-px w-28 bg-gradient-to-r from-transparent via-amber-200 to-transparent" />

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-white">Admin ID</span>
                <span className="relative block">
                  <UserRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
                  <input
                    type="email"
                    value={adminId}
                    onChange={(event) => setAdminId(event.target.value)}
                    placeholder="Enter Admin ID"
                    autoComplete="username"
                    className="w-full rounded-lg border border-slate-700/60 bg-[#0a1526]/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/70 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </span>
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-white">Password</span>
                <span className="relative block">
                  <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter Password"
                    autoComplete="current-password"
                    className="w-full rounded-lg border border-slate-700/60 bg-[#0a1526]/80 py-2.5 pl-10 pr-10 text-sm text-white placeholder-white/70 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </span>
              </label>

              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex cursor-pointer items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="h-4 w-4 cursor-pointer rounded border-slate-700 bg-[#0a1526] text-blue-600 focus:ring-0"
                  />
                  <span>Remember me</span>
                </label>
                <a href="#" className="font-medium text-blue-400 transition-colors hover:text-blue-300">
                  Forgot Password?
                </a>
              </div>

              {error && <p className="rounded-lg border border-rose-400/30 bg-rose-500/10 p-2.5 text-xs text-rose-200">{error}</p>}

              <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2.5 text-sm font-semibold shadow-lg shadow-blue-700/30 transition-all hover:from-blue-500 hover:to-blue-400 active:scale-[0.99]">
                <LockKeyhole className="h-4 w-4" />
                <span>LOGIN</span>
              </button>
            </form>

            <div className="mt-6 flex items-center gap-3 text-[11px] uppercase tracking-wider text-white">
              <div className="h-px flex-1 bg-slate-800" />
              <span>Secure Access</span>
              <div className="h-px flex-1 bg-slate-800" />
            </div>
            <div className="mt-5 flex items-center justify-center gap-1.5 text-xs font-light text-white">
              <Shield className="h-3.5 w-3.5 text-white" />
              <span>Your data is safe and encrypted</span>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
