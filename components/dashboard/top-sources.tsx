"use client";

import { cn } from "@/lib/utils";
import { Server, Globe, Database, Shield, Cloud } from "lucide-react";

interface Source {
  name: string;
  type: "server" | "api" | "database" | "firewall" | "cloud";
  requests: number;
  percentage: number;
  status: "healthy" | "warning" | "error";
}

const sources: Source[] = [
  {
    name: "api-gateway-prod",
    type: "api",
    requests: 245892,
    percentage: 42,
    status: "healthy",
  },
  {
    name: "auth-service",
    type: "server",
    requests: 128456,
    percentage: 22,
    status: "warning",
  },
  {
    name: "postgres-primary",
    type: "database",
    requests: 89234,
    percentage: 15,
    status: "healthy",
  },
  {
    name: "cloudflare-waf",
    type: "firewall",
    requests: 67891,
    percentage: 12,
    status: "healthy",
  },
  {
    name: "aws-lambda",
    type: "cloud",
    requests: 52347,
    percentage: 9,
    status: "error",
  },
];

const typeIcons = {
  server: Server,
  api: Globe,
  database: Database,
  firewall: Shield,
  cloud: Cloud,
};

const statusColors = {
  healthy: "bg-success",
  warning: "bg-warning",
  error: "bg-critical",
};

interface TopSourcesProps {
  className?: string;
}

export function TopSources({ className }: TopSourcesProps) {
  return (
    <div className={className}>
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">Top Sources</h3>
        <p className="text-sm text-muted-foreground">
          Highest volume log sources
        </p>
      </div>
      <div className="space-y-3">
        {sources.map((source) => {
          const Icon = typeIcons[source.type];
          return (
            <div
              key={source.name}
              className="group flex items-center gap-3 rounded-md border border-border p-3 transition-colors hover:bg-secondary/30"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium text-foreground">
                    {source.name}
                  </span>
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      statusColors[source.status]
                    )}
                  />
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {source.percentage}%
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-foreground">
                  {source.requests.toLocaleString()}
                </span>
                <p className="text-xs text-muted-foreground">requests</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
