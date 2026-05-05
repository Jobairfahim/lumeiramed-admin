"use client";

import { useEffect, useMemo, useState } from "react";
import type { Placement } from "@/types";
import { Icon } from "./Icon";
import { PlacementModal } from "./PlacementModal";
import { getPlacements, createPlacement, updatePlacement, deletePlacement } from "@/lib/api";


export function AllPlacements() {
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [selectedPlacement, setSelectedPlacement] = useState<Placement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPlacements();
  }, []);

  const locations = useMemo(() => 
    Array.from(new Set(placements.map(p => p.location))).sort(),
    [placements]
  );

  const filtered = useMemo(() =>
    placements.filter(p =>
      p.department.toLowerCase().includes(search.toLowerCase()) &&
      (!locationFilter || p.location === locationFilter)
    ), [placements, search, locationFilter]);

  const handleView = (placement: Placement) => {
    setSelectedPlacement(placement);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleEdit = (placement: Placement) => {
    setSelectedPlacement(placement);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedPlacement(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const handleSave = async (placementData: Omit<Placement, "id">) => {
    try {
      if (modalMode === "create") {
        // Create new placement
        const result = await createPlacement({
          department: placementData.department,
          location: placementData.location,
          totalSeats: parseInt(placementData.seats),
          durationWeeks: placementData.duration.replace(" Weeks", ""),
          deadline: placementData.deadline,
          startDate: placementData.startDate,
          description: `${placementData.department} placement at ${placementData.location}`,
          requirements: "Medical student requirements"
        });

        // Refresh placements list
        await fetchPlacements();
        console.log("Placement created:", result.data);
      } else if (modalMode === "edit" && selectedPlacement) {
        // Update existing placement
        const result = await updatePlacement(selectedPlacement.id, {
          department: placementData.department,
          location: placementData.location,
          totalSeats: parseInt(placementData.seats),
          durationWeeks: placementData.duration.replace(" Weeks", ""),
          deadline: placementData.deadline,
          startDate: placementData.startDate,
          description: `${placementData.department} placement at ${placementData.location}`,
          requirements: "Medical student requirements"
        });

        // Refresh placements list
        await fetchPlacements();
        console.log("Placement updated:", result.data);
      }
    } catch (err) {
      console.error("Error saving placement:", err);
      // TODO: Show error notification
      alert(err instanceof Error ? err.message : "Failed to save placement");
    }
  };

  const handleDelete = async (placement: Placement) => {
    if (window.confirm(`Are you sure you want to delete the placement for "${placement.department}" at ${placement.location}?`)) {
      try {
        const result = await deletePlacement(placement.id);
        
        // Refresh placements list
        await fetchPlacements();
        console.log("Placement deleted:", result.data);
      } catch (err) {
        console.error("Error deleting placement:", err);
        // TODO: Show error notification
        alert(err instanceof Error ? err.message : "Failed to delete placement");
      }
    }
  };

  // Helper function to refresh placements
  async function fetchPlacements() {
    setLoading(true);
    setError("");

    try {
      const result = await getPlacements();
      setPlacements(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load placements."
      );
    } finally {
      setLoading(false);
    }
  }

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPlacement(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">All Placements</h1>
          <p className="text-gray-600 text-sm">Manage and view all available medical placements</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-[#2ABFBF] text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-[#219a9a] transition-colors shadow-sm"
        >
          <Icon path="M12 4v16m8-8H4" className="w-4 h-4" />
          Create Placement
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-5 flex-wrap">
        <div className="flex-1 min-w-48">
          <p className="text-xs font-semibold text-gray-500 mb-1.5">Search Departments</p>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3.5 py-2 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100">
            <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input 
              type="search" 
              placeholder="Search departments..." 
              className="bg-transparent text-sm outline-none w-full placeholder-gray-400 text-gray-700" 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
        </div>
        <div className="flex-1 min-w-48">
          <p className="text-xs font-semibold text-gray-500 mb-1.5">Location</p>
          <div className="relative">
            <select 
              value={locationFilter} 
              onChange={e => setLocationFilter(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-3.5 py-2 pr-9 text-sm text-gray-600 outline-none focus:border-teal-400"
            >
              <option value="">All Locations</option>
              {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
            <Icon path="M19 9l-7 7-7-7" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">Available Placements ({filtered.length})</h2>
        </div>
        {error ? (
          <div className="px-5 py-8 text-sm text-red-600">{error}</div>
        ) : loading ? (
          <div className="px-5 py-8 text-sm text-gray-500">Loading placements...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/70">
                <tr>
                  {["Department", "Location", "Seats", "Duration", "Deadline", "Start Date", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((placement) => {
                  const seats = Number.parseInt(placement.seats, 10);
                  const normalizedSeats = Number.isNaN(seats) ? 0 : seats;
                  const uniqueKey = placement._id || placement.id;

                  return (
                    <tr key={uniqueKey} className="border-t border-gray-50 hover:bg-teal-50/20">
                      <td className="px-5 py-3.5 font-medium text-gray-800">{placement.department}</td>
                      <td className="px-5 py-3.5 text-gray-600">{placement.location}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-teal-50 text-teal-700 rounded-lg text-xs font-semibold">
                          {placement.seats}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600">{placement.duration}</td>
                      <td className="px-5 py-3.5 text-gray-600">{placement.deadline}</td>
                      <td className="px-5 py-3.5 text-gray-600">{placement.startDate}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${
                          normalizedSeats > 8
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : normalizedSeats > 4
                              ? "bg-amber-100 text-amber-700 border border-amber-200"
                              : "bg-red-100 text-red-600 border border-red-200"
                        }`}>
                          {normalizedSeats > 8 ? "Available" : normalizedSeats > 4 ? "Limited" : "Few Left"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleView(placement)}
                            className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                            title="View placement"
                          >
                            <Icon path="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(placement)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit placement"
                          >
                            <Icon path="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(placement)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete placement"
                          >
                            <Icon path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">No placements found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Modal */}
      <PlacementModal
        isOpen={modalOpen}
        onClose={closeModal}
        placement={selectedPlacement}
        onSave={handleSave}
        mode={modalMode}
      />
    </div>
  );
}
