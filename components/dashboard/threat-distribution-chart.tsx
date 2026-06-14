"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "SQL Injection", value: 35, color: "oklch(0.55 0.22 25)" },
  { name: "XSS Attacks", value: 28, color: "oklch(0.75 0.18 80)" },
  { name: "Brute Force", value: 22, color: "oklch(0.65 0.18 250)" },
  { name: "DDoS", value: 10, color: "oklch(0.65 0.15 160)" },
  { name: "Other", value: 5, color: "oklch(0.6 0.2 300)" },
];

interface ThreatDistributionChartProps {
  className?: string;
}

export function ThreatDistributionChart({
  className,
}: ThreatDistributionChartProps) {
  return (
    <div className={className}>
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">
          Threat Distribution
        </h3>
        <p className="text-sm text-muted-foreground">
          Breakdown by attack type
        </p>
      </div>
      <div className="flex items-center gap-6">
        <ResponsiveContainer width={180} height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.12 0 0)",
                border: "1px solid oklch(0.22 0 0)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number) => [`${value}%`, "Share"]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-2">
          {data.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-muted-foreground">{item.name}</span>
              </div>
              <span className="font-medium text-foreground">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
