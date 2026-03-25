"use client";

import { useState } from "react";
import type { AdminPage, Application } from "@/types";
import { Login } from "./Login";
import { Layout } from "./Layout";
import { Dashboard } from "./Dashboard";
import { AllApplications } from "./AllApplications";
import { ApplicationDetail } from "./ApplicationDetail";
import { MatchingPlacement } from "./MatchingPlacement";
import { Hospital } from "./Hospital";
import { HospitalPlacements } from "./HospitalPlacements";
import { Messages } from "./Messages";
import { Settings } from "./Settings";

export function AdminShell() {
  const [page, setPage] = useState<AdminPage>("login");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const navigate = (p: AdminPage) => {
    setPage(p);
    if (p !== "application-detail" && p !== "matching-placement") {
      setSelectedApp(null);
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
        <MatchingPlacement onBack={() => navigate("application-detail")} />
      );
      case "hospital": return <Hospital />;
      case "hospital-placements": return <HospitalPlacements />;
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
