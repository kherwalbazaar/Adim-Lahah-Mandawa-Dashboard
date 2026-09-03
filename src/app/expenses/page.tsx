"use client"

import { useCashBook, useMembers } from "@/lib/firebase-data"
import { formatINR } from "@/data/members"
import { Search, Plus, X, IndianRupee, Trash2, Pencil } from "lucide-react"
import { useState } from "react"
import { ref, push, update, remove } from "firebase/database"
import { database } from "@/lib/firebase"

export default function ExpensesPage() {
  const { txns } = useCashBook()
  const { members } = useMembers()
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [via, setVia] = useState("Cash")

  const expenses = txns.filter((t) => t.type === "Expense")
  const filtered = expenses.filter(
    (e) =>
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.amount.toString().includes(search)
  )

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)
  const collections = members.reduce((s, member) => s + member.totalPaid, 0)
  const availableBalance = collections - totalExpenses

  const openAdd = () => {
    setEditingId(null)
    setAmount("")
    setDescription("")
    setDate(new Date().toISOString().split("T")[0])
    setVia("Cash")
    setFormError(null)
    setModalOpen(true)
  }

  const openEdit = (e: { id: string; amount: number; description: string; date: string; via?: string }) => {
    setEditingId(e.id)
    setAmount(String(e.amount))
    setDescription(e.description)
    setDate(e.date)
    setVia(e.via || "Cash")
    setFormError(null)
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0) {
      setFormError("Please enter a valid amount.")
      return
    }
    if (!description.trim()) {
      setFormError("Please enter a description.")
      return
    }
    if (!date) {
      setFormError("Please select a date.")
      return
    }
    setSubmitting(true)
    setFormError(null)
    try {
      if (editingId) {
        await update(ref(database, `cashBook/${editingId}`), {
          amount: Number(amount),
          description: description.trim(),
          date,
          via,
        })
      } else {
        await push(ref(database, "cashBook"), {
          type: "Expense",
          amount: Number(amount),
          description: description.trim(),
          date,
          via,
          createdAt: Date.now(),
        })
      }
      setModalOpen(false)
      setEditingId(null)
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Failed to save.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return
    await remove(ref(database, `cashBook/${deleteConfirm}`))
    setDeleteConfirm(null)
  }

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-red-500 border-red-700 border-b-4 rounded-xl p-3 flex flex-col justify-center shadow-sm hover:shadow-md transition-all duration-100 active:translate-y-[2px] active:border-b-2" style={{ color: "#ffffff" }}>
          <div className="flex items-center justify-center space-x-2">
            <div className="p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.2)", color: "#ffffff" }}>
              <IndianRupee className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.9)" }}>Total Expenses</span>
          </div>
          <div className="mt-2 text-center">
            <h3 className="text-xl font-bold" style={{ color: "#ffffff" }}>{formatINR(totalExpenses)}</h3>
          </div>
        </div>
        <div className="bg-green-500 border-green-700 border-b-4 rounded-xl p-3 flex flex-col justify-center shadow-sm hover:shadow-md transition-all duration-100 active:translate-y-[2px] active:border-b-2" style={{ color: "#ffffff" }}>
          <div className="flex items-center justify-center space-x-2">
            <div className="p-2 rounded-lg font-bold text-sm" style={{ background: "rgba(255,255,255,0.2)", color: "#ffffff" }}>₹</div>
            <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.9)" }}>Total Collection</span>
          </div>
          <div className="mt-2 text-center">
            <h3 className="text-xl font-bold" style={{ color: "#ffffff" }}>{formatINR(collections)}</h3>
          </div>
        </div>
        <div className="bg-purple-500 border-purple-700 border-b-4 rounded-xl p-3 flex flex-col justify-center shadow-sm hover:shadow-md transition-all duration-100 active:translate-y-[2px] active:border-b-2" style={{ color: "#ffffff" }}>
          <div className="flex items-center justify-center space-x-2">
            <div className="p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.2)", color: "#ffffff" }}>
              <IndianRupee className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.9)" }}>Available Balance</span>
          </div>
          <div className="mt-2 text-center">
            <h3 className="text-xl font-bold" style={{ color: "#ffffff" }}>{formatINR(availableBalance)}</h3>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
          />
        </div>
        <button
          onClick={openAdd}
          className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Expenses Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden">
        <div className="flex bg-slate-50 border-b border-slate-200/80 px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
          <div className="w-[30%] text-left">Description</div>
          <div className="w-[20%]">Amount</div>
          <div className="w-[20%]">Date</div>
          <div className="w-[15%]">Via</div>
          <div className="w-[15%] text-right">Actions</div>
        </div>

        <div className="divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              {search ? "No expenses found matching your search." : "No expenses found."}
            </div>
          ) : (
            filtered.map((e) => (
              <div key={e.id} className="flex items-center px-6 py-2 hover:bg-slate-50 transition-colors text-center whitespace-nowrap">
                <div className="w-[30%] text-left">
                  <p className="text-xs font-bold text-slate-800 truncate">{e.description}</p>
                </div>
                <div className="w-[20%]">
                  <span className="text-xs font-bold text-rose-600">{formatINR(e.amount)}</span>
                </div>
                <div className="w-[20%]">
                  <span className="text-[11px] text-slate-600">{new Date(e.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
                <div className="w-[15%]">
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">{e.via || "Cash"}</span>
                </div>
                <div className="w-[15%] flex justify-end gap-2">
                  <button onClick={() => openEdit(e)} className="text-blue-500 hover:text-blue-700">
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button onClick={() => setDeleteConfirm(e.id)} className="text-rose-400 hover:text-rose-600">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ADD/EDIT EXPENSE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl w-full max-w-md border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">{editingId ? "Edit Expense" : "Add Expense"}</h3>
              <button
                onClick={() => { setModalOpen(false); setEditingId(null) }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <p className="text-[11px] text-slate-500 font-medium mb-1">Amount (₹) *</p>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <p className="text-[11px] text-slate-500 font-medium mb-1">Description *</p>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[11px] text-slate-500 font-medium mb-1">Date *</p>
                  <input
                    type="date"
                    value={date}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none"
                  />
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-medium mb-1">Via</p>
                  <select
                    value={via}
                    onChange={(e) => setVia(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 focus:outline-none"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-xs font-semibold text-red-600">
                  {formError}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-semibold text-xs py-2.5 rounded-lg flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>{submitting ? "Saving..." : editingId ? "Update" : "Add Expense"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl w-full max-w-xs border border-slate-200 shadow-xl p-5 text-center">
            <div className="mx-auto w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center mb-3">
              <Trash2 className="w-5 h-5 text-rose-600" />
            </div>
            <p className="text-sm font-bold text-slate-800 mb-1">Delete Expense?</p>
            <p className="text-[11px] text-slate-500 mb-4">This action cannot be undone.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs py-2 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
