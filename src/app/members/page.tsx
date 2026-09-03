"use client"

import { useMembers } from "@/lib/firebase-data"
import { formatINR, formatDate } from "@/data/members"
import { Users, Search, IndianRupee, Calendar, Plus, X, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import { ref, set, update } from "firebase/database"
import { database } from "@/lib/firebase"
import { EnrichedMember } from "@/data/members"

export default function MembersPage() {
  const { members, loading, deleteMember } = useMembers()
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [designation, setDesignation] = useState("General Member")
  const [formError, setFormError] = useState<string | null>(null)
  const [selectedMember, setSelectedMember] = useState<EnrichedMember | null>(null)
  const [editingMember, setEditingMember] = useState<string | null>(null)
  const [entryOpen, setEntryOpen] = useState(false)
  const [entryAmount, setEntryAmount] = useState("")
  const [entryDate, setEntryDate] = useState("")
  const [entrySubmitting, setEntrySubmitting] = useState(false)
  const [entryError, setEntryError] = useState<string | null>(null)
  const [editingPayment, setEditingPayment] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [memberDeleteConfirm, setMemberDeleteConfirm] = useState<string | null>(null)

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.phone?.includes(search) ||
      m.email?.toLowerCase().includes(search.toLowerCase())
  )

  const totalMembers = members.length
  const paidMembers = members.filter((m) => m.status === "paid").length
  const pendingMembers = members.filter((m) => m.status === "pending").length
  const totalCollected = members.reduce((s, m) => s + m.totalPaid, 0)

  const openAdd = () => {
    setEditingMember(null)
    setName("")
    setPhone("")
    setDesignation("General Member")
    setFormError(null)
    setModalOpen(true)
  }

  const openEditMember = (member: EnrichedMember) => {
    setSelectedMember(null)
    setEditingMember(member.id)
    setName(member.name)
    setPhone(member.phone || "")
    setDesignation(member.designation)
    setFormError(null)
    setModalOpen(true)
  }

  const openEntry = () => {
    setEntryAmount("")
    setEntryDate(new Date().toISOString().split("T")[0])
    setEntryError(null)
    setEntryOpen(true)
  }

  const handleEntry = async () => {
    if (!entryAmount || Number(entryAmount) <= 0) {
      setEntryError("Please enter a valid amount.")
      return
    }
    if (!entryDate) {
      setEntryError("Please select a date.")
      return
    }
    if (!selectedMember) return
    setEntrySubmitting(true)
    setEntryError(null)
    try {
      const paymentId = `pay-${Date.now()}`
      const newPayment = {
        id: paymentId,
        amount: Number(entryAmount),
        date: entryDate,
        description: "Cash",
        method: "Cash" as const,
      }
      const updatedHistory = [...selectedMember.paymentHistory, newPayment]
      const newTotalPaid = updatedHistory.reduce((s, p) => s + p.amount, 0)
      const newStatus = newTotalPaid >= selectedMember.membershipFee ? "paid" : "pending"
      const updatedDesignation = newTotalPaid > 2000 ? "Executive Member" : selectedMember.designation
      await update(ref(database, `members/${selectedMember.id}`), {
        paymentHistory: updatedHistory,
        status: newStatus,
        paidDate: entryDate,
        designation: updatedDesignation,
      })
      setSelectedMember({
        ...selectedMember,
        paymentHistory: updatedHistory,
        totalPaid: newTotalPaid,
        due: Math.max(0, selectedMember.membershipFee - newTotalPaid),
        status: newStatus as "paid" | "pending",
        designation: updatedDesignation,
      })
      setEntryOpen(false)
    } catch (e) {
      setEntryError(e instanceof Error ? e.message : "Failed to add entry.")
    } finally {
      setEntrySubmitting(false)
    }
  }

  const startEdit = (p: { id: string; amount: number; date: string }) => {
    setEditingPayment(p.id)
    setEntryAmount(String(p.amount))
    setEntryDate(p.date)
    setEntryError(null)
    setEntryOpen(true)
  }

  const saveEdit = async () => {
    if (!selectedMember || !editingPayment) return
    if (!entryAmount || Number(entryAmount) <= 0) {
      setEntryError("Please enter a valid amount.")
      return
    }
    if (!entryDate) {
      setEntryError("Please select a date.")
      return
    }
    const updatedHistory = selectedMember.paymentHistory.map((p) =>
      p.id === editingPayment ? { ...p, amount: Number(entryAmount), date: entryDate } : p
    )
    const newTotalPaid = updatedHistory.reduce((s, p) => s + p.amount, 0)
    const newStatus = newTotalPaid >= selectedMember.membershipFee ? "paid" : "pending"
    const updatedDesignation = newTotalPaid > 2000 ? "Executive Member" : selectedMember.designation
    await update(ref(database, `members/${selectedMember.id}`), {
      paymentHistory: updatedHistory,
      status: newStatus,
      designation: updatedDesignation,
    })
    setSelectedMember({
      ...selectedMember,
      paymentHistory: updatedHistory,
      totalPaid: newTotalPaid,
      due: Math.max(0, selectedMember.membershipFee - newTotalPaid),
      status: newStatus as "paid" | "pending",
      designation: updatedDesignation,
    })
    setEditingPayment(null)
    setEntryOpen(false)
  }

  const deletePayment = async (paymentId: string) => {
    if (!selectedMember) return
    const updatedHistory = selectedMember.paymentHistory.filter((p) => p.id !== paymentId)
    const newTotalPaid = updatedHistory.reduce((s, p) => s + p.amount, 0)
    const newStatus = newTotalPaid >= selectedMember.membershipFee ? "paid" : "pending"
    const updatedDesignation = newTotalPaid > 2000 ? "Executive Member" : selectedMember.designation
    await update(ref(database, `members/${selectedMember.id}`), {
      paymentHistory: updatedHistory,
      status: newStatus,
      designation: updatedDesignation,
    })
    setSelectedMember({
      ...selectedMember,
      paymentHistory: updatedHistory,
      totalPaid: newTotalPaid,
      due: Math.max(0, selectedMember.membershipFee - newTotalPaid),
      status: newStatus as "paid" | "pending",
      designation: updatedDesignation,
    })
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      setFormError("Please enter member name.")
      return
    }
    if (!phone.trim()) {
      setFormError("Please enter phone number.")
      return
    }
    if (
      (designation === "Secretary" || designation === "President") &&
      members.some((member) => member.designation === designation && member.id !== editingMember)
    ) {
      setFormError(`A ${designation} has already been assigned.`)
      return
    }
    setSubmitting(true)
    setFormError(null)
    try {
      if (editingMember) {
        await update(ref(database, `members/${editingMember}`), {
          name: name.trim(),
          phone: phone.trim(),
          designation,
        })
        if (selectedMember?.id === editingMember) {
          setSelectedMember({ ...selectedMember, name: name.trim(), phone: phone.trim(), designation })
        }
        setModalOpen(false)
        setEditingMember(null)
        return
      }
      const id = `mandwa-${Date.now()}`
      await set(ref(database, `members/${id}`), {
        id,
        name: name.trim(),
        phone: phone.trim(),
        designation,
        email: "",
        membershipFee: 2000,
        birthday: "",
        image: "",
        paymentHistory: [],
        categories: ["new"],
        paidDate: null,
      })
      setModalOpen(false)
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Failed to add member.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-emerald-500 border-emerald-700 border-b-4 rounded-xl p-3 flex flex-col justify-center shadow-sm hover:shadow-md transition-all duration-100 active:translate-y-[2px] active:border-b-2" style={{ color: "#ffffff" }}>
          <div className="flex items-center justify-center space-x-2">
            <div className="p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.2)", color: "#ffffff" }}>
              <Users className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.9)" }}>Total Members</span>
          </div>
          <div className="mt-2 text-center">
            <h3 className="text-xl font-bold" style={{ color: "#ffffff" }}>{totalMembers}</h3>
          </div>
        </div>
        <div className="bg-blue-500 border-blue-700 border-b-4 rounded-xl p-3 flex flex-col justify-center shadow-sm hover:shadow-md transition-all duration-100 active:translate-y-[2px] active:border-b-2" style={{ color: "#ffffff" }}>
          <div className="flex items-center justify-center space-x-2">
            <div className="p-2 rounded-lg font-bold text-sm" style={{ background: "rgba(255,255,255,0.2)", color: "#ffffff" }}>₹</div>
            <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.9)" }}>Total Collected</span>
          </div>
          <div className="mt-2 text-center">
            <h3 className="text-xl font-bold" style={{ color: "#ffffff" }}>{formatINR(totalCollected)}</h3>
          </div>
        </div>
        <div className="bg-green-500 border-green-700 border-b-4 rounded-xl p-3 flex flex-col justify-center shadow-sm hover:shadow-md transition-all duration-100 active:translate-y-[2px] active:border-b-2" style={{ color: "#ffffff" }}>
          <div className="flex items-center justify-center space-x-2">
            <div className="p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.2)", color: "#ffffff" }}>
              <IndianRupee className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.9)" }}>Paid Members</span>
          </div>
          <div className="mt-2 text-center">
            <h3 className="text-xl font-bold" style={{ color: "#ffffff" }}>{paidMembers}</h3>
          </div>
        </div>
        <div className="bg-red-500 border-red-700 border-b-4 rounded-xl p-3 flex flex-col justify-center shadow-sm hover:shadow-md transition-all duration-100 active:translate-y-[2px] active:border-b-2" style={{ color: "#ffffff" }}>
          <div className="flex items-center justify-center space-x-2">
            <div className="p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.2)", color: "#ffffff" }}>
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.9)" }}>Pending Members</span>
          </div>
          <div className="mt-2 text-center">
            <h3 className="text-xl font-bold" style={{ color: "#ffffff" }}>{pendingMembers}</h3>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search members..."
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
          <span>Add Member</span>
        </button>
      </div>

      {/* Members Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden">
          <div className="flex bg-slate-50 border-b border-slate-200/80 px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
            <div className="w-[20%] text-left">Name</div>
            <div className="w-[20%]">Designation</div>
            <div className="w-[20%]">Phone</div>
            <div className="w-[15%]">Status</div>
            <div className="w-[12%]">Paid</div>
            <div className="w-[13%] text-right">Due</div>
          </div>

          <div className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                {search ? "No members found matching your search." : "No members found in database."}
              </div>
            ) : (
              filtered.map((member) => (
                <div key={member.id} onClick={() => setSelectedMember(member)} className="flex items-center px-6 py-2 hover:bg-slate-50 transition-colors text-center whitespace-nowrap cursor-pointer">
                  <div className="w-[20%] text-left">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shrink-0" style={{ color: "#ffffff" }}>
                        <span className="text-[10px] font-bold">{member.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 truncate">{member.name}</p>
                    </div>
                  </div>
                  <div className="w-[20%]">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                      member.categories.includes("vip")
                        ? "bg-amber-100 text-amber-700"
                        : member.categories.includes("executive")
                        ? "bg-purple-100 text-purple-700"
                        : "bg-slate-100 text-slate-600"
                    }`}>
                      {member.designation}
                    </span>
                  </div>
                  <div className="w-[20%]">
                    <span className="text-[11px] text-slate-600">{member.phone || "—"}</span>
                  </div>
                  <div className="w-[15%]">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      member.status === "paid"
                        ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                        : "bg-rose-50 border border-rose-200 text-rose-600"
                    }`}>
                      {member.status === "paid" ? "Paid" : "Pending"}
                    </span>
                  </div>
                  <div className="w-[12%]">
                    <span className="text-xs font-bold text-emerald-600">{formatINR(member.totalPaid)}</span>
                  </div>
                  <div className="w-[13%] text-right">
                    <span className={`text-xs font-bold ${member.due > 0 ? "text-rose-500" : "text-slate-400"}`}>
                      {formatINR(member.due)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ADD MEMBER MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl w-full max-w-md border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">{editingMember ? "Edit Member" : "Add New Member"}</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <p className="text-[11px] text-slate-500 font-medium mb-1">Full Name *</p>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <p className="text-[11px] text-slate-500 font-medium mb-1">Phone *</p>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <p className="text-[11px] text-slate-500 font-medium mb-1">Designation</p>
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 focus:outline-none"
                >
                  <option value="Secretary">Secretary</option>
                  <option value="President">President</option>
                  <option value="General Member">General Member</option>
                  <option value="Sports Players">Sports Players</option>
                  <option value="VIP Member">VIP Member</option>
                  <option value="Executive Member" disabled>Executive Member (auto-assigned)</option>
                </select>
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
                <span>{submitting ? "Saving..." : editingMember ? "Save Changes" : "Add Member"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MEMBER DETAIL MODAL */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg border border-slate-200 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Member Details</h3>
              <button
                onClick={() => setSelectedMember(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Avatar + Name header */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shrink-0" style={{ color: "#ffffff" }}>
                  <span className="text-sm font-bold">{selectedMember.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{selectedMember.name}</p>
                  <p className="text-[11px] text-slate-500">{selectedMember.designation}</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditMember(selectedMember)}
                    aria-label="Edit member"
                    title="Edit member"
                    className="rounded-md bg-blue-50 p-1.5 text-blue-600 hover:bg-blue-100"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setMemberDeleteConfirm(selectedMember.id)}
                    aria-label="Delete member"
                    title="Delete member"
                    className="rounded-md bg-rose-50 p-1.5 text-rose-600 hover:bg-rose-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={openEntry}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-semibold px-2 py-1 rounded-md transition-colors"
                  >
                    + Entry
                  </button>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-[10px] text-slate-400 font-medium uppercase">Phone</p>
                  <p className="text-xs font-bold text-slate-700 mt-0.5">{selectedMember.phone || "—"}</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3">
                  <p className="text-[10px] text-emerald-500 font-medium uppercase">Total Paid</p>
                  <p className="text-xs font-bold text-emerald-700 mt-0.5">{formatINR(selectedMember.totalPaid)}</p>
                </div>
                <div className="bg-rose-50 rounded-lg p-3">
                  <p className="text-[10px] text-rose-400 font-medium uppercase">Due</p>
                  <p className="text-xs font-bold text-rose-600 mt-0.5">{formatINR(selectedMember.due)}</p>
                </div>
              </div>

              {/* Payment History */}
              <div>
                <p className="text-[11px] text-slate-500 font-semibold uppercase mb-2">Payment History</p>
                {selectedMember.paymentHistory.length === 0 ? (
                  <p className="text-xs text-slate-400">No payments yet.</p>
                ) : (
                  <div className="space-y-1.5">
                    {selectedMember.paymentHistory.map((p) => (
                      <div key={p.id} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                        <p className="text-[11px] font-bold text-slate-700">{formatINR(p.amount)}</p>
                        <p className="text-[10px] text-slate-400">{formatDate(p.date)}</p>
                        <p className="text-[10px] text-slate-400">{p.method || "—"}</p>
                        <div className="flex gap-2">
                          <button onClick={() => startEdit(p)} className="text-blue-500 hover:text-blue-700">
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button onClick={() => setDeleteConfirm(p.id)} className="text-rose-400 hover:text-rose-600">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ENTRY MODAL */}
      {entryOpen && selectedMember && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl w-full max-w-xs border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">{editingPayment ? "Edit Entry" : "Add Entry"}</h3>
              <button
                onClick={() => { setEntryOpen(false); setEditingPayment(null) }}
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
                  value={entryAmount}
                  onChange={(e) => setEntryAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <p className="text-[11px] text-slate-500 font-medium mb-1">Date *</p>
                <input
                  type="date"
                  value={entryDate}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none"
                />
              </div>

              {entryError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-xs font-semibold text-red-600">
                  {entryError}
                </div>
              )}

              <button
                onClick={editingPayment ? saveEdit : handleEntry}
                disabled={entrySubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs py-2.5 rounded-lg flex items-center justify-center transition-colors"
              >
                {entrySubmitting ? "Saving..." : editingPayment ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl w-full max-w-xs border border-slate-200 shadow-xl p-5 text-center">
            <div className="mx-auto w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center mb-3">
              <Trash2 className="w-5 h-5 text-rose-600" />
            </div>
            <p className="text-sm font-bold text-slate-800 mb-1">Delete Payment?</p>
            <p className="text-[11px] text-slate-500 mb-4">This action cannot be undone.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { deletePayment(deleteConfirm); setDeleteConfirm(null) }}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs py-2 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MEMBER DELETE CONFIRM MODAL */}
      {memberDeleteConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl w-full max-w-xs border border-slate-200 shadow-xl p-5 text-center">
            <div className="mx-auto w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center mb-3">
              <Trash2 className="w-5 h-5 text-rose-600" />
            </div>
            <p className="text-sm font-bold text-slate-800 mb-1">Delete Member?</p>
            <p className="text-[11px] text-slate-500 mb-4">This will permanently delete the member and payment history.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setMemberDeleteConfirm(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteMember(memberDeleteConfirm)
                  setMemberDeleteConfirm(null)
                  setSelectedMember(null)
                }}
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
