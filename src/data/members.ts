export type Payment = {
  id: string
  amount: number
  date: string
  description: string
  receiptNo?: string
  method?: "Cash" | "UPI" | "Bank Transfer" | "Cheque"
  collectedBy?: string
  remarks?: string
}

export type MemberCategory = "paid" | "pending" | "vip" | "executive" | "new" | "birthday"

export type Member = {
  id: string
  name: string
  image: string
  designation: string
  paidDate?: string
  paymentHistory: Payment[]
  email?: string
  phone?: string
  membershipFee: number
  birthday?: string
  categories: MemberCategory[]
}

export type EnrichedMember = Member & {
  totalPaid: number
  due: number
  paymentCount: number
  lastPayment?: Payment
  status: "paid" | "pending"
  vip: boolean
}

export function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)
}

export function formatDate(iso?: string) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}
