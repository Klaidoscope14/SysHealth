"use client" 

import { PageContainer } from "@/components/page-container" 
import { Activity, Cpu, HardDrive, MemoryStick } from "lucide-react" 
import { PerformanceGraph } from "@/components/PerformanceGraph" 
import { QuickActions } from "@/components/QuickActions" 
import React from "react"

export default function DashboardPage() {
  const [metrics, setMetrics] = React.useState<any>(null);
  const [uptime, setUptime] = React.useState<string>("Loading...");

  React.useEffect(() => {
    async function fetchUptime() {
      try {
        const response = await fetch("/api/metrics");
        if (!response.ok) throw new Error("Failed to fetch uptime");
        const data = await response.json();
        if (data.uptime) {
          setUptime(data.uptime);
        } else if (data.memory && data.memory.uptime) {
          setUptime(data.memory.uptime);
        } else {
          setUptime("Unavailable");
        }
      } catch {
        setUptime("Unavailable");
      }
    }
    fetchUptime();
  }, []);

  React.useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch("/api/metrics");
        if (!response.ok) throw new Error("Failed to fetch metrics");
        const data = await response.json();
        setMetrics(data);
      } catch {
        setMetrics(null);
      }
    }
    fetchMetrics();
  }, []);

  return (
    <>
      <PageContainer
        title="Dashboard" 
        description="System overview and main metrics" 
      >
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              
              <div className="glass-card rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-cyan-400" /> 
                  <h3 className="text-sm font-medium dark:text-cyan-50 text-cyan-700">CPU Usage</h3>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold dark:text-cyan-50 text-cyan-700">
                    {metrics && metrics.cpu ? `${metrics.cpu.usage}%` : "Unable to Fetch Data"}
                  </p>
                  <div className="mt-2 h-2 w-full rounded-full bg-cyan-950/50 dark:bg-cyan-950/50 bg-cyan-100">
                    <div className="h-2 w-[32%] rounded-full bg-cyan-400" /> 
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <MemoryStick className="h-4 w-4 text-purple-400" /> 
                  <h3 className="text-sm font-medium dark:text-purple-50 text-purple-700">Memory Usage</h3>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold dark:text-purple-50 text-purple-700">{metrics ? `${(metrics.memory.used / 1024).toFixed(1)} GB` : "Unable to Fetch Data"}</p> 
                  <div className="mt-2 h-2 w-full rounded-full bg-purple-950/50 dark:bg-purple-950/50 bg-purple-100">
                    <div className="h-2 w-[45%] rounded-full bg-purple-400" /> 
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-emerald-400" /> 
                  <h3 className="text-sm font-medium dark:text-emerald-50 text-emerald-700">Storage</h3>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold dark:text-emerald-50 text-emerald-700">234 GB</p> 
                  <div className="mt-2 h-2 w-full rounded-full bg-emerald-950/50 dark:bg-emerald-950/50 bg-emerald-100/50">
                    <div className="h-2 w-[78%] rounded-full bg-emerald-400" /> 
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-amber-400" /> 
                  <h3 className="text-sm font-medium dark:text-amber-50 text-amber-700">System Load</h3>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold dark:text-amber-50 text-amber-700">{metrics?.cpu?.loadAverage?.["5min"].toFixed(2) ?? "Unable to Fetch Data"}</p> 
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <PerformanceGraph /> 
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="glass-card rounded-lg p-4">
                <h3 className="text-sm font-medium dark:text-cyan-50 text-cyan-700">Recent Activity</h3>
                <div className="mt-4 space-y-3">
                  {[
                    { time: "2m ago", event: "System backup completed" },
                    { time: "15m ago", event: "Software update available" },
                    { time: "1h ago", event: "Disk cleanup performed" },
                    { time: "3h ago", event: "Security scan completed" },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <p className="text-sm dark:text-cyan-100 text-cyan-800">{activity.event}</p>
                      <span className="text-xs dark:text-cyan-300/70 text-cyan-600/80">{activity.time}</span> 
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-lg p-4">
                <h3 className="text-sm font-medium dark:text-cyan-50 text-cyan-700">System Information</h3>
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm dark:text-cyan-300/70 text-cyan-600/80">OS:</span>
                    <span className="text-sm font-medium dark:text-cyan-100 text-cyan-800">{metrics?.system?.os ?? "Unable to Fetch Data"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm dark:text-cyan-300/70 text-cyan-600/80">Kernel:</span>
                    <span className="text-sm font-medium dark:text-cyan-100 text-cyan-800">{metrics?.system?.kernel ?? "Unable to Fetch Data"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm dark:text-cyan-300/70 text-cyan-600/80">Uptime:</span>
                    <span className="text-sm font-medium dark:text-cyan-100 text-cyan-800">{metrics?.uptime ?? "Unable to Fetch Data"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm dark:text-cyan-300/70 text-cyan-600/80">Last Boot:</span>
                    <span className="text-sm font-medium dark:text-cyan-100 text-cyan-800">{metrics?.system?.lastBoot ?? "Unable to Fetch Data"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-80 flex-shrink-0 mt-6 lg:mt-0">
            <QuickActions /> 
          </div>
        </div>
      </PageContainer>
    </>
  )
}