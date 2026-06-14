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
  ChevronDown,
  Shield,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MoreHorizontal,
} from "lucide-react";

interface Threat {
  id: string;
  timestamp: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "active" | "investigating" | "resolved" | "false_positive";
  source_ip: string;
  description: string;
  affected_systems: string[];
  indicators: string[];
}

const demoThreats: Threat[] = [
  {
    id: "THR-001",
    timestamp: "2024-03-27 14:32:15",
    type: "Brute Force Attack",
    severity: "critical",
    status: "active",
    source_ip: "45.33.32.156",
    description:
      "Detected 847 failed login attempts from single IP within 5 minutes",
    affected_systems: ["auth-service", "api-gateway"],
    indicators: ["High failed login rate", "Single source IP", "Automated pattern"],
  },
  {
    id: "THR-002",
    timestamp: "2024-03-27 14:15:42",
    type: "SQL Injection",
    severity: "high",
    status: "investigating",
    source_ip: "198.51.100.23",
    description: "SQL injection attempt detected on user search endpoint",
    affected_systems: ["api-gateway", "user-service"],
    indicators: ["Malicious query patterns", "UNION SELECT statements"],
  },
  {
    id: "THR-003",
    timestamp: "2024-03-27 13:58:33",
    type: "DDoS Attack",
    severity: "high",
    status: "resolved",
    source_ip: "Multiple",
    description: "Distributed denial of service attack targeting API endpoints",
    affected_systems: ["cdn", "load-balancer", "api-gateway"],
    indicators: ["Traffic spike", "Geographic distribution", "Bot signatures"],
  },
  {
    id: "THR-004",
    timestamp: "2024-03-27 12:45:18",
    type: "XSS Attack",
    severity: "medium",
    status: "resolved",
    source_ip: "203.0.113.42",
    description: "Cross-site scripting attempt in comment field",
    affected_systems: ["frontend", "comment-service"],
    indicators: ["Script tags in input", "Encoded payloads"],
  },
  {
    id: "THR-005",
    timestamp: "2024-03-27 11:22:56",
    type: "Suspicious Login",
    severity: "medium",
    status: "false_positive",
    source_ip: "192.168.1.105",
    description: "Login from unusual geographic location",
    affected_systems: ["auth-service"],
    indicators: ["New location", "VPN detected"],
  },
  {
    id: "THR-006",
    timestamp: "2024-03-27 10:15:33",
    type: "Port Scanning",
    severity: "low",
    status: "resolved",
    source_ip: "104.28.15.42",
    description: "Systematic port scanning detected from external IP",
    affected_systems: ["firewall"],
    indicators: ["Sequential port access", "SYN packets"],
  },
];

const severityColors = {
  low: "bg-info/10 text-info border-info/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  high: "bg-critical/10 text-critical border-critical/20",
  critical: "bg-critical text-critical-foreground border-critical",
};

const statusColors = {
  active: "bg-critical/10 text-critical",
  investigating: "bg-warning/10 text-warning",
  resolved: "bg-success/10 text-success",
  false_positive: "bg-muted text-muted-foreground",
};

const statusIcons = {
  active: AlertTriangle,
  investigating: Clock,
  resolved: CheckCircle,
  false_positive: XCircle,
};

export function ThreatList() {
  const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredThreats = demoThreats.filter((threat) => {
    const matchesSearch =
      threat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      threat.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      threat.source_ip.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || threat.status === statusFilter;
    return matchesSearch && matchesStatus;
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
              placeholder="Search threats..."
              className="h-8 w-80 bg-secondary pl-8 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Filter className="h-3.5 w-3.5" />
                Status
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                All Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("investigating")}>
                Investigating
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("resolved")}>
                Resolved
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("false_positive")}>
                False Positive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                Severity
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>All Severities</DropdownMenuItem>
              <DropdownMenuItem>Critical</DropdownMenuItem>
              <DropdownMenuItem>High</DropdownMenuItem>
              <DropdownMenuItem>Medium</DropdownMenuItem>
              <DropdownMenuItem>Low</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {filteredThreats.filter((t) => t.status === "active").length} active
            threats
          </span>
        </div>
      </div>

      {/* Threats Grid */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredThreats.map((threat) => {
              const StatusIcon = statusIcons[threat.status];
              return (
                <div
                  key={threat.id}
                  onClick={() => setSelectedThreat(threat)}
                  className={cn(
                    "cursor-pointer rounded-lg border bg-card p-4 transition-all hover:border-primary/50",
                    selectedThreat?.id === threat.id && "border-primary ring-1 ring-primary",
                    threat.severity === "critical" && "border-critical/30"
                  )}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Shield
                        className={cn(
                          "h-4 w-4",
                          threat.severity === "critical"
                            ? "text-critical"
                            : threat.severity === "high"
                            ? "text-critical/70"
                            : threat.severity === "medium"
                            ? "text-warning"
                            : "text-info"
                        )}
                      />
                      <span className="text-xs font-medium text-muted-foreground">
                        {threat.id}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                        severityColors[threat.severity]
                      )}
                    >
                      {threat.severity}
                    </span>
                  </div>
                  <h3 className="mb-1 font-semibold text-foreground">
                    {threat.type}
                  </h3>
                  <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                    {threat.description}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <StatusIcon className="h-3 w-3" />
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 capitalize",
                          statusColors[threat.status]
                        )}
                      >
                        {threat.status.replace("_", " ")}
                      </span>
                    </div>
                    <span className="text-muted-foreground">
                      {threat.timestamp.split(" ")[1]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Threat Detail Panel */}
        {selectedThreat && (
          <div className="w-96 border-l border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h3 className="text-sm font-semibold text-foreground">
                Threat Details
              </h3>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Eye className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <div className="space-y-4 p-4">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase",
                    severityColors[selectedThreat.severity]
                  )}
                >
                  {selectedThreat.severity}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded px-2 py-1 text-xs capitalize",
                    statusColors[selectedThreat.status]
                  )}
                >
                  {statusIcons[selectedThreat.status] && (
                    <span className="h-3 w-3">
                      {(() => {
                        const Icon = statusIcons[selectedThreat.status];
                        return <Icon className="h-3 w-3" />;
                      })()}
                    </span>
                  )}
                  {selectedThreat.status.replace("_", " ")}
                </span>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Threat Type
                </label>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {selectedThreat.type}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Description
                </label>
                <p className="mt-1 text-sm text-foreground">
                  {selectedThreat.description}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Source IP
                </label>
                <p className="mt-1 font-mono text-sm text-foreground">
                  {selectedThreat.source_ip}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Affected Systems
                </label>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {selectedThreat.affected_systems.map((system) => (
                    <span
                      key={system}
                      className="rounded bg-secondary px-2 py-0.5 font-mono text-xs text-foreground"
                    >
                      {system}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Indicators
                </label>
                <ul className="mt-1.5 space-y-1">
                  {selectedThreat.indicators.map((indicator, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                      {indicator}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Detected At
                </label>
                <p className="mt-1 font-mono text-sm text-foreground">
                  {selectedThreat.timestamp}
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="flex-1">
                  Investigate
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Mark Resolved
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
