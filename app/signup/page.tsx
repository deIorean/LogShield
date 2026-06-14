"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Shield, User, Mail, Lock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

export default function SignupPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.detail || "Registration failed")
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
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[120px]" />

      <Card className="w-full max-w-[400px] bg-card/50 border-border/50 backdrop-blur-xl shadow-2xl relative z-10">
        <CardHeader className="space-y-1 flex flex-col items-center pt-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Create Account</CardTitle>
          <CardDescription className="text-muted-foreground text-center">
            Join LogShield to secure your infrastructure
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 pb-8">
          <form onSubmit={handleSignup} className="grid gap-4">
            <div className="relative group">
              <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Full Name"
                required
                className="w-full bg-background border border-border rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all outline-none text-white"
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
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
                placeholder="Create Password"
                required
                className="w-full bg-background border border-border rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all outline-none text-white"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11 transition-all">
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline font-medium">
              Login here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}