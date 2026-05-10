"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "./Icon";
import Image from "next/image";
import { loginAdmin, persistTokens } from "@/lib/auth";

interface LoginProps { onLogin: () => void; }

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginAdmin({ email, password });
      persistTokens(result.data.accessToken, result.data.refreshToken);
      onLogin();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl shadow-teal-100/60 flex overflow-hidden max-w-2xl w-full border border-gray-100">
        {/* Left image */}
        <div className="hidden md:block w-5/12 relative">
          <Image src="/images/login.png" alt="Medical team" width={600} height={400} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-teal-900/50 via-transparent to-transparent" />
        </div>

        {/* Form */}
        <div className="w-full md:w-7/12 p-8 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-7">
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
              <circle cx="20" cy="20" r="18" fill="#ccfbf7" />
              <rect x="17" y="10" width="6" height="20" rx="2" fill="#2ABFBF" />
              <rect x="10" y="17" width="20" height="6" rx="2" fill="#2ABFBF" />
              <circle cx="20" cy="20" r="3" fill="#0f766e" />
            </svg>
            <span className="text-sm font-bold text-gray-800">LumieraMed Admin</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1.5">Welcome Back!</h1>
          <p className="text-gray-500 text-sm mb-7 leading-relaxed">Sign in to your admin dashboard to manage applications, hospitals, and placements.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <div className="flex items-center border border-gray-200 rounded-xl px-3.5 py-2.5 bg-gray-50 focus-within:border-teal-400 focus-within:ring-3 focus-within:ring-teal-100 focus-within:bg-white">
                <Icon path="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" className="w-4 h-4 text-gray-400 mr-2.5 flex-shrink-0" />
                <input id="email" type="email" placeholder="Enter your email address" required value={email} onChange={e => setEmail(e.target.value)} className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400" />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="flex items-center border border-gray-200 rounded-xl px-3.5 py-2.5 bg-gray-50 focus-within:border-teal-400 focus-within:ring-3 focus-within:ring-teal-100 focus-within:bg-white">
                <Icon path="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" className="w-4 h-4 text-gray-400 mr-2.5 flex-shrink-0" />
                <input id="password" type={showPass ? "text" : "password"} placeholder="Enter your password" required value={password} onChange={e => setPassword(e.target.value)} className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400" />
                <button type="button" onClick={() => setShowPass(v => !v)} className="text-gray-400 hover:text-gray-600">
                  <Icon path={showPass ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z"} path2={showPass ? undefined : "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button type="button" className="text-sm text-teal-600 hover:underline underline-offset-2 font-medium">Forgot Password?</button>
            </div>
            {error ? (
              <div className="rounded-xl border border-red-100 bg-red-50 px-3.5 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}
            <button type="submit" disabled={loading} className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-70 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-teal-200">
              {loading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : <>Login <Icon path="M17 8l4 4m0 0l-4 4m4-4H3" /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
