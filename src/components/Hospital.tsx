"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "./Icon";
import { getHospitals, type Hospital } from "@/lib/api";

interface HospitalInfoModalProps { onClose: () => void; }

function HospitalInfoModal({ onClose }: HospitalInfoModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Hospital Information</h2>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <Icon path="M6 18L18 6M6 6l12 12" className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-3.5">
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name <span className="text-red-400">*</span></label>
              <input type="text" placeholder="e.g. City General Hospital Kalyar" className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm bg-gray-50 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address <span className="text-red-400">*</span></label>
              <input type="text" placeholder="123 Medical Center Drive City, Country" className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm bg-gray-50 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100" />
            </div>
          </div>
          {[
            { id: "email", label: "Email *", placeholder: "youremail@example.com", type: "email" },
            { id: "phone", label: "Phone *", placeholder: "+1(555)xxx", type: "tel" },
            { id: "website", label: "Website", placeholder: "e.g. 4", type: "text" },
            { id: "password", label: "Password", placeholder: "••••••", type: "password" },
          ].map(f => (
            <div key={f.id}>
              <label htmlFor={f.id} className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input id={f.id} type={f.type} placeholder={f.placeholder} className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm bg-gray-50 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Requirement &amp; Description</label>
            <textarea rows={3} placeholder="Enter placement requirements and description" className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm bg-gray-50 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 resize-none" />
          </div>
        </div>
        <div className="px-6 pb-5">
          <button type="button" onClick={onClose} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2.5 rounded-xl shadow-md shadow-teal-200/50">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export function Hospital() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchHospitals() {
      setLoading(true);
      setError("");

      try {
        const result = await getHospitals();
        setHospitals(result.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load hospitals."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchHospitals();
  }, []);

  const filtered = useMemo(() => 
    hospitals.filter(h => h.hospitalName.toLowerCase().includes(search.toLowerCase())), 
    [hospitals, search]
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 mb-1.5">Search Hospital</p>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3.5 py-2 w-80 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100">
          <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input type="search" placeholder="Select Hospital" className="bg-transparent text-sm outline-none w-full placeholder-gray-400 text-gray-700" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800">All Hospitals</h1>
        <button type="button" onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-teal-200/50">
          <Icon path="M12 4v16m8-8H4" /> Create Hospital
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {error ? (
          <div className="px-5 py-8 text-sm text-red-600">{error}</div>
        ) : loading ? (
          <div className="px-5 py-8 text-sm text-gray-500">Loading hospitals...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-teal-500">
                {["Hospital", "Email", "Address", "Seats", "Action"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(h => (
                <tr key={h._id} className="border-t border-gray-50 hover:bg-teal-50/20">
                  <td className="px-5 py-3.5 font-semibold text-gray-800">{h.hospitalName}</td>
                  <td className="px-5 py-3.5 text-gray-600">{h.userId.email}</td>
                  <td className="px-5 py-3.5 text-gray-600">{h.address}</td>
                  <td className="px-5 py-3.5 text-gray-600">{h.availableSeats}/{h.totalSeats}</td>
                  <td className="px-5 py-3.5">
                    <button type="button" className="text-teal-500 hover:text-teal-700 text-sm font-semibold hover:underline underline-offset-2">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">No hospitals found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your search</p>
        </div>
      )}

      {showModal && <HospitalInfoModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
