"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Clock, ExternalLink } from "lucide-react";

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
  status: "active" | "investigating" | "resolved";
}

const activeAlerts: Alert[] = [
  {
    id: "1",
    title: "Brute Force Attack Detected",
    description:
      "Multiple failed authentication attempts from 45.33.32.156",
    severity: "critical",
    timestamp: "2 min ago",
    status: "active",
  },
  {
    id: "2",
    title: "Unusual API Traffic Pattern",
    description:
      "300% increase in requests to /api/v1/export endpoint",
    severity: "high",
    timestamp: "15 min ago",
    status: "investigating",
  },
  {
    id: "3",
    title: "SSL Certificate Expiring",
    description:
      "Certificate for api.example.com expires in 7 days",
    severity: "medium",
    timestamp: "1 hour ago",
    status: "active",
  },
];

const severityColors = {
  low: "border-l-info bg-info/5",
  medium: "border-l-warning bg-warning/5",
  high: "border-l-critical/70 bg-critical/5",
  critical: "border-l-critical bg-critical/10",
};

const severityBadgeColors = {
  low: "bg-info/10 text-info",
  medium: "bg-warning/10 text-warning",
  high: "bg-critical/10 text-critical",
  critical: "bg-critical text-critical-foreground",
};

const statusIcons = {
  active: AlertTriangle,
  investigating: Clock,
  resolved: CheckCircle,
};

interface ActiveAlertsProps {
  className?: string;
}

export function ActiveAlerts({ className }: ActiveAlertsProps) {
  return (
    <div className={className}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Active Alerts
          </h3>
          <p className="text-sm text-muted-foreground">
            Requires immediate attention
          </p>
        </div>
        <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
          View All
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>
      <div className="space-y-3">
        {activeAlerts.map((alert) => {
          const StatusIcon = statusIcons[alert.status];
          return (
            <div
              key={alert.id}
              className={cn(
                "rounded-md border border-border border-l-4 p-4 transition-colors hover:bg-secondary/30",
                severityColors[alert.severity]
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                        severityBadgeColors[alert.severity]
                      )}
                    >
                      {alert.severity}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <StatusIcon className="h-3 w-3" />
                      {alert.status}
                    </span>
                  </div>
                  <h4 className="font-medium text-foreground">{alert.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {alert.description}
                  </p>
                </div>
                <span className="whitespace-nowrap text-xs text-muted-foreground">
                  {alert.timestamp}
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" className="h-7 text-xs">
                  Investigate
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  Dismiss
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
