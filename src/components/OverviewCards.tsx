"use client";

import { Users, ArrowRight } from "lucide-react";

export default function OverviewCards() {
  const stats = [
    {
      icon: <Users className="w-4 h-4" />,
      value: "53",
      label: "Total Members",
      linkText: "View all members",
      cardBg: "bg-emerald-50/50",
      cardBorder: "border-emerald-100",
      iconBg: "bg-emerald-100",
      iconText: "text-emerald-700",
      linkText2: "text-emerald-700",
    },
    {
      icon: <span className="text-sm font-bold">₹</span>,
      value: "11,150",
      label: "Total Collection",
      linkText: "View collection",
      cardBg: "bg-blue-50/50",
      cardBorder: "border-blue-100",
      iconBg: "bg-blue-100",
      iconText: "text-blue-700",
      linkText2: "text-blue-700",
    },
    {
      icon: <span className="text-sm font-bold">₹</span>,
      value: "30,000",
      label: "Total Expenditure",
      linkText: "View expenditure",
      cardBg: "bg-rose-50/40",
      cardBorder: "border-rose-100",
      iconBg: "bg-rose-100",
      iconText: "text-rose-600",
      linkText2: "text-rose-600",
    },
    {
      icon: <span className="w-4 h-4">💰</span>,
      value: "-18,850",
      label: "Cash Book Balance",
      linkText: "View details",
      cardBg: "bg-purple-50/40",
      cardBorder: "border-purple-100",
      iconBg: "bg-purple-100",
      iconText: "text-purple-700",
      linkText2: "text-purple-700",
      valueColor: "text-rose-500",
    },
  ];

  return (
    <div className="lg:col-span-2 space-y-3">
      <h3 className="text-sm font-bold text-slate-900 tracking-tight">
        Overview
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`${stat.cardBg} border ${stat.cardBorder} rounded-2xl p-4 flex flex-col justify-between`}
          >
            <div
              className={`w-8 h-8 rounded-xl ${stat.iconBg} ${stat.iconText} flex items-center justify-center`}
            >
              {stat.icon}
            </div>
            <div className="mt-4">
              <span
                className={`text-2xl font-extrabold ${
                  stat.valueColor || "text-slate-900"
                }`}
              >
                {stat.value}
              </span>
              <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
            </div>
            <a
              href="#"
              className={`mt-4 inline-flex items-center text-xs ${stat.linkText2} font-semibold hover:underline`}
            >
              {stat.linkText} <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
