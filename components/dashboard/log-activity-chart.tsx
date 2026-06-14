"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Demo data - in production this would come from the API
const data = [
  { time: "00:00", logs: 1200, errors: 45, warnings: 120 },
  { time: "02:00", logs: 900, errors: 32, warnings: 80 },
  { time: "04:00", logs: 650, errors: 18, warnings: 45 },
  { time: "06:00", logs: 800, errors: 22, warnings: 65 },
  { time: "08:00", logs: 1800, errors: 65, warnings: 180 },
  { time: "10:00", logs: 2400, errors: 89, warnings: 250 },
  { time: "12:00", logs: 2100, errors: 72, warnings: 210 },
  { time: "14:00", logs: 2300, errors: 78, warnings: 230 },
  { time: "16:00", logs: 2600, errors: 95, warnings: 280 },
  { time: "18:00", logs: 2200, errors: 68, warnings: 200 },
  { time: "20:00", logs: 1600, errors: 48, warnings: 150 },
  { time: "22:00", logs: 1400, errors: 42, warnings: 130 },
];

interface LogActivityChartProps {
  className?: string;
}

export function LogActivityChart({ className }: LogActivityChartProps) {
  return (
    <div className={className}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">Log Activity</h3>
          <p className="text-sm text-muted-foreground">Request volume over time</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-chart-1" />
            <span className="text-muted-foreground">Total Logs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-warning" />
            <span className="text-muted-foreground">Warnings</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-critical" />
            <span className="text-muted-foreground">Errors</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorLogs" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="oklch(0.65 0.18 250)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="oklch(0.65 0.18 250)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorWarnings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="oklch(0.75 0.18 80)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="oklch(0.75 0.18 80)" stopOpacity={0} />
            </linearGradient>
          </defs>
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
            tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "oklch(0.12 0 0)",
              border: "1px solid oklch(0.22 0 0)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "oklch(0.95 0 0)" }}
          />
          <Area
            type="monotone"
            dataKey="logs"
            stroke="oklch(0.65 0.18 250)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorLogs)"
          />
          <Area
            type="monotone"
            dataKey="warnings"
            stroke="oklch(0.75 0.18 80)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorWarnings)"
          />
          <Area
            type="monotone"
            dataKey="errors"
            stroke="oklch(0.55 0.22 25)"
            strokeWidth={2}
            fillOpacity={0.3}
            fill="oklch(0.55 0.22 25)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
