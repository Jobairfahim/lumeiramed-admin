"use client";

import { useEffect, useState } from "react";
import type { AdminPage } from "@/types";
import { type StudentApplication } from "@/lib/api";
import { Login } from "./Login";
import { Layout } from "./Layout";
import { Dashboard } from "./Dashboard";
import { AllApplications } from "./AllApplications";
import { ApplicationDetail } from "./ApplicationDetail";
import { MatchingPlacement } from "./MatchingPlacement";
import { Hospital } from "./Hospital";
import { HospitalPlacements } from "./HospitalPlacements";
import { AllPlacements } from "./AllPlacements";
import Messages from "./Messages";
import { Settings } from "./Settings";
import { getAccessToken } from "@/lib/auth";

export function AdminShell() {
  const [page, setPage] = useState<AdminPage>("login");
  const [selectedApp, setSelectedApp] = useState<StudentApplication | null>(null);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);

  useEffect(() => {
    if (getAccessToken()) {
      setPage("dashboard");
    }
  }, []);

  const navigate = (p: AdminPage) => {
    setPage(p);
    if (p !== "application-detail" && p !== "matching-placement") {
      setSelectedApp(null);
    }
    if (p !== "hospital-placements" && p !== "hospital") {
      setSelectedHospitalId(null);
    }
  };

  if (page === "login") return <Login onLogin={() => navigate("dashboard")} />;

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard navigate={navigate} />;
      case "applications": return (
        <AllApplications onView={(app) => { setSelectedApp(app); navigate("application-detail"); }} />
      );
      case "application-detail": return selectedApp ? (
        <ApplicationDetail
          app={selectedApp}
          onBack={() => navigate("applications")}
          onMatchingPlacement={() => navigate("matching-placement")}
        />
      ) : <AllApplications onView={(app) => { setSelectedApp(app); navigate("application-detail"); }} />;
      case "matching-placement": return (
        <MatchingPlacement onBack={() => navigate("application-detail")} application={selectedApp || undefined} />
      );
      case "hospital": return <Hospital onView={(id) => { setSelectedHospitalId(id); navigate("hospital-placements"); }} />;
      case "hospital-placements": return <HospitalPlacements hospitalId={selectedHospitalId} onBack={() => navigate("hospital")} />;
      case "all-placements": return <AllPlacements />;
      case "messages": return <Messages />;
      case "settings": return <Settings />;
      default: return <Dashboard navigate={navigate} />;
    }
  };

  return (
    <Layout currentPage={page} navigate={navigate}>
      {renderPage()}
    </Layout>
  );
}
