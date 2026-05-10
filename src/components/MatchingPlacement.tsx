"use client";

import { useState, useEffect } from "react";
import { getPlacements, matchPlacement, type StudentApplication } from "@/lib/api";
import type { Placement } from "@/types";
import { Icon } from "./Icon";
import toast from "react-hot-toast";

interface Props {
  onBack: () => void;
  application?: StudentApplication;
}

export function MatchingPlacement({ onBack, application }: Props) {
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPlacements() {
      setLoading(true);
      setError("");
      try {
        const result = await getPlacements();
        setPlacements(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load placements.");
      } finally {
        setLoading(false);
      }
    }
    fetchPlacements();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <button type="button" onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-teal-600 text-sm font-medium group">
          <span className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-teal-50 flex items-center justify-center">
            <Icon path="M15 19l-7-7 7-7" className="w-4 h-4" />
          </span>
          Go back
        </button>
        <button type="button" onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-teal-200/50">
          <Icon path="M12 4v16m8-8H4" /> Create Placement
        </button>
      </div>

      <h1 className="text-xl font-bold text-gray-800 mb-5">Find Your Matching Placement</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-gray-100 rounded-2xl p-5 h-48"></div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {placements.map((p: Placement) => {
              const isSelected = selected.includes(String(p.id));
              const toggleSelection = () => {
                setSelected(prev =>
                  prev.includes(String(p.id))
                    ? prev.filter(id => id !== String(p.id))
                    : [...prev, String(p.id)]
                );
              };
              return (
                <button key={p.id} type="button" onClick={toggleSelection}
                  className={`bg-white rounded-2xl p-5 border-2 text-left transition-all hover:shadow-md ${isSelected ? "border-teal-500 shadow-md shadow-teal-100" : "border-gray-200 hover:border-teal-200"}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-800">{p.department}</h3>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-teal-500 border-teal-500" : "border-gray-300"}`}>
                      {isSelected && <Icon path="M5 13l4 4L19 7" className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    {[
                      { icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z", label: "Location", value: p.location },
                      { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", label: "Seats", value: p.seats },
                      { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", label: "Duration", value: p.duration },
                      { icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", label: "Deadline", value: new Date(p.deadline).toLocaleDateString() },
                      { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", label: "Start Date", value: new Date(p.startDate).toLocaleDateString() },
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

          {!placements.length && !loading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No placements available</p>
              <p className="text-gray-400 text-sm mt-1">Create a placement to get started</p>
            </div>
          )}
        </>
      )}

      {/* Send to Student button */}
      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={() => setShowSendModal(true)}
          disabled={selected.length === 0}
          className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-md shadow-teal-200/50 transition-all"
        >
          <Icon path="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          Send to Student ({selected.length})
        </button>
      </div>

      {/* Send Confirmation Modal */}
      {showSendModal && application && (
        <SendConfirmModal
          application={application}
          selectedIds={selected}
          onClose={() => setShowSendModal(false)}
          onSuccess={() => { setShowSendModal(false); onBack(); }}
        />
      )}

      {/* Create Placement Modal */}
      {showCreateModal && <CreatePlacementModal onClose={() => setShowCreateModal(false)} />}
    </div>
  );
}

/* ─── Send Confirmation Modal ─────────────────────────────────────────────── */
function SendConfirmModal({
  application,
  selectedIds,
  onClose,
  onSuccess,
}: {
  application: StudentApplication;
  selectedIds: string[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [finalPaymentAmount, setFinalPaymentAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const amount = parseFloat(finalPaymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid final payment amount.");
      return;
    }
    setSubmitting(true);
    try {
      await matchPlacement(application._id, selectedIds, amount);
      toast.success("Placements sent to student successfully!");
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send placements.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Confirm Placement Match</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {selectedIds.length} placement{selectedIds.length !== 1 ? "s" : ""} selected
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <Icon path="M6 18L18 6M6 6l12 12" className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Student info */}
          <div className="flex items-center gap-3 bg-teal-50 border border-teal-100 rounded-xl p-3.5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold select-none">
                {(application.firstName?.[0] ?? "").toUpperCase()}{(application.lastName?.[0] ?? "").toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{application.firstName} {application.lastName}</p>
              <p className="text-xs text-gray-500">{application.email}</p>
            </div>
          </div>

          {/* Final Payment Amount */}
          <div>
            <label htmlFor="finalPaymentAmount" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Final Payment Amount <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100 bg-gray-50">
              <span className="px-3.5 py-2.5 text-gray-500 font-semibold border-r border-gray-200 bg-white text-sm">£</span>
              <input
                id="finalPaymentAmount"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 500"
                value={finalPaymentAmount}
                onChange={e => setFinalPaymentAmount(e.target.value)}
                className="flex-1 bg-transparent px-3.5 py-2.5 text-sm outline-none text-gray-800 placeholder-gray-400"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">This amount will be charged to the student as their final payment.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex gap-3">
          <button type="button" onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-2.5 rounded-xl text-sm transition-all">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} disabled={submitting || !finalPaymentAmount}
            className="flex-1 bg-teal-500 hover:bg-teal-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md shadow-teal-200/50 transition-all">
            {submitting
              ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" /> Sending…</>
              : <><Icon path="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /> Confirm &amp; Send</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Create Placement Modal ──────────────────────────────────────────────── */
function CreatePlacementModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
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
              <input id={f.id} type="text" placeholder={f.placeholder}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm bg-gray-50 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100" />
            </div>
          ))}
        </div>
        <div className="px-6 pb-5">
          <button type="button" onClick={onClose}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-teal-200/50">
            Save Placement <Icon path="M17 8l4 4m0 0l-4 4m4-4H3" />
          </button>
        </div>
      </div>
    </div>
  );
}
