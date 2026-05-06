"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "./Icon";
import { changePassword, type ChangePasswordPayload } from "@/lib/auth";

type SaveState = "idle" | "saving" | "saved" | "error";

interface SecurityForm {
  current: string;
  newPass: string;
  confirm: string;
}

export function Settings() {
  const [form, setForm] = useState<SecurityForm>({ current: "", newPass: "", confirm: "" });
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.current) { setError("Please enter your current password."); return; }
    if (form.newPass.length < 8) { setError("New password must be at least 8 characters."); return; }
    if (form.newPass !== form.confirm) { setError("Passwords do not match."); return; }

    setSaveState("saving");
    
    try {
      const payload: ChangePasswordPayload = {
        currentPassword: form.current,
        newPassword: form.newPass,
        confirmPassword: form.confirm,
      };
      
      await changePassword(payload);
      
      // Success
      setForm({ current: "", newPass: "", confirm: "" });
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2500);
    } catch (err) {
      // Error
      const errorMessage = err instanceof Error ? err.message : "Failed to change password. Please try again.";
      setError(errorMessage);
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 2500);
    }
  };

  const strength = Math.min(Math.floor(form.newPass.length / 3), 4);
  const strengthColors = ["bg-red-400", "bg-red-400", "bg-amber-400", "bg-teal-400", "bg-teal-600"];
  const strengthLabels = ["", "Weak", "Weak", "Fair", "Strong", "Strong"];

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Security</h2>
          <p className="text-sm text-gray-500 mt-0.5">Update your account password</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="px-6 py-5 space-y-4">
          {/* Current password */}
          <div>
            <label htmlFor="current" className="block text-sm font-medium text-gray-700 mb-1.5">
              Current Password
            </label>
            <input
              id="current"
              type="password"
              value={form.current}
              onChange={e => setForm(f => ({ ...f, current: e.target.value }))}
              placeholder="Enter current password"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 focus:bg-white"
            />
          </div>

          {/* New password */}
          <div>
            <label htmlFor="newPass" className="block text-sm font-medium text-gray-700 mb-1.5">
              New Password
            </label>
            <input
              id="newPass"
              type="password"
              value={form.newPass}
              onChange={e => setForm(f => ({ ...f, newPass: e.target.value }))}
              placeholder="Minimum 8 characters"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 focus:bg-white"
            />
            {/* Strength meter */}
            {form.newPass.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(level => (
                    <div
                      key={level}
                      className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${level <= strength ? strengthColors[strength] : "bg-gray-200"}`}
                    />
                  ))}
                </div>
                {strength > 0 && (
                  <p className={`text-xs font-medium ${strength <= 2 ? "text-red-500" : strength === 3 ? "text-amber-500" : "text-teal-600"}`}>
                    {strengthLabels[strength]}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirm"
                type="password"
                value={form.confirm}
                onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                placeholder="Re-enter new password"
                className={`w-full border rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 outline-none focus:ring-2 focus:bg-white ${
                  form.confirm && form.newPass !== form.confirm
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : form.confirm && form.newPass === form.confirm
                    ? "border-teal-400 focus:border-teal-400 focus:ring-teal-100"
                    : "border-gray-200 focus:border-teal-400 focus:ring-teal-100"
                }`}
              />
              {form.confirm && form.newPass === form.confirm && (
                <div className="absolute right-3 top-2.5 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                  <Icon path="M5 13l4 4L19 7" className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
              <Icon path="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={saveState === "saving" || saveState === "saved"}
              className={`w-full font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all disabled:cursor-default ${
                saveState === "saved"
                  ? "bg-green-500 text-white shadow-green-200/50"
                  : saveState === "error"
                  ? "bg-red-500 text-white shadow-red-200/50"
                  : "bg-teal-500 hover:bg-teal-600 text-white shadow-teal-200/50 disabled:opacity-70"
              }`}
            >
              {saveState === "saving" ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Updating...
                </>
              ) : saveState === "saved" ? (
                <>
                  <Icon path="M5 13l4 4L19 7" />
                  Password Updated!
                </>
              ) : saveState === "error" ? (
                <>
                  <Icon path="M6 18L18 6M6 6l12 12" />
                  Update Failed
                </>
              ) : (
                <>
                  Update Password
                  <Icon path="M17 8l4 4m0 0l-4 4m4-4H3" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
