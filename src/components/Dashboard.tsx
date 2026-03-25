"use client";

import { useState } from "react";
import type { AdminPage } from "@/types";
import { Icon } from "./Icon";
import { StageBadge, PayBadge } from "./ui";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  AreaChart, Area,
} from "recharts";

interface DashboardProps { navigate: (p: AdminPage) => void; }

const BAR_DATA = [
  { month: "Jan", value: 1200 }, { month: "Feb", value: 1800 }, { month: "Mar", value: 1400 },
  { month: "Apr", value: 2200 }, { month: "May", value: 1600 }, { month: "Jun", value: 2800 },
  { month: "Jul", value: 5000 }, { month: "Aug", value: 3200 }, { month: "Sep", value: 2400 },
  { month: "Oct", value: 1900 }, { month: "Nov", value: 2100 }, { month: "Dec", value: 2600 },
];

const AREA_DATA = [
  { month: "Jan", value: 800 }, { month: "Feb", value: 1200 }, { month: "Mar", value: 900 },
  { month: "Apr", value: 1800 }, { month: "May", value: 1400 }, { month: "Jun", value: 2200 },
  { month: "Jul", value: 3800 }, { month: "Aug", value: 5035 }, { month: "Sep", value: 4200 },
  { month: "Oct", value: 3600 }, { month: "Nov", value: 4100 }, { month: "Dec", value: 4800 },
];

const RECENT_APPS = [
  { student: "Ahmed Rahim", university: "AB University", dept: "Cardiology Rotation", duration: "4 Weeks", first: "Pending" as const, final: "Pending" as const },
  { student: "Ahmed Rahim", university: "AB University", dept: "Cardiology Rotation", duration: "3 Weeks", first: "Pending" as const, final: "Pending" as const },
];

export function Dashboard({ navigate }: DashboardProps) {
  const [period, setPeriod] = useState<"Monthly" | "Weekly">("Monthly");

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {([
          { icon: "📋", value: "32", label: "Total Applications" },
          { icon: "🏥", value: "02", label: "Hospital" },
          { icon: "💺", value: "02", label: "Empty Seats" },
          { icon: "💰", value: "01", label: "Total Earn" },
        ] as const).map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="w-11 h-11 bg-teal-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">{s.icon}</div>
            <div>
              <p className="text-2xl font-bold text-gray-800 leading-none mb-0.5">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-5 gap-5">
        {/* Bar chart */}
        <div className="col-span-3 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-0.5">Applications Overview</p>
              <p className="text-2xl font-bold text-gray-800">$5,2035</p>
              <p className="text-xs text-teal-500 font-semibold flex items-center gap-1 mt-0.5">
                <Icon path="M5 10l7-7m0 0l7 7m-7-7v18" className="w-3 h-3" /> +12.5%
              </p>
            </div>
            <select value={period} onChange={e => setPeriod(e.target.value as "Monthly" | "Weekly")}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none bg-gray-50 text-gray-600">
              <option>Monthly</option>
              <option>Weekly</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={BAR_DATA} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }} cursor={{ fill: "#f0fdfa" }} />
              <Bar dataKey="value" fill="#14b8a6" radius={[4, 4, 0, 0]}
                label={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Area chart */}
        <div className="col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-0.5">Total Earn</p>
          <p className="text-2xl font-bold text-gray-800">$5,2035</p>
          <p className="text-xs text-teal-500 font-semibold flex items-center gap-1 mt-0.5 mb-4">
            <Icon path="M5 10l7-7m0 0l7 7m-7-7v18" className="w-3 h-3" /> +12.5%
          </p>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={AREA_DATA}>
              <defs>
                <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }} />
              <Area type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={2.5} fill="url(#tealGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent applications */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800">Recent Applications</h2>
          <button type="button" onClick={() => navigate("applications")} className="text-sm text-teal-500 hover:underline underline-offset-2 font-medium">View all</button>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50/70">
            <tr>
              {["Students", "University/Medical School", "Department", "Duration", "First Payment", "Final Payment", "Action"].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RECENT_APPS.map((a, i) => (
              <tr key={i} className="border-t border-gray-50 hover:bg-teal-50/20">
                <td className="px-5 py-3.5 font-medium text-gray-800">{a.student}</td>
                <td className="px-5 py-3.5 text-gray-600">{a.university}</td>
                <td className="px-5 py-3.5 text-gray-600">{a.dept}</td>
                <td className="px-5 py-3.5 text-gray-600">{a.duration}</td>
                <td className="px-5 py-3.5"><PayBadge status={a.first} /></td>
                <td className="px-5 py-3.5"><PayBadge status={a.final} /></td>
                <td className="px-5 py-3.5">
                  <button type="button" onClick={() => navigate("applications")} className="text-teal-500 hover:text-teal-700 text-sm font-semibold">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
