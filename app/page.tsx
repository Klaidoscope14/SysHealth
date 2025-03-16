"use client"

import { PageContainer } from "@/components/page-container"
import { Activity, Cpu, HardDrive, MemoryStick } from "lucide-react"
import { PerformanceGraph } from "@/components/PerformanceGraph"
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { TopNav } from "@/components/TopNav"

export default function DashboardPage() {
  return (
    <>
      <TopNav />
      <PageContainer
        title="Dashboard"
        description="System overview and main metrics"
      >
        <div className="flex gap-6">
          <div className="flex-1">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="glass-card rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-cyan-400" />
                  <h3 className="text-sm font-medium text-cyan-50">CPU Usage</h3>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-cyan-50">32%</p>
                  <div className="mt-2 h-2 w-full rounded-full bg-cyan-950/50">
                    <div className="h-2 w-[32%] rounded-full bg-cyan-400" />
                  </div>
                </div>
              </div>
              <div className="glass-card rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <MemoryStick className="h-4 w-4 text-purple-400" />
                  <h3 className="text-sm font-medium text-purple-50">Memory Usage</h3>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-purple-50">5.2 GB</p>
                  <div className="mt-2 h-2 w-full rounded-full bg-purple-950/50">
                    <div className="h-2 w-[45%] rounded-full bg-purple-400" />
                  </div>
                </div>
              </div>
              <div className="glass-card rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-emerald-400" />
                  <h3 className="text-sm font-medium text-emerald-50">Storage</h3>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-emerald-50">234 GB</p>
                  <div className="mt-2 h-2 w-full rounded-full bg-emerald-950/50">
                    <div className="h-2 w-[78%] rounded-full bg-emerald-400" />
                  </div>
                </div>
              </div>
              <div className="glass-card rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-amber-400" />
                  <h3 className="text-sm font-medium text-amber-50">System Load</h3>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-amber-50">1.24</p>
                  <p className="mt-1 text-xs text-amber-200/70">Last 5 minutes</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <PerformanceGraph />
            </div>
            
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="glass-card rounded-lg p-4">
                <h3 className="text-sm font-medium text-cyan-50">Recent Activity</h3>
                <div className="mt-4 space-y-3">
                  {[
                    { time: "2m ago", event: "System backup completed" },
                    { time: "15m ago", event: "Software update available" },
                    { time: "1h ago", event: "Disk cleanup performed" },
                    { time: "3h ago", event: "Security scan completed" },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <p className="text-sm text-cyan-100">{activity.event}</p>
                      <span className="text-xs text-cyan-300/70">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass-card rounded-lg p-4">
                <h3 className="text-sm font-medium text-cyan-50">System Information</h3>
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-cyan-300/70">OS:</span>
                    <span className="text-sm font-medium text-cyan-100">macOS 24.1.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-cyan-300/70">Kernel:</span>
                    <span className="text-sm font-medium text-cyan-100">Darwin</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-cyan-300/70">Uptime:</span>
                    <span className="text-sm font-medium text-cyan-100">2d 4h 12m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-cyan-300/70">Last Boot:</span>
                    <span className="text-sm font-medium text-cyan-100">Mar 11, 2024 09:45 AM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-80 flex-shrink-0">
            <DashboardSidebar />
          </div>
        </div>
      </PageContainer>
    </>
  )
}