"use client" // Indicates that this component is client-side in a Next.js application.

import { Shield, RefreshCw, Download, Terminal } from "lucide-react" // Importing icons from the Lucide icon library for use in the sidebar.
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card" // Importing UI components for card layout.
import { Progress } from "@/components/ui/progress" // Importing a progress bar component for displaying resource allocation.
import { Slider } from "@/components/ui/slider" // Importing a slider component to adjust priority level.
import { useState, useEffect } from "react" // Importing React hooks to manage state and side effects.

export function DashboardSidebar() {
  const [currentTime, setCurrentTime] = useState(new Date()) // State to track the current time.
  const [uptime, setUptime] = useState("14d 06:42:18") // State to track system uptime.

  // useEffect hook to update the current time every second.
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date()) // Update the current time every second.
    }, 1000)

    return () => clearInterval(timer) // Clean up the timer when the component is unmounted.
  }, [])

  // Function to format the current time to a human-readable format (HH:mm:ss).
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    })
  }

  // Quick actions array with icons and labels for quick operations (e.g., Security Scan, Sync Data).
  const quickActions = [
    { icon: Shield, label: "Security Scan" },
    { icon: RefreshCw, label: "Sync Data" },
    { icon: Download, label: "Backup" },
    { icon: Terminal, label: "Console" }
  ]

  return (
    <div className="space-y-6"> {/* Container for the sidebar components with vertical spacing */}
      
      {/* System Time Card */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardContent className="p-0">
          {/* Card Header for system time */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 border-b border-slate-700/50">
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1 font-mono">SYSTEM TIME</div> {/* Label for system time */}
              <div className="text-4xl font-mono text-cyan-400 tracking-wider">
                {formatTime(currentTime)} {/* Display current time */}
              </div>
              <div className="text-sm text-slate-400 mt-1">
                {currentTime.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })} {/* Display current date */}
              </div>
            </div>
          </div>
          {/* Card content with uptime and timezone */}
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {/* Uptime information */}
              <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                <div className="text-xs text-slate-500 mb-1">Uptime</div>
                <div className="text-sm font-mono text-slate-200">{uptime}</div> {/* Display system uptime */}
              </div>
              {/* Timezone information */}
              <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                <div className="text-xs text-slate-500 mb-1">Time Zone</div>
                <div className="text-sm font-mono text-slate-200">UTC-08:00</div> {/* Display timezone */}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Card */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle> {/* Card title */}
        </CardHeader>
        <CardContent>
          {/* Grid of quick action buttons */}
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 hover:bg-slate-700/50 transition-colors"
              >
                <action.icon className="h-6 w-6 text-cyan-400 mx-auto mb-2" /> {/* Displaying action icon */}
                <div className="text-sm text-slate-300 text-center">{action.label}</div> {/* Displaying action label */}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resource Allocation Card */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Resource Allocation</CardTitle> {/* Card title */}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Processing Power Allocation */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm text-slate-400">Processing Power</div>
              <div className="text-xs text-cyan-400">42% allocated</div> {/* Processing power allocated */}
            </div>
            <Progress value={42} className="h-2 bg-slate-700/50">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400" style={{ width: '42%' }} /> {/* Progress bar for processing power */}
            </Progress>
          </div>

          {/* Memory Allocation */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm text-slate-400">Memory Allocation</div>
              <div className="text-xs text-purple-400">68% allocated</div> {/* Memory allocated */}
            </div>
            <Progress value={68} className="h-2 bg-slate-700/50">
              <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400" style={{ width: '68%' }} /> {/* Progress bar for memory */}
            </Progress>
          </div>

          {/* Network Bandwidth Allocation */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm text-slate-400">Network Bandwidth</div>
              <div className="text-xs text-blue-400">35% allocated</div> {/* Network bandwidth allocated */}
            </div>
            <Progress value={35} className="h-2 bg-slate-700/50">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400" style={{ width: '35%' }} /> {/* Progress bar for network bandwidth */}
            </Progress>
          </div>

          {/* Priority Level Slider */}
          <div className="pt-2 border-t border-slate-700/50">
            <div className="flex items-center justify-between text-sm">
              <div className="text-slate-400">Priority Level</div>
              <div className="flex items-center gap-2">
                <Slider className="w-24" defaultValue={[4]} max={5} step={1} /> {/* Slider to adjust priority level */}
                <span className="text-cyan-400">{4}/5</span> {/* Displaying current priority level */}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}