"use client";

import { useEffect, useState } from "react";
import { type StudentApplication, getApplicationById, changeApplicationStatus } from "@/lib/api";
import { Icon } from "./Icon";
import { Mail, GraduationCap, Phone, Calendar, Globe, MapPin } from "lucide-react";
import toast from "react-hot-toast";

type Decision = "accepted" | "rejected" | null;

interface Props {
  app: StudentApplication;
  onBack: () => void;
  onMatchingPlacement: () => void;
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-base mt-0.5 flex-shrink-0">{icon}</span>
      <div>
        <p className="text-sm text-gray-400 mb-0.5">{label}</p>
        <p className="text-base text-gray-700 font-medium">{value}</p>
      </div>
    </div>
  );
}

export function ApplicationDetail({ app: initialApp, onBack, onMatchingPlacement }: Props) {
  const [decision, setDecision] = useState<Decision>(null);
  const [app, setApp] = useState<StudentApplication>(initialApp);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    async function fetchApplicationDetails() {
      setLoading(true);
      setError("");

      try {
        const result = await getApplicationById(initialApp._id);
        setApp(result.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load application details."
        );
        // Fallback to initial app data if API fails
        setApp(initialApp);
      } finally {
        setLoading(false);
      }
    }

    fetchApplicationDetails();
  }, [initialApp._id, initialApp]);


  const handleAccept = async () => {
    setStatusLoading(true);
    try {
      await changeApplicationStatus(app._id, "approved");
      setDecision("accepted");
      toast.success("Application approved successfully");
      setTimeout(() => onBack(), 1000);
    } catch (err) {
      console.error("Failed to accept application:", err);
      alert(err instanceof Error ? err.message : "Failed to accept application");
    } finally {
      setStatusLoading(false);
    }
  };

  const handleReject = async () => {
    setStatusLoading(true);
    try {
      await changeApplicationStatus(app._id, "rejected");
      setDecision("rejected");
      toast.success("Application rejected successfully");
      setTimeout(() => onBack(), 1000);
    } catch (err) {
      console.error("Failed to reject application:", err);
      alert(err instanceof Error ? err.message : "Failed to reject application");
    } finally {
      setStatusLoading(false);
    }
  };


  return (
    <div className="max-w-6xl mx-auto">
      <button type="button" onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-teal-600 mb-5 text-sm font-medium group">
        <span className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-teal-50 flex items-center justify-center">
          <Icon path="M15 19l-7-7 7-7" className="w-4 h-4" />
        </span>
        Go back
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
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
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center mb-3 ring-4 ring-teal-50 flex-shrink-0">
                    <span className="text-white text-xl font-bold select-none">
                      {(app.firstName?.[0] ?? "").toUpperCase()}{(app.lastName?.[0] ?? "").toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">{app.firstName} {app.lastName}</h2>
                  <p className="text-base text-gray-400 mt-0.5">Year {app.yearOfStudy}</p>
                </div>
                <div className="space-y-3.5">
                  <InfoRow icon={<Mail className="w-4 h-4 text-teal-600" />} label="Email" value={app.email} />
                  <InfoRow icon={<Phone className="w-4 h-4 text-teal-600" />} label="University / Medical School" value={app.universityOrMedicalSchool} />
                  <InfoRow icon={<Phone className="w-4 h-4 text-teal-600" />} label="Phone Number" value={app.phoneNumber} />
                  <InfoRow icon={<GraduationCap className="w-4 h-4 text-teal-600" />} label="Duration" value={app.duration} />
                  <InfoRow icon={<Calendar className="w-4 h-4 text-teal-600" />} label="Start Date" value={app.preferredStartDate} />
                  <InfoRow icon={<Globe className="w-4 h-4 text-teal-600" />} label="Language" value={app.language} />
                  <InfoRow icon={<MapPin className="w-4 h-4 text-teal-600" />} label="Preferred Cities" value={app.preferredCities} />
                </div>
              </div>
              {/* Right */}
              <div>
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Preferred Specialty</p>
                    <p className="text-base font-bold text-gray-800">{app.preferredSpecialty}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Application Date</p>
                    <p className="text-base font-semibold text-gray-800">{new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Personal Statement</p>
                    <p className="text-base text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                      {app.additionalInformation || "No additional information provided"}
                    </p>
                  </div>
                </div>

                <p className="text-base font-bold text-gray-800 mb-3">Submitted Documents</p>
                {app.documents && app.documents.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2.5">
                    {app.documents.map((docUrl, idx) => {
                      const docName = docUrl.split('/').pop() || `Document ${idx + 1}`;
                      return (
                        <div key={idx} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 hover:border-teal-300 hover:bg-teal-50/30 group/doc">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Icon path="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" className="w-3.5 h-3.5 text-teal-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-700 truncate" title={docName}>{docName}</p>
                              <p className="text-sm text-gray-400">View Document</p>
                            </div>
                          </div>
                          <a href={docUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 group-hover/doc:text-teal-500 flex-shrink-0 ml-1" aria-label={`View document`}>
                            <Icon path="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-500">No documents submitted</p>
                  </div>
                )}
              </div>
            </div>

            {/* Selected/Sent Placements */}
            {((app.placements && app.placements.length > 0) || (app.matchingPlacements && app.matchingPlacements.length > 0)) && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-base font-bold text-gray-800 mb-4">Placements Sent to Student</h3>
                <div className="grid grid-cols-1 gap-4">
                  {(app.placements || app.matchingPlacements || []).map((p: { department?: string; title?: string; location?: string; duration?: string; startDate?: string } | string, idx: number) => (
                    <div key={idx} className="border border-teal-100 rounded-xl p-4 bg-teal-50/30 flex flex-col gap-1">
                      <p className="font-bold text-teal-800 text-sm">
                        {typeof p === 'string' ? `Placement ID: ${p}` : p.department || p.title || "Placement"}
                      </p>
                      {typeof p === 'object' && p.location && <p className="text-sm text-gray-600 font-medium">{p.location}</p>}
                      {typeof p === 'object' && p.duration && <p className="text-sm text-gray-500">Duration: <span className="font-medium text-gray-700">{p.duration}</span></p>}
                      {typeof p === 'object' && p.startDate && <p className="text-sm text-gray-500">Start Date: <span className="font-medium text-gray-700">{new Date(p.startDate).toLocaleDateString()}</span></p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons – bottom */}
            {app.adminStatus === "pending" && <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-gray-100">
              <button type="button" disabled={decision !== null}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-teal-900 hover:bg-teal-800 text-white disabled:opacity-60 disabled:cursor-not-allowed shadow-md">
                <Icon path="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                Messages
              </button>
              <button type="button" onClick={handleReject} disabled={decision !== null || statusLoading}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all disabled:opacity-60 disabled:cursor-not-allowed ${decision === "rejected" ? "bg-red-500 text-white border-red-500" : "border-red-300 text-red-500 hover:bg-red-50"}`}>
                <Icon path="M6 18L18 6M6 6l12 12" /> {statusLoading ? 'Updating...' : 'Reject'}
              </button>
              <button type="button" onClick={handleAccept} disabled={decision !== null || statusLoading}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed ${decision === "accepted" ? "bg-teal-600" : "bg-teal-500 hover:bg-teal-600"} text-white shadow-teal-200/50`}>
                <Icon path="M5 13l4 4L19 7" /> {statusLoading ? 'Updating...' : 'Accept'}
              </button>
            </div>}

            {/* Matching Placement button — hidden once stage advances past "awaiting for payment" */}
            {(app.adminStatus === "approved" && app.finalPayment === "pending" && app.firstPayment === "paid" && app.stage === "awaiting for payment") && <div className="flex justify-end mt-3">
              <button type="button" onClick={onMatchingPlacement}
                className="flex items-center gap-3 bg-teal-500 hover:bg-teal-600 text-white text-base font-semibold px-6 py-3 rounded-xl shadow-md shadow-teal-200/50">
                <Icon path="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                Find Your Matching Placement
              </button>
            </div>}
          </div>
        </div>
      )}
    </div>
  );
}
