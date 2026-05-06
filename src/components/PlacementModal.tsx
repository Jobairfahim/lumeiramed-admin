"use client";

import { useState, useEffect } from "react";
import type { Placement } from "@/types";
import { Icon } from "./Icon";

interface PlacementModalProps {
  isOpen: boolean;
  onClose: () => void;
  placement?: Placement | null;
  onSave: (placement: Omit<Placement, "id">) => void;
  mode: "create" | "edit" | "view";
}

const DURATIONS = ["4 Weeks", "6 Weeks", "8 Weeks", "10 Weeks", "12 Weeks"];

export function PlacementModal({ isOpen, onClose, placement, onSave, mode }: PlacementModalProps) {
  const [formData, setFormData] = useState({
    department: "",
    location: "",
    seats: "",
    duration: "",
    deadline: "",
    startDate: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (placement && mode === "edit") {
      setFormData({
        department: placement.department,
        location: placement.location,
        seats: placement.seats,
        duration: placement.duration,
        deadline: placement.deadline,
        startDate: placement.startDate
      });
    } else if (mode === "create") {
      setFormData({
        department: "",
        location: "",
        seats: "",
        duration: "",
        deadline: "",
        startDate: ""
      });
    }
  }, [placement, mode]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.seats) newErrors.seats = "Seats is required";
    if (!formData.duration) newErrors.duration = "Duration is required";
    if (!formData.deadline) newErrors.deadline = "Deadline is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";

    if (formData.seats && (parseInt(formData.seats) < 1 || parseInt(formData.seats) > 50)) {
      newErrors.seats = "Seats must be between 1 and 50";
    }

    if (formData.deadline && formData.startDate && formData.deadline >= formData.startDate) {
      newErrors.deadline = "Deadline must be before start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === "view") {
      onClose();
      return;
    }

    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isCreateMode = mode === "create";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {isCreateMode && "Create Placement"}
            {isEditMode && "Edit Placement"}
            {isViewMode && "View Placement"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Icon path="M6 18L18 6M6 6l12 12" className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Department */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Department <span className="text-red-500">*</span>
              </label>
              {isViewMode ? (
                <div className="px-4 py-2.5 bg-gray-50 rounded-xl text-gray-800">
                  {formData.department || "—"}
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    value={formData.department || ""}
                    onChange={(e) => handleChange("department", e.target.value)}
                    placeholder="Enter department name"
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-colors ${
                      errors.department 
                        ? "border-red-300 bg-red-50 text-red-900 placeholder-red-400" 
                        : "border-gray-200 bg-white text-gray-700 placeholder-gray-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                    }`}
                  />
                  {errors.department && (
                    <p className="mt-1 text-xs text-red-600">{errors.department}</p>
                  )}
                </>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              {isViewMode ? (
                <div className="px-4 py-2.5 bg-gray-50 rounded-xl text-gray-800">
                  {formData.location || "—"}
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    value={formData.location || ""}
                    onChange={(e) => handleChange("location", e.target.value)}
                    placeholder="Enter location"
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-colors ${
                      errors.location 
                        ? "border-red-300 bg-red-50 text-red-900 placeholder-red-400" 
                        : "border-gray-200 bg-white text-gray-700 placeholder-gray-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                    }`}
                  />
                  {errors.location && (
                    <p className="mt-1 text-xs text-red-600">{errors.location}</p>
                  )}
                </>
              )}
            </div>

            {/* Seats */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Available Seats <span className="text-red-500">*</span>
              </label>
              {isViewMode ? (
                <div className="px-4 py-2.5 bg-gray-50 rounded-xl text-gray-800">
                  {formData.seats || "—"}
                </div>
              ) : (
                <>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.seats || ""}
                    onChange={(e) => handleChange("seats", e.target.value)}
                    placeholder="Number of seats"
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-colors ${
                      errors.seats 
                        ? "border-red-300 bg-red-50 text-red-900 placeholder-red-400" 
                        : "border-gray-200 bg-white text-gray-700 placeholder-gray-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                    }`}
                  />
                  {errors.seats && (
                    <p className="mt-1 text-xs text-red-600">{errors.seats}</p>
                  )}
                </>
              )}
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Duration <span className="text-red-500">*</span>
              </label>
              {isViewMode ? (
                <div className="px-4 py-2.5 bg-gray-50 rounded-xl text-gray-800">
                  {formData.duration || "—"}
                </div>
              ) : (
                <>
                  <select
                    value={formData.duration || ""}
                    onChange={(e) => handleChange("duration", e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-colors ${
                      errors.duration 
                        ? "border-red-300 bg-red-50 text-red-900" 
                        : "border-gray-200 bg-white text-gray-700 focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                    }`}
                  >
                    <option value="">Select duration</option>
                    {DURATIONS.map(duration => (
                      <option key={duration} value={duration}>{duration}</option>
                    ))}
                  </select>
                  {errors.duration && (
                    <p className="mt-1 text-xs text-red-600">{errors.duration}</p>
                  )}
                </>
              )}
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Application Deadline <span className="text-red-500">*</span>
              </label>
              {isViewMode ? (
                <div className="px-4 py-2.5 bg-gray-50 rounded-xl text-gray-800">
                  {formData.deadline || "—"}
                </div>
              ) : (
                <>
                  <input
                    type="date"
                    value={formData.deadline || ""}
                    onChange={(e) => handleChange("deadline", e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-colors ${
                      errors.deadline 
                        ? "border-red-300 bg-red-50 text-red-900" 
                        : "border-gray-200 bg-white text-gray-700 focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                    }`}
                  />
                  {errors.deadline && (
                    <p className="mt-1 text-xs text-red-600">{errors.deadline}</p>
                  )}
                </>
              )}
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              {isViewMode ? (
                <div className="px-4 py-2.5 bg-gray-50 rounded-xl text-gray-800">
                  {formData.startDate || "—"}
                </div>
              ) : (
                <>
                  <input
                    type="date"
                    value={formData.startDate || ""}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-colors ${
                      errors.startDate 
                        ? "border-red-300 bg-red-50 text-red-900" 
                        : "border-gray-200 bg-white text-gray-700 focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                    }`}
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-xs text-red-600">{errors.startDate}</p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-colors"
            >
              {isViewMode ? "Close" : "Cancel"}
            </button>
            {!isViewMode && (
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#2ABFBF] text-white text-sm font-medium rounded-xl hover:bg-[#219a9a] transition-colors shadow-sm"
              >
                {isCreateMode && "Create Placement"}
                {isEditMode && "Save Changes"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
