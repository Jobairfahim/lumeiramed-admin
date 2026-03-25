"use client";

import { useState, useMemo } from "react";
import type { Application, StageStatus } from "@/types";
import { Icon } from "./Icon";
import { StageBadge, PayBadge } from "./ui";

const STAGES: StageStatus[] = ["AwaitingPayment", "MatchingRequired", "AwaitingResponse"];

const APP_DATA: Application[] = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  studentName: "Ahmed Rahim",
  university: "AB University",
  department: "Cardiology Rotation",
  duration: "4 Weeks",
  stage: (["AwaitingPayment", "MatchingRequired", "AwaitingResponse", "AwaitingPayment", "AwaitingResponse", "MatchingRequired", "AwaitingPayment", "AwaitingPayment", "AwaitingResponse"] as StageStatus[])[i],
  firstPayment: (["Pending", "Pending", "Pending", "Paid", "Paid", "Pending", "Paid", "Pending", "Paid"] as const)[i],
  finalPayment: "Pending",
}));

interface AllApplicationsProps { onView: (app: Application) => void; }

export function AllApplications({ onView }: AllApplicationsProps) {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<StageStatus | "">("");

  const filtered = useMemo(() =>
    APP_DATA.filter(a =>
      a.studentName.toLowerCase().includes(search.toLowerCase()) &&
      (!stageFilter || a.stage === stageFilter)
    ), [search, stageFilter]);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Filters */}
      <div className="flex gap-4 mb-5 flex-wrap">
        <div className="flex-1 min-w-48">
          <p className="text-xs font-semibold text-gray-500 mb-1.5">Search Students</p>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3.5 py-2 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100">
            <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input type="search" placeholder="Select student" className="bg-transparent text-sm outline-none w-full placeholder-gray-400 text-gray-700" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="flex-1 min-w-48">
          <p className="text-xs font-semibold text-gray-500 mb-1.5">Payment Statuses</p>
          <div className="relative">
            <select value={stageFilter} onChange={e => setStageFilter(e.target.value as StageStatus | "")}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-3.5 py-2 pr-9 text-sm text-gray-600 outline-none focus:border-teal-400">
              <option value="">Select statuses</option>
              {STAGES.map(s => <option key={s} value={s}>{s.replace(/([A-Z])/g, ' $1').trim()}</option>)}
            </select>
            <Icon path="M19 9l-7 7-7-7" className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h1 className="font-bold text-gray-800">All Applications</h1>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-teal-500">
              {["Students", "Department", "Duration", "Stage", "First Payment", "Final Payment", "Action"].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id} className="border-t border-gray-50 hover:bg-teal-50/20">
                <td className="px-5 py-3.5 font-medium text-gray-800">{a.studentName}</td>
                <td className="px-5 py-3.5 text-gray-600">{a.department}</td>
                <td className="px-5 py-3.5 text-gray-600">{a.duration}</td>
                <td className="px-5 py-3.5"><StageBadge status={a.stage} /></td>
                <td className="px-5 py-3.5"><PayBadge status={a.firstPayment} /></td>
                <td className="px-5 py-3.5"><PayBadge status={a.finalPayment} /></td>
                <td className="px-5 py-3.5">
                  <button type="button" onClick={() => onView(a)} className="text-teal-500 hover:text-teal-700 text-sm font-semibold hover:underline underline-offset-2">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
