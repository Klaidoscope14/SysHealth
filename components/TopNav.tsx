"use client"

import { Bell, Moon, Sun, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

export function TopNav() {
  const { setTheme, theme } = useTheme()
  const [notifications] = useState([
    { id: 1, text: "System update available", time: "2 mins ago" },
    { id: 2, text: "Backup completed successfully", time: "1 hour ago" },
    { id: 3, text: "Security scan completed", time: "3 hours ago" },
  ])

  return (
    <div className="fixed top-0 right-0 p-4 flex items-center gap-4 z-50">
      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>

      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm relative"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-cyan-500 border-2 border-slate-900"></span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 bg-slate-900/95 border-slate-700/50 backdrop-blur-sm">
          {notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3">
              <div className="text-sm text-slate-200">{notification.text}</div>
              <div className="text-xs text-slate-400">{notification.time}</div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm"
          >
            <User className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-slate-900/95 border-slate-700/50 backdrop-blur-sm">
          <DropdownMenuItem>
            Profile Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            Preferences
          </DropdownMenuItem>
          <DropdownMenuItem>
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
} 