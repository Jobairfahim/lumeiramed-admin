"use client";

import { useState } from "react";
import type { Placement } from "@/types";
import { Icon } from "./Icon";

interface Props { onBack: () => void; }

const PLACEMENTS: Placement[] = Array.from({ length: 4 }, (_, i) => ({
  id: i + 1,
  department: "Medical University",
  location: "London",
  seats: "3 / 5",
  duration: "4 Weeks",
  deadline: "15 Apr 2026",
  startDate: "12/2/2026",
}));

export function MatchingPlacement({ onBack }: Props) {
  const [selected, setSelected] = useState<number | null>(1);
  const [showModal, setShowModal] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    setSent(true);
    setTimeout(() => { setSent(false); onBack(); }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <button type="button" onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-teal-600 text-sm font-medium group">
          <span className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-teal-50 flex items-center justify-center">
            <Icon path="M15 19l-7-7 7-7" className="w-4 h-4" />
          </span>
          Go to back
        </button>
        <button type="button" onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-teal-200/50">
          <Icon path="M12 4v16m8-8H4" /> Create Placement
        </button>
      </div>

      <h1 className="text-xl font-bold text-gray-800 mb-5">Find Your Matching Placement Select</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {PLACEMENTS.map(p => {
          const isSelected = selected === p.id;
          return (
            <button key={p.id} type="button" onClick={() => setSelected(p.id)}
              className={`bg-white rounded-2xl p-5 border-2 text-left transition-all hover:shadow-md ${isSelected ? "border-teal-500 shadow-md shadow-teal-100" : "border-gray-200 hover:border-teal-200"}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">AB University</h3>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-teal-500 border-teal-500" : "border-gray-300"}`}>
                  {isSelected && <Icon path="M5 13l4 4L19 7" className="w-3 h-3 text-white" />}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {[
                  { icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", label: "Department", value: p.department },
                  { icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z", label: "Location", value: p.location },
                  { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", label: "Seats", value: p.seats },
                  { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", label: "Duration", value: p.duration },
                  { icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", label: "Deadline", value: p.deadline },
                  { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", label: "Start Date", value: p.startDate },
                ].map(({ icon, label, value }) => (
                  <div key={label}>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <svg className="w-3.5 h-3.5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                      </svg>
                      <p className="text-xs text-gray-400">{label}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 pl-5">{value}</p>
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button type="button" onClick={handleSend} disabled={!selected || sent}
          className={`flex items-center gap-2 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-md transition-all disabled:opacity-60 ${sent ? "bg-green-500 shadow-green-200" : "bg-teal-500 hover:bg-teal-600 shadow-teal-200/50"}`}>
          {sent ? <><Icon path="M5 13l4 4L19 7" /> Sent!</> : <><Icon path="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /> Sent Student</>}
        </button>
      </div>

      {/* Create Placement Modal */}
      {showModal && <CreatePlacementModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

function CreatePlacementModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Create Placement</h2>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <Icon path="M6 18L18 6M6 6l12 12" className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-3.5">
          {[
            { id: "dept", label: "Department", placeholder: "e.g. Cardiology Rotation" },
            { id: "loc", label: "Location", placeholder: "e.g. London" },
            { id: "seats", label: "Number of Seats", placeholder: "e.g. 5" },
            { id: "duration", label: "Duration (Weeks)", placeholder: "e.g. 4" },
            { id: "deadline", label: "Application Deadline", placeholder: "mm/dd/yyyy" },
            { id: "start", label: "Start Date", placeholder: "mm/dd/yyyy" },
          ].map(f => (
            <div key={f.id}>
              <label htmlFor={f.id} className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input id={f.id} type="text" placeholder={f.placeholder} className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm bg-gray-50 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100" />
            </div>
          ))}
        </div>
        <div className="px-6 pb-5">
          <button type="button" onClick={onClose} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-teal-200/50">
            Save Placement <Icon path="M17 8l4 4m0 0l-4 4m4-4H3" />
          </button>
        </div>
      </div>
    </div>
  );
}
