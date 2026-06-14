"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Shield, Mail, Lock, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.detail || "Invalid credentials")
        return
      }

      sessionStorage.setItem("userName", data.full_name)
      sessionStorage.setItem("userId", data.id)
      router.push("/")

    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#020817] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[120px]" />

      <Card className="w-full max-w-[400px] bg-card/50 border-border/50 backdrop-blur-xl shadow-2xl relative z-10">
        <CardHeader className="space-y-1 flex flex-col items-center pt-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-600/20">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Welcome Back</CardTitle>
          <CardDescription className="text-muted-foreground text-center">
            Enter your credentials to access LogShield
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 pb-8">
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="relative group">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
              <input
                type="email"
                placeholder="Email address"
                required
                className="w-full bg-background border border-border rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all outline-none text-white"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full bg-background border border-border rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all outline-none text-white"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11 transition-all group">
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0b1120] px-2 text-muted-foreground">Or</span></div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            New to LogShield?{" "}
            <Link href="/signup" className="text-blue-500 hover:underline font-medium">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}