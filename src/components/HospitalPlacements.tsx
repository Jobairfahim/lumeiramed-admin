"use client";

import { useState, useMemo } from "react";
import type { Placement } from "@/types";

const PLACEMENTS: Placement[] = Array.from({ length: 4 }, (_, i) => ({
  id: i + 1,
  department: "Medical University",
  location: "London",
  seats: "3 / 5",
  duration: "4 Weeks",
  deadline: "15 Apr 2026",
  startDate: "12/2/2026",
}));

const DEPARTMENTS = ["All", "Medical University", "Cardiology", "Neurology", "Pediatrics"];

interface PlacementCardProps { placement: Placement; }

function PlacementCard({ placement }: PlacementCardProps) {
  const fields = [
    { iconPath: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", label: "Department", value: placement.department },
    { iconPath: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z", label: "Location", value: placement.location },
    { iconPath: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", label: "Seats", value: placement.seats },
    { iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", label: "Duration", value: placement.duration },
    { iconPath: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", label: "Deadline", value: placement.deadline },
    { iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", label: "Start Date", value: placement.startDate },
  ] as const;

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        {fields.map(({ iconPath, label, value }) => (
          <div key={label}>
            <div className="flex items-center gap-1.5 mb-0.5">
              <svg className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
              </svg>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
            <p className={`text-sm font-semibold pl-5 ${label === "Department" ? "text-teal-600" : "text-gray-800"}`}>
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HospitalPlacements() {
  const [deptFilter, setDeptFilter] = useState("All");

  const filtered = useMemo(
    () => deptFilter === "All" ? PLACEMENTS : PLACEMENTS.filter(p => p.department === deptFilter),
    [deptFilter]
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search / filter */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-500 mb-1.5">Search Department</p>
        <div className="relative w-80">
          <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="w-full appearance-none bg-white border border-gray-200 rounded-xl pl-9 pr-9 py-2 text-sm text-gray-600 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
          >
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d === "All" ? "Select Department" : d}</option>)}
          </select>
          <svg className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <h1 className="text-xl font-bold text-gray-800 mb-5">Hospital Placements</h1>

      <div className="grid grid-cols-2 gap-4">
        {filtered.map(p => <PlacementCard key={p.id} placement={p} />)}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm font-medium">No placements found</p>
        </div>
      )}
    </div>
  );
}
