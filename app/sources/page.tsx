"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  Server,
  Globe,
  Database,
  Shield,
  Cloud,
  MoreHorizontal,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Settings,
  Trash2,
  RefreshCw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Source {
  id: string;
  name: string;
  type: "server" | "api" | "database" | "firewall" | "cloud";
  status: "healthy" | "warning" | "error" | "offline";
  host: string;
  port: number;
  logs_24h: number;
  last_seen: string;
  uptime: string;
}

const demoSources: Source[] = [
  {
    id: "src-001",
    name: "api-gateway-prod",
    type: "api",
    status: "healthy",
    host: "api.example.com",
    port: 443,
    logs_24h: 245892,
    last_seen: "Just now",
    uptime: "99.99%",
  },
  {
    id: "src-002",
    name: "auth-service",
    type: "server",
    status: "warning",
    host: "auth.internal.local",
    port: 8080,
    logs_24h: 128456,
    last_seen: "2 min ago",
    uptime: "99.87%",
  },
  {
    id: "src-003",
    name: "postgres-primary",
    type: "database",
    status: "healthy",
    host: "db-primary.internal.local",
    port: 5432,
    logs_24h: 89234,
    last_seen: "Just now",
    uptime: "99.99%",
  },
  {
    id: "src-004",
    name: "cloudflare-waf",
    type: "firewall",
    status: "healthy",
    host: "cloudflare.com",
    port: 443,
    logs_24h: 67891,
    last_seen: "Just now",
    uptime: "100%",
  },
  {
    id: "src-005",
    name: "aws-lambda-functions",
    type: "cloud",
    status: "error",
    host: "us-east-1.aws.amazon.com",
    port: 443,
    logs_24h: 52347,
    last_seen: "15 min ago",
    uptime: "98.45%",
  },
  {
    id: "src-006",
    name: "postgres-replica",
    type: "database",
    status: "healthy",
    host: "db-replica.internal.local",
    port: 5432,
    logs_24h: 45123,
    last_seen: "Just now",
    uptime: "99.95%",
  },
  {
    id: "src-007",
    name: "nginx-loadbalancer",
    type: "server",
    status: "healthy",
    host: "lb.internal.local",
    port: 80,
    logs_24h: 312456,
    last_seen: "Just now",
    uptime: "99.99%",
  },
  {
    id: "src-008",
    name: "redis-cache",
    type: "database",
    status: "offline",
    host: "cache.internal.local",
    port: 6379,
    logs_24h: 0,
    last_seen: "2 hours ago",
    uptime: "95.23%",
  },
];

const typeIcons = {
  server: Server,
  api: Globe,
  database: Database,
  firewall: Shield,
  cloud: Cloud,
};

const statusConfig = {
  healthy: {
    icon: CheckCircle,
    color: "text-success",
    bg: "bg-success/10",
    label: "Healthy",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-warning",
    bg: "bg-warning/10",
    label: "Warning",
  },
  error: {
    icon: XCircle,
    color: "text-critical",
    bg: "bg-critical/10",
    label: "Error",
  },
  offline: {
    icon: XCircle,
    color: "text-muted-foreground",
    bg: "bg-muted",
    label: "Offline",
  },
};

export default function SourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSources = demoSources.filter(
    (source) =>
      source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.host.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statsummary = {
    total: demoSources.length,
    healthy: demoSources.filter((s) => s.status === "healthy").length,
    warning: demoSources.filter((s) => s.status === "warning").length,
    error: demoSources.filter((s) => s.status === "error").length,
    offline: demoSources.filter((s) => s.status === "offline").length,
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title="Sources" />
        <main className="flex-1 overflow-y-auto">
          {/* Stats Bar */}
          <div className="border-b border-border bg-card px-6 py-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {statsummary.total}
                </span>
                <span className="text-sm text-muted-foreground">
                  Total Sources
                </span>
              </div>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm text-muted-foreground">
                    {statsummary.healthy} Healthy
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="text-sm text-muted-foreground">
                    {statsummary.warning} Warning
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <XCircle className="h-4 w-4 text-critical" />
                  <span className="text-sm text-muted-foreground">
                    {statsummary.error} Error
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {statsummary.offline} Offline
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search sources..."
                className="h-9 w-80 bg-secondary pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Add Source
            </Button>
          </div>

          {/* Sources Grid */}
          <div className="p-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredSources.map((source) => {
                const TypeIcon = typeIcons[source.type];
                const status = statusConfig[source.status];
                const StatusIcon = status.icon;

                return (
                  <div
                    key={source.id}
                    className={cn(
                      "rounded-lg border bg-card p-5 transition-all hover:border-primary/50",
                      source.status === "error" && "border-critical/30",
                      source.status === "offline" && "opacity-60"
                    )}
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                          <TypeIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {source.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {source.id}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Test Connection
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            Configure
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="mb-4 space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Host</span>
                        <span className="font-mono text-xs text-foreground">
                          {source.host}:{source.port}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Logs (24h)
                        </span>
                        <span className="font-medium text-foreground">
                          {source.logs_24h.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Uptime</span>
                        <span className="font-medium text-foreground">
                          {source.uptime}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-border pt-4">
                      <div
                        className={cn(
                          "flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium",
                          status.bg,
                          status.color
                        )}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {source.last_seen}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
