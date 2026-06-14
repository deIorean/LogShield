"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { StatCard } from "@/components/dashboard/stat-card";
import { LogActivityChart } from "@/components/dashboard/log-activity-chart";
import { ThreatDistributionChart } from "@/components/dashboard/threat-distribution-chart";
import { TopSources } from "@/components/dashboard/top-sources";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Gauge,
} from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
  LineChart,
} from "recharts";

const weeklyData = [
  { day: "Mon", logs: 245000, threats: 18 },
  { day: "Tue", logs: 312000, threats: 24 },
  { day: "Wed", logs: 289000, threats: 21 },
  { day: "Thu", logs: 334000, threats: 29 },
  { day: "Fri", logs: 401000, threats: 35 },
  { day: "Sat", logs: 178000, threats: 12 },
  { day: "Sun", logs: 156000, threats: 9 },
];

const responseTimeData = [
  { time: "00:00", p50: 85, p95: 180, p99: 320 },
  { time: "04:00", p50: 72, p95: 145, p99: 280 },
  { time: "08:00", p50: 120, p95: 280, p99: 450 },
  { time: "12:00", p50: 145, p95: 320, p99: 520 },
  { time: "16:00", p50: 135, p95: 290, p99: 480 },
  { time: "20:00", p50: 95, p95: 200, p99: 350 },
];

const severityData = [
  { name: "Info", count: 185234, percentage: 64 },
  { name: "Warning", count: 67891, percentage: 23 },
  { name: "Error", count: 28456, percentage: 10 },
  { name: "Critical", count: 8675, percentage: 3 },
];

export default function AnalyticsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title="Analytics" />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Top Stats */}
          <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Avg Processing Time"
              value="142ms"
              change={-8.5}
              changeLabel="from last week"
              icon={Clock}
              variant="success"
            />
            <StatCard
              title="Throughput"
              value="12.4k/min"
              change={15.2}
              changeLabel="from last week"
              icon={Gauge}
              variant="default"
            />
            <StatCard
              title="Error Rate"
              value="0.12%"
              change={-22.3}
              changeLabel="from last week"
              icon={TrendingDown}
              variant="success"
            />
            <StatCard
              title="Detection Rate"
              value="99.7%"
              change={0.5}
              changeLabel="from last week"
              icon={TrendingUp}
              variant="success"
            />
          </div>

          {/* Charts Row 1 */}
          <div className="mb-6 grid gap-6 lg:grid-cols-2">
            {/* Weekly Log Volume */}
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="mb-4">
                <h3 className="text-base font-semibold text-foreground">
                  Weekly Log Volume
                </h3>
                <p className="text-sm text-muted-foreground">
                  Daily log ingestion over the past week
                </p>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={weeklyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.22 0 0)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "oklch(0.6 0 0)", fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "oklch(0.6 0 0)", fontSize: 11 }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.12 0 0)",
                      border: "1px solid oklch(0.22 0 0)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [
                      value.toLocaleString(),
                      "Logs",
                    ]}
                  />
                  <Bar
                    dataKey="logs"
                    fill="oklch(0.65 0.18 250)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Response Time Percentiles */}
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="mb-4">
                <h3 className="text-base font-semibold text-foreground">
                  Response Time Percentiles
                </h3>
                <p className="text-sm text-muted-foreground">
                  p50, p95, and p99 latency over 24 hours
                </p>
              </div>
              <div className="mb-4 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-chart-2" />
                  <span className="text-muted-foreground">p50</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-warning" />
                  <span className="text-muted-foreground">p95</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-critical" />
                  <span className="text-muted-foreground">p99</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={responseTimeData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.22 0 0)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "oklch(0.6 0 0)", fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "oklch(0.6 0 0)", fontSize: 11 }}
                    tickFormatter={(value) => `${value}ms`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.12 0 0)",
                      border: "1px solid oklch(0.22 0 0)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="p50"
                    stroke="oklch(0.65 0.15 160)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="p95"
                    stroke="oklch(0.75 0.18 80)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="p99"
                    stroke="oklch(0.55 0.22 25)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="mb-6 grid gap-6 lg:grid-cols-3">
            <LogActivityChart className="rounded-lg border border-border bg-card p-5 lg:col-span-2" />
            
            {/* Severity Breakdown */}
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="mb-4">
                <h3 className="text-base font-semibold text-foreground">
                  Severity Breakdown
                </h3>
                <p className="text-sm text-muted-foreground">
                  Log distribution by level
                </p>
              </div>
              <div className="space-y-4">
                {severityData.map((item) => (
                  <div key={item.name}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="text-foreground">{item.name}</span>
                      <span className="font-medium text-foreground">
                        {item.count.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-secondary">
                      <div
                        className={`h-full rounded-full transition-all ${
                          item.name === "Critical"
                            ? "bg-critical"
                            : item.name === "Error"
                            ? "bg-critical/70"
                            : item.name === "Warning"
                            ? "bg-warning"
                            : "bg-info"
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.percentage}% of total
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid gap-6 lg:grid-cols-3">
            <ThreatDistributionChart className="rounded-lg border border-border bg-card p-5" />
            <TopSources className="lg:col-span-2 rounded-lg border border-border bg-card p-5" />
          </div>
        </main>
      </div>
    </div>
  );
}
