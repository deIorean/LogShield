"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
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
  Plus,
  MoreHorizontal,
  Shield,
  AlertTriangle,
  Zap,
  Eye,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

interface Rule {
  id: string;
  name: string;
  description: string;
  type: "detection" | "prevention" | "alert";
  severity: "low" | "medium" | "high" | "critical";
  enabled: boolean;
  conditions: string[];
  actions: string[];
  hits_24h: number;
  last_triggered: string;
}

const demoRules: Rule[] = [
  {
    id: "RULE-001",
    name: "Brute Force Detection",
    description: "Detect multiple failed login attempts from single IP",
    type: "detection",
    severity: "critical",
    enabled: true,
    conditions: ["Failed logins > 10 in 5 minutes", "Single source IP"],
    actions: ["Block IP", "Send alert", "Log incident"],
    hits_24h: 47,
    last_triggered: "5 min ago",
  },
  {
    id: "RULE-002",
    name: "SQL Injection Prevention",
    description: "Block requests containing SQL injection patterns",
    type: "prevention",
    severity: "high",
    enabled: true,
    conditions: ["Request contains SQL keywords", "UNION SELECT pattern"],
    actions: ["Block request", "Log attempt", "Alert security team"],
    hits_24h: 23,
    last_triggered: "12 min ago",
  },
  {
    id: "RULE-003",
    name: "Rate Limit Alert",
    description: "Alert when API rate limits are being approached",
    type: "alert",
    severity: "medium",
    enabled: true,
    conditions: ["Requests > 80% of limit", "Sustained for 2 minutes"],
    actions: ["Send alert", "Log event"],
    hits_24h: 156,
    last_triggered: "2 hours ago",
  },
  {
    id: "RULE-004",
    name: "Suspicious User Agent",
    description: "Flag requests with known malicious user agents",
    type: "detection",
    severity: "medium",
    enabled: false,
    conditions: ["User-Agent matches malicious pattern", "No valid session"],
    actions: ["Flag for review", "Add to watchlist"],
    hits_24h: 0,
    last_triggered: "Never",
  },
  {
    id: "RULE-005",
    name: "XSS Attack Prevention",
    description: "Block cross-site scripting attempts in input fields",
    type: "prevention",
    severity: "high",
    enabled: true,
    conditions: ["Input contains script tags", "Encoded JavaScript"],
    actions: ["Sanitize input", "Block request", "Log attempt"],
    hits_24h: 8,
    last_triggered: "4 hours ago",
  },
  {
    id: "RULE-006",
    name: "Geographic Anomaly",
    description: "Detect logins from unusual geographic locations",
    type: "alert",
    severity: "low",
    enabled: true,
    conditions: ["New country for user", "VPN/Proxy detected"],
    actions: ["Require 2FA", "Send notification"],
    hits_24h: 234,
    last_triggered: "30 min ago",
  },
];

const typeColors = {
  detection: "bg-info/10 text-info",
  prevention: "bg-critical/10 text-critical",
  alert: "bg-warning/10 text-warning",
};

const typeIcons = {
  detection: Eye,
  prevention: Shield,
  alert: AlertTriangle,
};

const severityColors = {
  low: "text-info",
  medium: "text-warning",
  high: "text-critical/70",
  critical: "text-critical",
};

export default function RulesPage() {
  const [rules, setRules] = useState(demoRules);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleRule = (ruleId: string) => {
    setRules(
      rules.map((rule) =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  const filteredRules = rules.filter(
    (rule) =>
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title="Rules" />
        <main className="flex-1 overflow-y-auto">
          {/* Toolbar */}
          <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search rules..."
                  className="h-9 w-80 bg-secondary pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Create Rule
            </Button>
          </div>

          {/* Rules List */}
          <div className="p-6">
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Rule
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Severity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Hits (24h)
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Last Triggered
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredRules.map((rule) => {
                    const TypeIcon = typeIcons[rule.type];
                    return (
                      <tr
                        key={rule.id}
                        className={cn(
                          "transition-colors hover:bg-secondary/30",
                          !rule.enabled && "opacity-60"
                        )}
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-md",
                                typeColors[rule.type]
                              )}
                            >
                              <TypeIcon className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {rule.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {rule.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                              typeColors[rule.type]
                            )}
                          >
                            {rule.type}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={cn(
                              "text-sm font-medium capitalize",
                              severityColors[rule.severity]
                            )}
                          >
                            {rule.severity}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <Zap className="h-3.5 w-3.5 text-warning" />
                            <span className="text-sm font-medium text-foreground">
                              {rule.hits_24h}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">
                          {rule.last_triggered}
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => toggleRule(rule.id)}
                            className="flex items-center gap-2 text-sm"
                          >
                            {rule.enabled ? (
                              <>
                                <ToggleRight className="h-5 w-5 text-success" />
                                <span className="text-success">Enabled</span>
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  Disabled
                                </span>
                              </>
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                <DropdownMenuItem>Export</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
