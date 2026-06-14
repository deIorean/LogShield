"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Shield, ArrowLeft, Download, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

const CHART_COLORS: Record<string, string> = {
  "Brute Force": "#2563eb",
  "SQL Injection": "#16a34a",
  "Port Scanning": "#ca8a04",
  "Scanning": "#ca8a04",
  "Anomalous Activity": "#9333ea",
  "Anomalies": "#9333ea",
}

function getSeverityStyle(severity: string) {
  switch (severity) {
    case "High": return "bg-red-600 text-white"
    case "Medium": return "bg-yellow-600 text-white"
    case "Low": return "bg-green-600 text-white"
    default: return "bg-slate-600 text-white"
  }
}

export default function ResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const analysisId = searchParams.get("analysis_id")

  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!analysisId) {
      router.push("/")
      return
    }

    const fetchResult = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/analytics/result/${analysisId}`)
        if (!res.ok) throw new Error("Failed to fetch analysis result")
        const json = await res.json()
        setData(json)
      } catch (err) {
        setError("Failed to load analysis results.")
      } finally {
        setLoading(false)
      }
    }

    fetchResult()
  }, [analysisId])

  const chartData = data
    ? Object.entries(data.threat_type_breakdown).map(([name, value]) => ({
        name,
        value: parseFloat((value as number).toFixed(1)),
        color: CHART_COLORS[name] || "#6366f1",
      }))
    : []

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading analysis results...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">Latest Analysis</h1>
              <p className="text-slate-400 font-medium">Results from your most recent log upload</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => window.print()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl print:hidden"
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 px-6 rounded-xl print:hidden"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: "Logs Analyzed", value: data.total_logs_analyzed, color: "text-blue-400" },
            { label: "Threats Found", value: data.total_threats_detected, color: "text-green-400" },
            { label: "High", value: data.high_severity_count, color: "text-red-400" },
            { label: "Medium", value: data.medium_severity_count, color: "text-yellow-400" },
            { label: "Low", value: data.low_severity_count, color: "text-blue-300" },
          ].map((stat, i) => (
            <Card key={i} className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart + Table */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Donut Chart */}
          <Card className="lg:col-span-1 bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-100">Threat Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={8} dataKey="value">
                          {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2">
                    {chartData.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-slate-400">{item.name}</span>
                        </div>
                        <span className="font-bold text-slate-200">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-slate-500 text-sm text-center py-10">No threat data available.</p>
              )}
            </CardContent>
          </Card>

          {/* Threats Table */}
          <Card className="lg:col-span-2 bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-100">Detected Threats</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {data.threats && data.threats.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-800">
                        <th className="text-left p-4 font-bold uppercase tracking-wider">Source IP</th>
                        <th className="text-left p-4 font-bold uppercase tracking-wider">Attack Type</th>
                        <th className="text-left p-4 font-bold uppercase tracking-wider">Severity</th>
                        <th className="text-left p-4 font-bold uppercase tracking-wider">Risk Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {data.threats.map((threat: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                          <td className="p-4 font-mono font-bold text-slate-300">{threat.suspicious_ip}</td>
                          <td className="p-4 text-slate-300">{threat.threat_type}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getSeverityStyle(threat.severity)}`}>
                              {threat.severity}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-slate-300">{threat.ai_risk_score}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-slate-500 text-sm text-center py-10">No threats detected.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}