"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { LogViewer } from "@/components/logs/log-viewer";

export default function LogsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title="Logs" />
        <main className="flex-1 overflow-hidden">
          <LogViewer />
        </main>
      </div>
    </div>
  );
}
