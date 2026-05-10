"use client";

import { useState, useEffect, type ReactNode } from "react";
import type { AdminPage } from "@/types";
import { Icon } from "./Icon";
import { Logo } from "./ui";
import { logout } from "@/lib/auth";
import { getUnreadNotifications, readAllNotifications, type Notification } from "@/lib/api";

interface NavItem { key: AdminPage; label: string; iconPath: string; }

const NAV_ITEMS: NavItem[] = [
  { key: "dashboard",    label: "Dashboard",       iconPath: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
  { key: "applications", label: "All Applications", iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  { key: "all-placements", label: "All Placements", iconPath: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
  { key: "hospital",     label: "Hospital",         iconPath: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { key: "messages",     label: "Messages",         iconPath: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" },
  { key: "settings",     label: "Settings",         iconPath: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
];

const ACTIVE_MAP: Partial<Record<AdminPage, AdminPage>> = {
  "application-detail": "applications",
  "matching-placement": "applications",
};

interface LayoutProps { children: ReactNode; currentPage: AdminPage; navigate: (p: AdminPage) => void; }

export function Layout({ children, currentPage, navigate }: LayoutProps) {
  const [search, setSearch] = useState("");
  const activeNav = ACTIVE_MAP[currentPage] ?? currentPage;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const result = await getUnreadNotifications();
        if (result.success) {
          const data = result.data as { notifications?: Notification[] } | Notification[];
          const notifs = Array.isArray(data) ? data : (data?.notifications || []);
          setNotifications(notifs);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  const handleBellClick = async () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && notifications.length > 0) {
      try {
        await readAllNotifications();
        setNotifications([]);
      } catch (error) {
        console.error("Failed to read notifications:", error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      // Generate a device token (you can customize this logic)
      const deviceToken = "54165s4dfsdf65sd4f65sd"; // You can get this from device info or generate one
      
      await logout(deviceToken);
      navigate("login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-48 bg-white border-r border-gray-100 flex flex-col py-5 px-3 flex-shrink-0">
        <Logo />
        <nav className="flex-1 space-y-0.5">
          {NAV_ITEMS.map(item => {
            const isActive = activeNav === item.key;
            return (
              <button key={item.key} type="button" onClick={() => navigate(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-teal-500 text-white shadow-md shadow-teal-200/50" : "text-gray-600 hover:bg-teal-50 hover:text-teal-700"}`}>
                <Icon path={item.iconPath} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <button type="button" onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl font-medium">
          <Icon path="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          Log Out
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 w-64 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100">
            <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input type="search" placeholder="Search students..." className="bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400 w-full" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="relative">
              <button type="button" onClick={handleBellClick} className="relative p-2 rounded-xl hover:bg-gray-50">
                <Icon path="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" className="w-5 h-5 text-gray-500" />
                {notifications.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-xl shadow-lg z-50 p-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">Notifications</h3>
                  {(!Array.isArray(notifications) || notifications.length === 0) ? (
                    <p className="text-xs text-gray-500">No new notifications.</p>
                  ) : (
                    <ul className="space-y-3 max-h-64 overflow-y-auto">
                      {notifications.map(n => (
                        <li key={n._id} className="text-xs text-gray-600 border-b border-gray-50 pb-2">
                          {n.message}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            <div className="relative flex items-center gap-2.5 cursor-pointer" onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800 leading-tight">Admin</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0 ring-2 ring-teal-100">
                <span className="text-white text-sm font-bold select-none">AD</span>
              </div>
              {profileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-1 overflow-hidden">
                  <button onClick={() => navigate("settings")} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition-colors w-full text-left">
                    <Icon path="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" className="w-4 h-4" />
                    Settings
                  </button>
                  <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors w-full text-left">
                    <Icon path="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
