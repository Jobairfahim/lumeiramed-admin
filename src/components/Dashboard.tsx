"use client";

import { useEffect, useState } from "react";
import type { AdminPage } from "@/types";
import { Icon } from "./Icon";
import { getAdminOverview, type AdminOverviewData } from "@/lib/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  AreaChart, Area,
} from "recharts";

const stageBadgeClass = (stage: string) => {
  switch (stage) {
    case "awaiting for payment": return "bg-amber-50 text-amber-800 border-amber-300";
    case "matching required":    return "bg-blue-50 text-blue-800 border-blue-300";
    case "awaiting response":    return "bg-green-50 text-green-700 border-green-300";
    case "completed":            return "bg-teal-50 text-teal-800 border-teal-300";
    case "rejected":             return "bg-red-50 text-red-700 border-red-300";
    default:                     return "bg-gray-100 text-gray-600 border-gray-200";
  }
};

const paymentBadgeClass = (status: string) =>
  status === "paid"
    ? "bg-green-50 text-green-700 border-green-300"
    : "bg-amber-50 text-amber-800 border-amber-300";

const canView = (stage: string) =>
  stage !== "completed" && stage !== "rejected";

interface DashboardProps { navigate: (p: AdminPage) => void; }

export function Dashboard({ navigate }: DashboardProps) {
  const [period, setPeriod] = useState<"Monthly" | "Weekly">("Monthly");
  const [dashboardData, setDashboardData] = useState<AdminOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      setError("");

      try {
        const result = await getAdminOverview();
        setDashboardData(result.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-5">
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
              <div className="w-11 h-11 bg-gray-200 rounded-xl mb-3"></div>
              <div className="h-6 bg-gray-200 rounded mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-5">
          <div className="col-span-3 bg-white rounded-2xl p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
          <div className="col-span-2 bg-white rounded-2xl p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {([
          { icon: "/images/totalapps.png", value: dashboardData.totalApplications.toString(), label: "Total Applications" },
          { icon: "/images/hospital.png", value: dashboardData.hospitals.toString(), label: "Hospital" },
          { icon: "/images/empty.png", value: dashboardData.totalEmptySeats.toString(), label: "Empty Seats" },
          { icon: "/images/earn.png", value: dashboardData.totalRevenue.toString(), label: "Total Earn" },
        ] as const).map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="w-11 h-11 bg-teal-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
              {s.icon.startsWith("/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.icon} alt={s.label} className="w-7 h-7 object-contain" />
              ) : (
                <span>{s.icon}</span>
              )}
            </div>
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
              <p className="text-2xl font-bold text-gray-800">{dashboardData.totalApplications}</p>
              <p className="text-xs text-teal-500 font-semibold flex items-center gap-1 mt-0.5">
                <Icon path="M5 10l7-7m0 0l7 7m-7-7v18" className="w-3 h-3" /> +{dashboardData.growthRate}%
              </p>
            </div>
            <select value={period} onChange={e => setPeriod(e.target.value as "Monthly" | "Weekly")}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none bg-gray-50 text-gray-600">
              <option>Monthly</option>
              <option>Weekly</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={dashboardData.revenueBarChart} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }} cursor={{ fill: "#f0fdfa" }} />
              <Bar dataKey="totalRevenue" fill="#2ABFBF" radius={[4, 4, 0, 0]}
                label={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Area chart */}
        <div className="col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-0.5">Total Earn</p>
          <p className="text-2xl font-bold text-gray-800">${dashboardData.totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-teal-500 font-semibold flex items-center gap-1 mt-0.5 mb-4">
            <Icon path="M5 10l7-7m0 0l7 7m-7-7v18" className="w-3 h-3" /> +{dashboardData.growthRate}%
          </p>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={dashboardData.revenueLineChart}>
              <defs>
                <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2ABFBF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2ABFBF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }} />
              <Area type="monotone" dataKey="totalRevenue" stroke="#2ABFBF" strokeWidth={2.5} fill="url(#tealGrad)" dot={false} />
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
          <thead>
            <tr className="bg-teal-500">
              {["Student", "University", "Specialty", "Duration", "Stage", "First Pay", "Final Pay", "Action"].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dashboardData.allApplications.slice(0, 5).map((app) => (
              <tr key={app._id} className="border-t border-gray-50 hover:bg-teal-50/20">
                <td className="px-5 py-3.5 font-medium text-gray-800">{app.firstName} {app.lastName}</td>
                <td className="px-5 py-3.5 text-gray-600">{app.universityOrMedicalSchool}</td>
                <td className="px-5 py-3.5 text-gray-600">{app.preferredSpecialty}</td>
                <td className="px-5 py-3.5 text-gray-600">{app.duration}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border whitespace-nowrap ${stageBadgeClass(app.stage)}`}>
                    {app.stage}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border ${paymentBadgeClass(app.firstPayment)}`}>
                    {app.firstPayment}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border ${paymentBadgeClass(app.finalPayment)}`}>
                    {app.finalPayment}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  {canView(app.stage) ? (
                    <button type="button" onClick={() => navigate("applications")} className="text-teal-500 hover:text-teal-700 text-sm font-semibold hover:underline underline-offset-2">View</button>
                  ) : (
                    <span className="text-gray-300 text-sm">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
