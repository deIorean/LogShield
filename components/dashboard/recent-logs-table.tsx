"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface LogEntry {
  id: string;
  timestamp: string;
  severity: "info" | "warning" | "error" | "critical";
  source: string;
  message: string;
}

// Demo data
const recentLogs: LogEntry[] = [
  {
    id: "1",
    timestamp: "2024-03-27 14:32:15",
    severity: "critical",
    source: "auth-service",
    message: "Multiple failed login attempts detected from IP 192.168.1.105",
  },
  {
    id: "2",
    timestamp: "2024-03-27 14:31:42",
    severity: "warning",
    source: "api-gateway",
    message: "Rate limit threshold reached for endpoint /api/v1/users",
  },
  {
    id: "3",
    timestamp: "2024-03-27 14:30:58",
    severity: "error",
    source: "database",
    message: "Connection timeout after 30000ms - retrying...",
  },
  {
    id: "4",
    timestamp: "2024-03-27 14:29:33",
    severity: "info",
    source: "scheduler",
    message: "Backup job completed successfully - 2.4GB processed",
  },
  {
    id: "5",
    timestamp: "2024-03-27 14:28:17",
    severity: "warning",
    source: "firewall",
    message: "Suspicious traffic pattern detected from subnet 10.0.0.0/24",
  },
  {
    id: "6",
    timestamp: "2024-03-27 14:27:45",
    severity: "info",
    source: "cdn",
    message: "Cache purge completed for 156 objects",
  },
];

const severityStyles = {
  info: "bg-info/10 text-info",
  warning: "bg-warning/10 text-warning",
  error: "bg-critical/10 text-critical",
  critical: "bg-critical text-critical-foreground",
};

interface RecentLogsTableProps {
  className?: string;
}

export function RecentLogsTable({ className }: RecentLogsTableProps) {
  return (
    <div className={className}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Recent Logs
          </h3>
          <p className="text-sm text-muted-foreground">
            Latest entries from all sources
          </p>
        </div>
        <Link href="/logs">
          <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
            View All
            <ChevronRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>
      <div className="overflow-hidden rounded-md border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                Timestamp
              </th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                Severity
              </th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                Source
              </th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                Message
              </th>
            </tr>
          </thead>
          <tbody>
            {recentLogs.map((log, index) => (
              <tr
                key={log.id}
                className={cn(
                  "border-b border-border transition-colors hover:bg-secondary/30",
                  index === recentLogs.length - 1 && "border-b-0"
                )}
              >
                <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-muted-foreground">
                  {log.timestamp}
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                      severityStyles[log.severity]
                    )}
                  >
                    {log.severity}
                  </span>
                </td>
                <td className="px-4 py-2.5 font-mono text-xs text-foreground">
                  {log.source}
                </td>
                <td className="max-w-md truncate px-4 py-2.5 text-foreground">
                  {log.message}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
