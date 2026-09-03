"use client"

import { useEffect, useState } from "react"
import { database } from "./firebase"
import { ref, set, update, remove, push, onValue } from "firebase/database"
import type { Member, Payment, EnrichedMember } from "@/data/members"

export type CommunityMessage = {
  id: string
  sender: string
  senderId?: string
  avatar: string
  text: string
  time: string
  fromMe?: boolean
}

export type CashTxn = {
  id: string
  date: string
  description: string
  type: "Income" | "Expense"
  amount: number
  via?: string
}

export type EventItem = {
  id: string
  name: string
  datetime: string
  price: number
  available: number
  venue: string
}

export type OrgSettings = {
  org: { name: string; regdNo: string; address: string; email: string; phone: string; whatsapp: string }
  admin: { name: string; role: string; image: string; phone: string; email: string }
  donations: { upiId: string; accountName: string; accountNo: string; ifsc: string }
}

function toArray<T>(val: Record<string, T> | T[] | null | undefined): T[] {
  if (!val) return []
  if (Array.isArray(val)) return val
  return Object.entries(val).map(([id, v]) => ({ ...(v as object), id })) as T[]
}

function enrichMembers(records: Record<string, Member> | null): EnrichedMember[] {
  if (!records) return []
  const list = toArray(records)
  return list
    .map((m) => {
      const paymentHistory = toArray<Payment>(m.paymentHistory as Payment[] | Record<string, Payment> | null | undefined)
      const totalPaid = paymentHistory.reduce((s, p) => s + (p.amount || 0), 0)
      const sorted = [...paymentHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      return {
        ...m,
        designation: totalPaid > 2000 ? "Executive Member" : m.designation,
        paymentHistory,
        totalPaid,
        due: Math.max(0, (m.membershipFee || 0) - totalPaid),
        paymentCount: paymentHistory.length,
        lastPayment: sorted[0],
        status: totalPaid > 0 ? ("paid" as const) : ("pending" as const),
        vip: (m.categories || []).includes("vip"),
      }
    })
    .sort((a, b) => a.id.localeCompare(b.id))
}

function toStoredMember(m: Member): Member {
  const {
    totalPaid: _totalPaid,
    due: _due,
    paymentCount: _paymentCount,
    lastPayment: _lastPayment,
    status: _status,
    vip: _vip,
    ...stored
  } = m as Member & Partial<EnrichedMember>
  return stored
}

export function useMembers() {
  const [members, setMembers] = useState<EnrichedMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const un = onValue(
      ref(database, "members"),
      (snap) => {
        setMembers(enrichMembers(snap.val()))
        setLoading(false)
      },
      () => setLoading(false)
    )
    return () => {
      un()
    }
  }, [])

  const addMember = async (m: Member) => {
    await set(ref(database, `members/${m.id}`), toStoredMember(m))
  }
  const updateMember = async (m: Member) => {
    await set(ref(database, `members/${m.id}`), toStoredMember(m))
  }
  const deleteMember = async (id: string) => {
    await remove(ref(database, `members/${id}`))
  }

  return { members, loading, addMember, updateMember, deleteMember }
}

export function useMemberById(id?: string) {
  const { members } = useMembers()
  if (!id) return undefined
  return members.find((m) => m.id === id)
}

export function useCommunityChat() {
  const [messages, setMessages] = useState<CommunityMessage[]>([])

  useEffect(() => {
    const r = ref(database, "chat/community")
    const un = onValue(r, (snap) => setMessages(toArray<CommunityMessage>(snap.val())))
    return () => {
      un()
    }
  }, [])

  const send = async (msg: Omit<CommunityMessage, "id">) => {
    await push(ref(database, "chat/community"), msg)
  }

  return { messages, send }
}

export function useCashBook() {
  const [txns, setTxns] = useState<CashTxn[]>([])

  useEffect(() => {
    const r = ref(database, "cashBook")
    const un = onValue(r, (snap) => {
      setTxns(toArray<CashTxn>(snap.val()))
    })
    return () => {
      un()
    }
  }, [])

  const addTxn = async (t: Omit<CashTxn, "id">) => {
    await push(ref(database, "cashBook"), t)
  }

  const updateTxn = async (id: string, t: Partial<CashTxn>) => {
    await update(ref(database, `cashBook/${id}`), t)
  }

  const deleteTxn = async (id: string) => {
    await remove(ref(database, `cashBook/${id}`))
  }

  return { txns, addTxn, updateTxn, deleteTxn }
}

export function useEvents() {
  const [events, setEvents] = useState<EventItem[]>([])

  useEffect(() => {
    const r = ref(database, "events")
    const un = onValue(r, (snap) => setEvents(toArray<EventItem>(snap.val())))
    return () => {
      un()
    }
  }, [])

  const updateEvent = async (id: string, patch: Partial<EventItem>) => {
    await update(ref(database, `events/${id}`), patch)
  }

  return { events, updateEvent }
}

export function useSettings() {
  const [settings, setSettings] = useState<OrgSettings | null>(null)

  useEffect(() => {
    const r = ref(database, "settings")
    const un = onValue(r, (snap) => setSettings(snap.val()))
    return () => {
      un()
    }
  }, [])

  return settings
}
