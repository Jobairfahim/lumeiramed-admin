"use client";

import { useState } from "react";
import type { Application } from "@/types";
import { Icon } from "./Icon";

const DOCS = ["Curriculum Vitae", "Passport Copy", "Academic Transcript", "Recommendation Letter"] as const;

type Decision = "accepted" | "rejected" | null;

interface Props {
  app: Application;
  onBack: () => void;
  onMatchingPlacement: () => void;
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-base mt-0.5 flex-shrink-0">{icon}</span>
      <div>
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        <p className="text-sm text-gray-700 font-medium">{value}</p>
      </div>
    </div>
  );
}

export function ApplicationDetail({ app, onBack, onMatchingPlacement }: Props) {
  const [decision, setDecision] = useState<Decision>(null);

  return (
    <div className="max-w-3xl mx-auto">
      <button type="button" onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-teal-600 mb-5 text-sm font-medium group">
        <span className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-teal-50 flex items-center justify-center">
          <Icon path="M15 19l-7-7 7-7" className="w-4 h-4" />
        </span>
        Go back
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {decision && (
          <div className={`px-8 py-2.5 text-sm font-semibold text-center ${decision === "accepted" ? "bg-teal-500 text-white" : "bg-red-500 text-white"}`}>
            {decision === "accepted" ? "✓ Application accepted" : "✗ Application rejected"}
          </div>
        )}
        <div className="p-8">
          <div className="grid grid-cols-2 gap-8">
            {/* Left */}
            <div>
              <div className="flex flex-col items-center mb-6 pb-5 border-b border-gray-100">
                <img src="https://i.pravatar.cc/80?img=12" alt="Ahmed Rahmin" className="w-16 h-16 rounded-full object-cover mb-3 ring-4 ring-teal-50" />
                <h2 className="text-lg font-bold text-gray-800">Ahmed Rahmin</h2>
                <p className="text-sm text-gray-400 mt-0.5">Final Year</p>
              </div>
              <div className="space-y-3.5">
                <InfoRow icon="✉️" label="Email" value="ahmed.rahim@gmail.com" />
                <InfoRow icon="🏛️" label="University / Medical School" value="Ab university" />
                <InfoRow icon="📞" label="Phone Number" value="+88987954767" />
                <InfoRow icon="⏱️" label="Duration" value="6 months" />
                <InfoRow icon="📅" label="Start Date" value="12/2/2026" />
                <InfoRow icon="🌐" label="Language" value="English" />
                <InfoRow icon="📍" label="Preferred Cities" value="London" />
              </div>
            </div>
            {/* Right */}
            <div>
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Preferred Specialty</p>
                  <p className="font-bold text-gray-800">Cardiology Rotation</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Application Date</p>
                  <p className="font-semibold text-gray-800">1 Mar 2026</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Personal Statement</p>
                  <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                    I am a final-year medical student who is very interested in cardiology. I have completed my internal medicine rotations and performed very well in cardiac care. I am eager to learn from experienced cardiologists and gain practical, hands-on experience in this field.
                  </p>
                </div>
              </div>
              <p className="text-sm font-bold text-gray-800 mb-3">Submitted Documents</p>
              <div className="grid grid-cols-2 gap-2.5">
                {DOCS.map(doc => (
                  <div key={doc} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 hover:border-teal-300 hover:bg-teal-50/30 group/doc">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon path="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" className="w-3.5 h-3.5 text-teal-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-700 truncate">{doc}</p>
                        <p className="text-xs text-gray-400">245 kB</p>
                      </div>
                    </div>
                    <button type="button" className="text-gray-400 group-hover/doc:text-teal-500 flex-shrink-0 ml-1" aria-label={`Download ${doc}`}>
                      <Icon path="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons – bottom */}
          <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-gray-100">
            <button type="button" disabled={decision !== null}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-teal-900 hover:bg-teal-800 text-white disabled:opacity-60 disabled:cursor-not-allowed shadow-md">
              <Icon path="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              Messages
            </button>
            <button type="button" onClick={() => setDecision("rejected")} disabled={decision !== null}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all disabled:opacity-60 disabled:cursor-not-allowed ${decision === "rejected" ? "bg-red-500 text-white border-red-500" : "border-red-300 text-red-500 hover:bg-red-50"}`}>
              <Icon path="M6 18L18 6M6 6l12 12" /> Reject
            </button>
            <button type="button" onClick={() => setDecision("accepted")} disabled={decision !== null}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed ${decision === "accepted" ? "bg-teal-600" : "bg-teal-500 hover:bg-teal-600"} text-white shadow-teal-200/50`}>
              <Icon path="M5 13l4 4L19 7" /> Accept
            </button>
          </div>

          {/* Matching Placement button */}
          <div className="flex justify-end mt-3">
            <button type="button" onClick={onMatchingPlacement}
              className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-teal-200/50">
              <Icon path="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              Matching Placement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
