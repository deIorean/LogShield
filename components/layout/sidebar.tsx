"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Shield,
  AlertTriangle,
  Settings,
  Activity,
  Database,
  Search,
  Upload, // 1. Added the Upload icon here
} from "lucide-react";

const navigation = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Upload Logs", href: "/upload", icon: Upload }, // 2. Added the link here
  { name: "Logs", href: "/logs", icon: FileText },
  { name: "Threats", href: "/threats", icon: AlertTriangle },
  { name: "Rules", href: "/rules", icon: Shield },
  { name: "Analytics", href: "/analytics", icon: Activity },
  { name: "Sources", href: "/sources", icon: Database },
];

const secondaryNav = [
  { name: "Search", href: "/search", icon: Search },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <Shield className="h-6 w-6 text-primary" />
        <span className="text-lg font-semibold text-sidebar-foreground">
          Testing 123
        </span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        <div className="mb-2">
          <span className="px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Main
          </span>
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}

        <div className="mb-2 mt-6">
          <span className="px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            System
          </span>
        </div>
        {secondaryNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Status Footer */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success"></span>
          </span>
          <span className="text-xs text-muted-foreground">System Online</span>
        </div>
      </div>
    </aside>
  );
}