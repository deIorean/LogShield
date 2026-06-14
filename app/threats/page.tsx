"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ThreatList } from "@/components/threats/threat-list";

export default function ThreatsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title="Threats" />
        <main className="flex-1 overflow-hidden">
          <ThreatList />
        </main>
      </div>
    </div>
  );
}
