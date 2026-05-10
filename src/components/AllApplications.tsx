"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "./Icon";
import { getAllApplications, type StudentApplication } from "@/lib/api";

const STAGES = [
  "awaiting for payment",
  "matching required",
  "awaiting response",
  "completed",
  "rejected",
] as const;

interface AllApplicationsProps { onView: (app: StudentApplication) => void; }

// Stage badge styles mapped to the actual IStudentPlacementEnquiry stage values
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

// Payment badge: green for paid, amber for pending
const paymentBadgeClass = (status: string) =>
  status === "paid"
    ? "bg-green-50 text-green-700 border-green-300"
    : "bg-amber-50 text-amber-800 border-amber-300";

// Hide the View button when the application is closed (completed or rejected)
const canView = (stage: string) =>
  stage !== "completed" && stage !== "rejected";

export function AllApplications({ onView }: AllApplicationsProps) {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchApplications() {
      setLoading(true);
      setError("");
      try {
        const result = await getAllApplications();
        setApplications(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load applications.");
      } finally {
        setLoading(false);
      }
    }
    fetchApplications();
  }, []);

  const filtered = useMemo(() =>
    applications.filter(app =>
      (app.firstName.toLowerCase().includes(search.toLowerCase()) ||
       app.lastName.toLowerCase().includes(search.toLowerCase()) ||
       app.email.toLowerCase().includes(search.toLowerCase())) &&
      (!stageFilter || app.stage === stageFilter)
    ), [applications, search, stageFilter]
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Filters */}
      <div className="flex gap-4 mb-5 flex-wrap">
        <div className="flex-1 min-w-48">
          <p className="text-xs font-semibold text-gray-500 mb-1.5">Search Students</p>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3.5 py-2 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100">
            <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="search"
              placeholder="Search by name or email"
              className="bg-transparent text-sm outline-none w-full placeholder-gray-400 text-gray-700"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 min-w-48">
          <p className="text-xs font-semibold text-gray-500 mb-1.5">Stage</p>
          <div className="relative">
            <select
              value={stageFilter}
              onChange={e => setStageFilter(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-3.5 py-2 pr-9 text-sm text-gray-600 outline-none focus:border-teal-400"
            >
              <option value="">All stages</option>
              {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
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

        {error ? (
          <div className="px-5 py-8 text-sm text-red-600">{error}</div>
        ) : loading ? (
          <div className="px-5 py-8 text-sm text-gray-500">Loading applications…</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-teal-500">
                {["Student", "University", "Specialty", "Duration", "Stage", "First Pay", "Final Pay", "Action"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(app => (
                <tr key={app._id} className="border-t border-gray-50 hover:bg-teal-50/20">
                  <td className="px-5 py-3.5 font-medium text-gray-800">
                    {app.firstName} {app.lastName}
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">{app.universityOrMedicalSchool}</td>
                  <td className="px-5 py-3.5 text-gray-600">{app.preferredSpecialty}</td>
                  <td className="px-5 py-3.5 text-gray-600">{app.duration}</td>

                  {/* Stage */}
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border whitespace-nowrap ${stageBadgeClass(app.stage)}`}>
                      {app.stage}
                    </span>
                  </td>

                  {/* First Payment */}
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border ${paymentBadgeClass(app.firstPayment)}`}>
                      {app.firstPayment}
                    </span>
                  </td>

                  {/* Final Payment */}
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border ${paymentBadgeClass(app.finalPayment)}`}>
                      {app.finalPayment}
                    </span>
                  </td>

                  {/* Action — hidden for completed/rejected */}
                  <td className="px-5 py-3.5">
                    {canView(app.stage) ? (
                      <button
                        type="button"
                        onClick={() => onView(app)}
                        className="text-teal-500 hover:text-teal-700 text-sm font-semibold hover:underline underline-offset-2"
                      >
                        View
                      </button>
                    ) : (
                      <span className="text-gray-300 text-sm">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No applications found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}