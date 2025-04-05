"use client" // Indicates that this component is client-side in a Next.js app.

import { PageContainer } from "@/components/page-container" // Importing the PageContainer component to wrap the page content.
import { Activity, Cpu, HardDrive, MemoryStick } from "lucide-react" // Importing icons from the Lucide icon set to represent system components.
import { PerformanceGraph } from "@/components/PerformanceGraph" // Importing the PerformanceGraph component for displaying system performance.
import { QuickActions } from "@/components/QuickActions" // Importing the QuickActions component for sidebar navigation.

export default function DashboardPage() {
  return (
    <>
      <PageContainer
        title="Dashboard" // Setting the page title as "Dashboard".
        description="System overview and main metrics" // Description for the page, providing context about the dashboard.
      >
        {/* Main content container */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            {/* First section of the dashboard with system overview cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              
              {/* CPU Usage Card */}
              <div className="glass-card rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-cyan-400" /> {/* CPU icon */}
                  <h3 className="text-sm font-medium dark:text-cyan-50 text-cyan-700">CPU Usage</h3>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold dark:text-cyan-50 text-cyan-700">32%</p> {/* CPU usage percentage */}
                  <div className="mt-2 h-2 w-full rounded-full bg-cyan-950/50 dark:bg-cyan-950/50 bg-cyan-100/50">
                    <div className="h-2 w-[32%] rounded-full bg-cyan-400" /> {/* Progress bar for CPU usage */}
                  </div>
                </div>
              </div>

              {/* Memory Usage Card */}
              <div className="glass-card rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <MemoryStick className="h-4 w-4 text-purple-400" /> {/* Memory icon */}
                  <h3 className="text-sm font-medium dark:text-purple-50 text-purple-700">Memory Usage</h3>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold dark:text-purple-50 text-purple-700">5.2 GB</p> {/* Memory usage in GB */}
                  <div className="mt-2 h-2 w-full rounded-full bg-purple-950/50 dark:bg-purple-950/50 bg-purple-100/50">
                    <div className="h-2 w-[45%] rounded-full bg-purple-400" /> {/* Progress bar for memory usage */}
                  </div>
                </div>
              </div>

              {/* Storage Card */}
              <div className="glass-card rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-emerald-400" /> {/* Storage icon */}
                  <h3 className="text-sm font-medium dark:text-emerald-50 text-emerald-700">Storage</h3>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold dark:text-emerald-50 text-emerald-700">234 GB</p> {/* Storage used in GB */}
                  <div className="mt-2 h-2 w-full rounded-full bg-emerald-950/50 dark:bg-emerald-950/50 bg-emerald-100/50">
                    <div className="h-2 w-[78%] rounded-full bg-emerald-400" /> {/* Progress bar for storage usage */}
                  </div>
                </div>
              </div>

              {/* System Load Card */}
              <div className="glass-card rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-amber-400" /> {/* System load icon */}
                  <h3 className="text-sm font-medium dark:text-amber-50 text-amber-700">System Load</h3>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold dark:text-amber-50 text-amber-700">1.24</p> {/* System load value */}
                  <p className="mt-1 text-xs dark:text-amber-200/70 text-amber-600">Last 5 minutes</p> {/* Time range for the system load value */}
                </div>
              </div>
            </div>
            
            {/* Performance Graph */}
            <div className="mt-6">
              <PerformanceGraph /> {/* Rendering the PerformanceGraph component to display system performance metrics over time */}
            </div>

            {/* Recent Activity and System Information Cards */}
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {/* Recent Activity Card */}
              <div className="glass-card rounded-lg p-4">
                <h3 className="text-sm font-medium dark:text-cyan-50 text-cyan-700">Recent Activity</h3>
                <div className="mt-4 space-y-3">
                  {/* Mapping recent activities to display in the card */}
                  {[
                    { time: "2m ago", event: "System backup completed" },
                    { time: "15m ago", event: "Software update available" },
                    { time: "1h ago", event: "Disk cleanup performed" },
                    { time: "3h ago", event: "Security scan completed" },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <p className="text-sm dark:text-cyan-100 text-cyan-800">{activity.event}</p> {/* Event description */}
                      <span className="text-xs dark:text-cyan-300/70 text-cyan-600/80">{activity.time}</span> {/* Time of the event */}
                    </div>
                  ))}
                </div>
              </div>

              {/* System Information Card */}
              <div className="glass-card rounded-lg p-4">
                <h3 className="text-sm font-medium dark:text-cyan-50 text-cyan-700">System Information</h3>
                <div className="mt-4 space-y-3">
                  {/* System information displayed in key-value pairs */}
                  <div className="flex justify-between">
                    <span className="text-sm dark:text-cyan-300/70 text-cyan-600/80">OS:</span>
                    <span className="text-sm font-medium dark:text-cyan-100 text-cyan-800">macOS 24.1.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm dark:text-cyan-300/70 text-cyan-600/80">Kernel:</span>
                    <span className="text-sm font-medium dark:text-cyan-100 text-cyan-800">Darwin</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm dark:text-cyan-300/70 text-cyan-600/80">Uptime:</span>
                    <span className="text-sm font-medium dark:text-cyan-100 text-cyan-800">2d 4h 12m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm dark:text-cyan-300/70 text-cyan-600/80">Last Boot:</span>
                    <span className="text-sm font-medium dark:text-cyan-100 text-cyan-800">Mar 11, 2024 09:45 AM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar Section - Responsive */}
          <div className="w-full lg:w-80 flex-shrink-0 mt-6 lg:mt-0">
            <QuickActions /> {/* Rendering the QuickActions component for additional navigation options */}
          </div>
        </div>
      </PageContainer>
    </>
  )
}