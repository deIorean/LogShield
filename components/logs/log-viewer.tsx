"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Maximize2,
  Copy,
} from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  severity: "info" | "warning" | "error" | "critical";
  source: string;
  message: string;
  ip_address?: string;
  request_id?: string;
  user_agent?: string;
}

// Demo data
const demoLogs: LogEntry[] = [
  {
    id: "log-001",
    timestamp: "2024-03-27 14:32:15.234",
    severity: "critical",
    source: "auth-service",
    message: "Multiple failed login attempts detected from IP 192.168.1.105",
    ip_address: "192.168.1.105",
    request_id: "req-abc123",
  },
  {
    id: "log-002",
    timestamp: "2024-03-27 14:31:42.891",
    severity: "warning",
    source: "api-gateway",
    message: "Rate limit threshold reached for endpoint /api/v1/users",
    ip_address: "10.0.0.45",
    request_id: "req-def456",
  },
  {
    id: "log-003",
    timestamp: "2024-03-27 14:30:58.123",
    severity: "error",
    source: "database",
    message: "Connection timeout after 30000ms - retrying...",
    request_id: "req-ghi789",
  },
  {
    id: "log-004",
    timestamp: "2024-03-27 14:29:33.567",
    severity: "info",
    source: "scheduler",
    message: "Backup job completed successfully - 2.4GB processed",
    request_id: "req-jkl012",
  },
  {
    id: "log-005",
    timestamp: "2024-03-27 14:28:17.890",
    severity: "warning",
    source: "firewall",
    message: "Suspicious traffic pattern detected from subnet 10.0.0.0/24",
    ip_address: "10.0.0.0/24",
    request_id: "req-mno345",
  },
  {
    id: "log-006",
    timestamp: "2024-03-27 14:27:45.234",
    severity: "info",
    source: "cdn",
    message: "Cache purge completed for 156 objects",
    request_id: "req-pqr678",
  },
  {
    id: "log-007",
    timestamp: "2024-03-27 14:26:12.456",
    severity: "error",
    source: "payment-service",
    message: "Failed to process transaction - gateway timeout",
    ip_address: "203.0.113.42",
    request_id: "req-stu901",
  },
  {
    id: "log-008",
    timestamp: "2024-03-27 14:25:01.789",
    severity: "critical",
    source: "security",
    message: "SQL injection attempt blocked: SELECT * FROM users WHERE 1=1",
    ip_address: "198.51.100.23",
    request_id: "req-vwx234",
  },
  {
    id: "log-009",
    timestamp: "2024-03-27 14:24:33.012",
    severity: "info",
    source: "load-balancer",
    message: "Health check passed for all backend instances",
    request_id: "req-yza567",
  },
  {
    id: "log-010",
    timestamp: "2024-03-27 14:23:45.345",
    severity: "warning",
    source: "storage",
    message: "Disk usage at 85% - consider cleanup",
    request_id: "req-bcd890",
  },
];

const severityStyles = {
  info: "text-info",
  warning: "text-warning",
  error: "text-critical",
  critical: "bg-critical/20 text-critical font-semibold",
};

const severityBadgeStyles = {
  info: "bg-info/10 text-info",
  warning: "bg-warning/10 text-warning",
  error: "bg-critical/10 text-critical",
  critical: "bg-critical text-critical-foreground",
};

export function LogViewer() {
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [isLive, setIsLive] = useState(true);

  const filteredLogs = demoLogs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity =
      severityFilter === "all" || log.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search logs..."
              className="h-8 w-80 bg-secondary pl-8 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Filter className="h-3.5 w-3.5" />
                Severity
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setSeverityFilter("all")}>
                All Levels
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSeverityFilter("critical")}>
                Critical
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSeverityFilter("error")}>
                Error
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSeverityFilter("warning")}>
                Warning
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSeverityFilter("info")}>
                Info
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                Source
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>All Sources</DropdownMenuItem>
              <DropdownMenuItem>auth-service</DropdownMenuItem>
              <DropdownMenuItem>api-gateway</DropdownMenuItem>
              <DropdownMenuItem>database</DropdownMenuItem>
              <DropdownMenuItem>firewall</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isLive ? "default" : "outline"}
            size="sm"
            className="h-8 gap-1"
            onClick={() => setIsLive(!isLive)}
          >
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                isLive ? "animate-pulse bg-success" : "bg-muted-foreground"
              )}
            />
            {isLive ? "Live" : "Paused"}
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
        </div>
      </div>

      {/* Log List */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-border">
            {filteredLogs.map((log) => (
              <button
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className={cn(
                  "flex w-full items-start gap-4 px-4 py-3 text-left transition-colors hover:bg-secondary/30",
                  selectedLog?.id === log.id && "bg-secondary/50",
                  log.severity === "critical" && "bg-critical/5"
                )}
              >
                <span className="whitespace-nowrap font-mono text-xs text-muted-foreground">
                  {log.timestamp}
                </span>
                <span
                  className={cn(
                    "inline-flex min-w-[70px] rounded px-2 py-0.5 text-xs font-medium capitalize",
                    severityBadgeStyles[log.severity]
                  )}
                >
                  {log.severity}
                </span>
                <span className="min-w-[120px] font-mono text-xs text-primary">
                  {log.source}
                </span>
                <span
                  className={cn(
                    "flex-1 truncate text-sm",
                    severityStyles[log.severity]
                  )}
                >
                  {log.message}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Log Detail Panel */}
        {selectedLog && (
          <div className="w-96 border-l border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h3 className="text-sm font-semibold text-foreground">
                Log Details
              </h3>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Maximize2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <div className="space-y-4 p-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Timestamp
                </label>
                <p className="mt-1 font-mono text-sm text-foreground">
                  {selectedLog.timestamp}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Severity
                </label>
                <p className="mt-1">
                  <span
                    className={cn(
                      "inline-flex rounded px-2 py-0.5 text-sm font-medium capitalize",
                      severityBadgeStyles[selectedLog.severity]
                    )}
                  >
                    {selectedLog.severity}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Source
                </label>
                <p className="mt-1 font-mono text-sm text-primary">
                  {selectedLog.source}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Message
                </label>
                <p className="mt-1 text-sm text-foreground">
                  {selectedLog.message}
                </p>
              </div>
              {selectedLog.ip_address && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    IP Address
                  </label>
                  <p className="mt-1 font-mono text-sm text-foreground">
                    {selectedLog.ip_address}
                  </p>
                </div>
              )}
              {selectedLog.request_id && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Request ID
                  </label>
                  <p className="mt-1 font-mono text-sm text-foreground">
                    {selectedLog.request_id}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-border bg-card px-4 py-2">
        <span className="text-xs text-muted-foreground">
          Showing {filteredLogs.length} of 289,456 logs
        </span>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-3 text-xs text-muted-foreground">Page 1 of 28,946</span>
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
