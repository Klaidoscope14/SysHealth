"use client"

import { Shield, RefreshCw, Download, Terminal } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { useState, useEffect } from "react"

export function DashboardSidebar() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [uptime, setUptime] = useState("14d 06:42:18")

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    })
  }

  const quickActions = [
    { icon: Shield, label: "Security Scan" },
    { icon: RefreshCw, label: "Sync Data" },
    { icon: Download, label: "Backup" },
    { icon: Terminal, label: "Console" }
  ]

  return (
    <div className="space-y-6">
      {/* System Time */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 border-b border-slate-700/50">
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1 font-mono">SYSTEM TIME</div>
              <div className="text-4xl font-mono text-cyan-400 tracking-wider">
                {formatTime(currentTime)}
              </div>
              <div className="text-sm text-slate-400 mt-1">
                {currentTime.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })}
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                <div className="text-xs text-slate-500 mb-1">Uptime</div>
                <div className="text-sm font-mono text-slate-200">{uptime}</div>
              </div>
              <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                <div className="text-xs text-slate-500 mb-1">Time Zone</div>
                <div className="text-sm font-mono text-slate-200">UTC-08:00</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 hover:bg-slate-700/50 transition-colors"
              >
                <action.icon className="h-6 w-6 text-cyan-400 mx-auto mb-2" />
                <div className="text-sm text-slate-300 text-center">{action.label}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resource Allocation */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Resource Allocation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm text-slate-400">Processing Power</div>
              <div className="text-xs text-cyan-400">42% allocated</div>
            </div>
            <Progress value={42} className="h-2 bg-slate-700/50">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400" style={{ width: '42%' }} />
            </Progress>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm text-slate-400">Memory Allocation</div>
              <div className="text-xs text-purple-400">68% allocated</div>
            </div>
            <Progress value={68} className="h-2 bg-slate-700/50">
              <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400" style={{ width: '68%' }} />
            </Progress>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm text-slate-400">Network Bandwidth</div>
              <div className="text-xs text-blue-400">35% allocated</div>
            </div>
            <Progress value={35} className="h-2 bg-slate-700/50">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400" style={{ width: '35%' }} />
            </Progress>
          </div>

          <div className="pt-2 border-t border-slate-700/50">
            <div className="flex items-center justify-between text-sm">
              <div className="text-slate-400">Priority Level</div>
              <div className="flex items-center gap-2">
                <Slider className="w-24" defaultValue={[3]} max={5} step={1} />
                <span className="text-cyan-400">3/5</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 