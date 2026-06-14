"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { 
  Shield, 
  FileText, 
  LogOut, 
  Menu, 
  Moon, 
  Sun, 
  Download, 
  Upload,
  Loader2
} from "lucide-react"
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

interface DashboardStats {
  total_logs_analyzed: number
  total_threats_detected: number
  high_severity_count: number
  medium_severity_count: number
  low_severity_count: number
  threat_type_breakdown: Record<string, number>
}

interface Threat {
  id: string
  suspicious_ip: string
  threat_type: string
  severity: string
  ai_risk_score: number
  description: string
  detected_at: string
}

interface AnalysisResult {
  analysis_id: string
  summary: string
  stats: {
    total_logs_analyzed: number
    total_threats_detected: number
    high_severity_count: number
    medium_severity_count: number
    low_severity_count: number
  }
  threat_type_breakdown: Record<string, number>
  threats: {
    suspicious_ip: string
    threat_type: string
    severity: string
    ai_risk_score: number
    description: string
    recommendation: string
  }[]
}

export default function LogShieldDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentView, setCurrentView] = useState("dashboard")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [userName, setUserName] = useState("Admin")
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [theme, setTheme] = useState("dark")
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [threats, setThreats] = useState<Threat[]>([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingThreats, setLoadingThreats] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<AnalysisResult | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark"
    setTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (t: string) => {
    if (t === "dark") document.documentElement.classList.add("dark")
    else document.documentElement.classList.remove("dark")
  }

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    applyTheme(newTheme)
  }

  useEffect(() => {
    const storedName = sessionStorage.getItem("userName")
    if (!storedName) router.push("/login")
    else setUserName(storedName)

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setIsAccountMenuOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [router])

  const handleLogout = () => {
    sessionStorage.clear()
    localStorage.removeItem("userName")
    router.push("/login")
  }

  const fetchDashboardStats = async () => {
    try {
      setLoadingStats(true)
      const userId = sessionStorage.getItem("userId") || ""
      const res = await fetch(`${API_BASE_URL}/analytics/dashboard?user_id=${userId}`)
      const data = await res.json()
      setDashboardStats(data)
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err)
    } finally {
      setLoadingStats(false)
    }
  }

  const fetchThreats = async () => {
    try {
      setLoadingThreats(true)
      const userId = sessionStorage.getItem("userId") || ""
      const res = await fetch(`${API_BASE_URL}/threats?user_id=${userId}`)
      const data = await res.json()
      setThreats(data.threats || [])
    } catch (err) {
      console.error("Failed to fetch threats:", err)
    } finally {
      setLoadingThreats(false)
    }
  }

  useEffect(() => {
    fetchDashboardStats()
    fetchThreats()
  }, [])

  // ✅ FIXED: data is fetched first, then used in setUploadResult
  const handleAnalyze = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!selectedFile) return

    setUploading(true)
    setUploadError(null)
    setUploadResult(null)

    const formData = new FormData()
    formData.append("file", selectedFile)

    try {
      const userId = sessionStorage.getItem("userId") || ""

      const res = await fetch(`${API_BASE_URL}/logs/upload?user_id=${userId}`, {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.detail || "Upload failed")

      setUploadResult({
        ...data.analysis,
        analysis_id: data.analysis_id,
      })

      await fetchDashboardStats()
      await fetchThreats()

    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setUploading(false)
    }
  }

  const statsCards = dashboardStats
    ? [
        { label: "Total Logs", value: dashboardStats.total_logs_analyzed.toLocaleString(), icon: FileText, color: "bg-blue-500/20 text-blue-600 dark:text-blue-400" },
        { label: "Threats", value: dashboardStats.total_threats_detected.toLocaleString(), icon: Shield, color: "bg-green-500/20 text-green-700 dark:text-green-400" },
        { label: "High", value: dashboardStats.high_severity_count.toLocaleString(), icon: () => <span className="text-red-600 dark:text-red-400 text-lg font-bold">!</span>, color: "bg-red-500/20 text-red-600" },
        { label: "Medium", value: dashboardStats.medium_severity_count.toLocaleString(), icon: () => <span className="text-yellow-600 dark:text-yellow-400 text-lg font-bold">!</span>, color: "bg-yellow-500/20 text-yellow-600" },
        { label: "Low", value: dashboardStats.low_severity_count.toLocaleString(), icon: () => <span className="text-blue-600 dark:text-blue-400 text-lg font-bold">*</span>, color: "bg-blue-500/20 text-blue-600" },
      ]
    : []

  const threatChartData = dashboardStats
    ? Object.entries(dashboardStats.threat_type_breakdown).map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(1)),
        color: CHART_COLORS[name] || "#6366f1",
      }))
    : []

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">

      <aside className={`${sidebarOpen ? "w-64" : "w-0 -ml-64"} print:hidden md:w-64 md:ml-0 bg-white dark:bg-slate-900 flex flex-col transition-all duration-300 fixed md:static h-screen z-50 border-r border-slate-200 dark:border-slate-800`}>
        <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView("dashboard")}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">LogShield</span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <button onClick={() => setCurrentView("dashboard")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === "dashboard" ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 font-bold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
            <FileText className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          <button onClick={() => { setCurrentView("upload"); setUploadResult(null); setUploadError(null); setSelectedFile(null); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === "upload" ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 font-bold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
            <Upload className="w-5 h-5" />
            <span>Upload Logs</span>
          </button>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden print:overflow-visible">

        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40 print:hidden">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="w-6 h-6" />
            </Button>
            <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100 capitalize">{currentView}</h2>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={toggleTheme} className="rounded-full border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800">
              {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-blue-600" />}
            </Button>

            <div className="relative" ref={menuRef}>
              <button onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)} className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                <span className="text-sm font-semibold hidden sm:block text-slate-700 dark:text-slate-200">{userName}</span>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs uppercase">{userName.charAt(0)}</div>
              </button>

              {isAccountMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 py-2">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 mb-2">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Account</p>
                    <p className="text-sm font-bold truncate text-slate-800 dark:text-slate-100">{userName}</p>
                  </div>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-10 overflow-auto print:p-0 print:overflow-visible">

          {currentView === "dashboard" && (
            <div className="max-w-7xl mx-auto space-y-8 print:space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">Security Overview</h1>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">Cumulative data from all your log uploads</p>
                </div>
                <Button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg px-6 rounded-xl print:hidden">
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>

              {loadingStats ? (
                <div className="flex items-center gap-2 text-slate-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading stats...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                  {statsCards.map((stat, i) => (
                    <Card key={i} className="border border-slate-200 dark:border-none shadow-sm bg-white dark:bg-slate-900">
                      <CardContent className="p-6 flex flex-col gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                          {typeof stat.icon === "function" ? <stat.icon /> : <stat.icon className="w-6 h-6" />}
                        </div>
                        <div>
                          <p className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="grid lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1 border border-slate-200 dark:border-none shadow-sm bg-white dark:bg-slate-900">
                  <CardHeader><CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">Threat Distribution</CardTitle></CardHeader>
                  <CardContent>
                    {loadingStats ? (
                      <div className="h-64 flex items-center justify-center text-slate-400">
                        <Loader2 className="w-6 h-6 animate-spin" />
                      </div>
                    ) : threatChartData.length > 0 ? (
                      <>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={threatChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="value">
                                {threatChartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-4 space-y-2">
                          {threatChartData.map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-slate-600 dark:text-slate-400 font-medium">{item.name}</span>
                              </div>
                              <span className="font-bold text-slate-800 dark:text-slate-100">{item.value}%</span>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-slate-400 text-sm text-center py-10">No threat data yet. Upload a log file to get started.</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2 border border-slate-200 dark:border-none shadow-sm bg-white dark:bg-slate-900 flex flex-col">
                  <CardHeader><CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">Recent Incidents</CardTitle></CardHeader>
                  <CardContent className="p-0 flex-1">
                    {loadingThreats ? (
                      <div className="flex items-center justify-center gap-2 text-slate-400 py-10">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Loading threats...</span>
                      </div>
                    ) : threats.length > 0 ? (
                      <div className="overflow-x-auto h-full">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-transparent">
                              <th className="text-left p-4 font-bold uppercase tracking-wider">Source IP</th>
                              <th className="text-left p-4 font-bold uppercase tracking-wider">Attack Type</th>
                              <th className="text-left p-4 font-bold uppercase tracking-wider">Severity</th>
                              <th className="text-left p-4 font-bold uppercase tracking-wider">Risk Score</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {threats.map((threat, i) => (
                              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="p-4 font-mono font-bold text-slate-700 dark:text-slate-300">{threat.suspicious_ip}</td>
                                <td className="p-4 text-slate-700 dark:text-slate-300">{threat.threat_type}</td>
                                <td className="p-4">
                                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getSeverityStyle(threat.severity)}`}>
                                    {threat.severity}
                                  </span>
                                </td>
                                <td className="p-4 font-bold text-slate-700 dark:text-slate-300">{threat.ai_risk_score}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-slate-400 text-sm text-center py-10">No incidents found. Upload a log file to get started.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {currentView === "upload" && (
            <div className="max-w-3xl mx-auto py-20 text-center animate-in zoom-in-95 duration-500">
              <div className="bg-blue-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <Upload className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-black mb-4 text-slate-900 dark:text-white">Upload System Logs</h1>
              <p className="text-slate-600 dark:text-slate-400 mb-10 text-lg font-medium">Drop your firewall or server logs here for immediate AI-powered threat hunting.</p>

              <div
                className="border-4 border-dashed border-slate-300 dark:border-slate-800 rounded-[2rem] p-16 bg-white dark:bg-slate-900 hover:border-blue-500 transition-all cursor-pointer group"
                onClick={() => document.getElementById("log-input")?.click()}
              >
                <input
                  type="file"
                  id="log-input"
                  className="hidden"
                  accept=".log,.txt,.csv"
                  onChange={(e) => {
                    setSelectedFile(e.target.files?.[0] || null)
                    setUploadResult(null)
                    setUploadError(null)
                  }}
                />
                <p className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-200 group-hover:text-blue-600">
                  {selectedFile ? selectedFile.name : "Select your .log or .csv file"}
                </p>
                <p className="text-slate-500 text-sm">Maximum file size: 50MB</p>

                {selectedFile && !uploading && !uploadResult && (
                  <Button
                    onClick={handleAnalyze}
                    className="mt-10 bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-6 rounded-2xl text-lg transition-transform active:scale-95"
                  >
                    Analyze Now
                  </Button>
                )}

                {uploading && (
                  <div className="mt-10 flex items-center justify-center gap-3 text-blue-500">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="font-bold text-lg">Analyzing with AI...</span>
                  </div>
                )}
              </div>

              {uploadError && (
                <div className="mt-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium">
                  {uploadError}
                </div>
              )}

              {uploadResult && (
                <div className="mt-8 text-left space-y-4">
                  <div className="p-6 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl">
                    <h3 className="font-black text-green-700 dark:text-green-400 text-lg mb-2">✅ Analysis Complete!</h3>
                    <p className="text-slate-700 dark:text-slate-300 text-sm">{uploadResult.summary}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                      <p className="text-2xl font-black text-slate-900 dark:text-white">{uploadResult.stats.total_threats_detected}</p>
                      <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">Threats</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                      <p className="text-2xl font-black text-red-600">{uploadResult.stats.high_severity_count}</p>
                      <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">High</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                      <p className="text-2xl font-black text-yellow-600">{uploadResult.stats.medium_severity_count}</p>
                      <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">Medium</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      if (uploadResult?.analysis_id) {
                        router.push(`/results?analysis_id=${uploadResult.analysis_id}`)
                      }
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl text-lg"
                  >
                    View Full Analysis
                  </Button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}