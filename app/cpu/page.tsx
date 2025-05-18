"use client"

import { useEffect, useState } from "react"
import { PageContainer } from "@/components/page-container"
import { Card } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Define the shape of the metrics object that holds CPU and memory data.
interface Metrics {
  cpu: {
    usage: number
    cores: number
    clockSpeed: number
    loadAverage: {
      '1min': number
      '5min': number
      '15min': number
    }
  }
  memory: {
    total: number
    used: number
    free: number
    usagePercentage: number
  }
}

// Define the structure of the chart data that will be used to display CPU and memory usage over time.
interface ChartData {
  timestamp: string
  cpu: number
  memory: number
}

export default function CpuMemoryPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null) // Store CPU and memory metrics (initially null for loading state).
  const [chartData, setChartData] = useState<ChartData[]>([]) // Store the data points for the chart.

  // Fetch metrics every 5 seconds to update the system resource usage over time.
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/metrics") 
        if (!response.ok) throw new Error("Failed to fetch metrics") 
        const data = await response.json() 
        setMetrics(data) // Set the fetched metrics data.
        
        // Prepare the timestamp for when the data is recorded.
        const timestamp = new Date().toLocaleTimeString()

        // Update the chart data by adding a new data point.
        setChartData(prev => {
          const newData = [...prev, {
            timestamp,
            cpu: data.cpu.usage,
            memory: data.memory.usagePercentage
          }]
          
          // Keep only the last 20 data points to avoid the chart becoming too large.
          if (newData.length > 20) newData.shift() // Remove the oldest data point if the length exceeds 20.
          return newData
        })
      } catch (error) {
        console.error("Error fetching metrics:", error) // Log any errors that occur during the fetch.
      }
    }

    fetchMetrics() // Fetch metrics when the component first renders.
    const interval = setInterval(fetchMetrics, 5000) // Set an interval to fetch the metrics every 5 seconds.

    return () => clearInterval(interval) // Clear the interval when the component is unmounted to prevent memory leaks.
  }, [])

  // Display loading message while metrics data is not available.
  if (!metrics) {
    return <div>Loading...</div> // Display a loading state until metrics are fetched.
  }

  return (
    <PageContainer
      title="CPU & Memory"
      description="System resource monitoring"
      className="max-w-full w-full"
    >
      <div className="grid gap-6 w-full">
        {/* CPU Section */}
        <section>
          <h2 className="text-xl font-semibold dark:text-slate-200 text-slate-800 mb-4">CPU Performance</h2>
          <div className="grid gap-6 lg:grid-cols-3 w-full">
            {/* CPU Usage Chart */}
            <Card className="lg:col-span-2 dark:bg-slate-900/50 dark:border-slate-700/50 bg-white/60 border-slate-200/70 backdrop-blur-sm p-4 w-full transition-all duration-300">
              <h3 className="text-sm font-medium dark:text-slate-300 text-slate-700 mb-4">CPU Usage Over Time</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1"> 
                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 100]} 
                      ticks={[0, 25, 50, 75, 100]} 
                      tickFormatter={(value) => `${value}%`} 
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-slate-800/90 dark:bg-slate-800/90 bg-white/90 px-3 py-2 shadow-md rounded border border-slate-700/50 dark:border-slate-700/50 border-slate-200/50">
                              <p className="text-sm font-medium dark:text-slate-200 text-slate-700">
                                {payload[0].payload.timestamp}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="h-2 w-2 rounded-full bg-cyan-500" />
                                <p className="text-xs dark:text-cyan-400 text-cyan-600">
                                  CPU: {payload[0].value}%
                                </p>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="cpu"
                      stroke="#22d3ee"
                      fill="url(#colorCpu)"
                      strokeWidth={2}
                      name="CPU"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* CPU Stats */}
            <Card className="dark:bg-slate-900/50 dark:border-slate-700/50 bg-white/60 border-slate-200/70 backdrop-blur-sm p-4 w-full transition-all duration-300">
              <h3 className="text-sm font-medium dark:text-slate-300 text-slate-700 mb-4">CPU Details</h3>
              <div className="space-y-6">
                {/* Display current CPU usage with a progress bar */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm dark:text-slate-400 text-slate-600">Current Usage</span>
                    <span className="text-lg font-semibold dark:text-cyan-400 text-cyan-600">{metrics.cpu.usage}%</span>
                  </div>
                  <div className="h-2 dark:bg-slate-700/30 bg-slate-200/70 rounded-full">
                    <div
                      className="h-full bg-cyan-500 rounded-full transition-all duration-300"
                      style={{ width: `${metrics.cpu.usage}%` }}
                    />
                  </div>
                </div>

                {/* Display CPU details such as cores and clock speed */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="dark:bg-slate-800/30 bg-slate-100/50 p-3 rounded-lg hover:dark:bg-slate-700/40 hover:bg-slate-200/70 transition-all duration-200">
                    <div className="text-xs dark:text-slate-400 text-slate-600 mb-1">Cores</div>
                    <div className="text-sm dark:text-cyan-400 text-cyan-600">{metrics.cpu.cores} Cores</div>
                  </div>
                  <div className="dark:bg-slate-800/30 bg-slate-100/50 p-3 rounded-lg hover:dark:bg-slate-700/40 hover:bg-slate-200/70 transition-all duration-200">
                    <div className="text-xs dark:text-slate-400 text-slate-600 mb-1">Clock Speed</div>
                    <div className="text-sm dark:text-cyan-400 text-cyan-600">{metrics.cpu.clockSpeed.toFixed(2)} GHz</div>
                  </div>
                </div>

                {/* Display CPU load averages for 1, 5, and 15 minutes */}
                <div>
                  <div className="text-xs dark:text-slate-400 text-slate-600 mb-2">Load Average</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="dark:bg-slate-800/50 bg-slate-100/70 rounded p-2 hover:dark:bg-slate-700/60 hover:bg-slate-200/80 transition-all duration-200">
                      <div className="text-xs dark:text-slate-400 text-slate-600">1 min</div>
                      <div className="text-sm dark:text-cyan-400 text-cyan-600">{metrics.cpu.loadAverage['1min'].toFixed(2)}</div>
                    </div>
                    <div className="dark:bg-slate-800/50 bg-slate-100/70 rounded p-2 hover:dark:bg-slate-700/60 hover:bg-slate-200/80 transition-all duration-200">
                      <div className="text-xs dark:text-slate-400 text-slate-600">5 min</div>
                      <div className="text-sm dark:text-cyan-400 text-cyan-600">{metrics.cpu.loadAverage['5min'].toFixed(2)}</div>
                    </div>
                    <div className="dark:bg-slate-800/50 bg-slate-100/70 rounded p-2 hover:dark:bg-slate-700/60 hover:bg-slate-200/80 transition-all duration-200">
                      <div className="text-xs dark:text-slate-400 text-slate-600">15 min</div>
                      <div className="text-sm dark:text-cyan-400 text-cyan-600">{metrics.cpu.loadAverage['15min'].toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Memory Section */}
        <section>
          <h2 className="text-xl font-semibold dark:text-slate-200 text-slate-800 mb-4">Memory Usage</h2>
          <div className="grid gap-6 lg:grid-cols-3 w-full">
            {/* Memory Usage Chart */}
            <Card className="lg:col-span-2 dark:bg-slate-900/50 dark:border-slate-700/50 bg-white/60 border-slate-200/70 backdrop-blur-sm p-4 w-full transition-all duration-300">
              <h3 className="text-sm font-medium dark:text-slate-300 text-slate-700 mb-4">Memory Usage Over Time</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 100]}
                      ticks={[0, 25, 50, 75, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-slate-800/90 dark:bg-slate-800/90 bg-white/90 px-3 py-2 shadow-md rounded border border-slate-700/50 dark:border-slate-700/50 border-slate-200/50">
                              <p className="text-sm font-medium dark:text-slate-200 text-slate-700">
                                {payload[0].payload.timestamp}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="h-2 w-2 rounded-full bg-purple-500" />
                                <p className="text-xs dark:text-purple-400 text-purple-600">
                                  Memory: {payload[0].value}%
                                </p>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="memory"
                      stroke="#a855f7"
                      fill="url(#colorMemory)"
                      strokeWidth={2}
                      name="Memory"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Memory Stats */}
            <Card className="dark:bg-slate-900/50 dark:border-slate-700/50 bg-white/60 border-slate-200/70 backdrop-blur-sm p-4 w-full transition-all duration-300">
              <h3 className="text-sm font-medium dark:text-slate-300 text-slate-700 mb-4">Memory Details</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm dark:text-slate-400 text-slate-600">Memory Usage</span>
                    <span className="text-lg font-semibold dark:text-purple-400 text-purple-600">{metrics.memory.usagePercentage}%</span>
                  </div>
                  <div className="h-2 dark:bg-slate-700/30 bg-slate-200/70 rounded-full">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all duration-300"
                      style={{ width: `${metrics.memory.usagePercentage}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="dark:bg-slate-800/30 bg-slate-100/50 p-3 rounded-lg hover:dark:bg-slate-700/40 hover:bg-slate-200/70 transition-all duration-200">
                    <div className="text-xs dark:text-slate-400 text-slate-600 mb-1">Total Memory</div>
                    <div className="text-sm dark:text-purple-400 text-purple-600">{(metrics.memory.total / 1024).toFixed(1)} GB</div>
                  </div>
                  <div className="dark:bg-slate-800/30 bg-slate-100/50 p-3 rounded-lg hover:dark:bg-slate-700/40 hover:bg-slate-200/70 transition-all duration-200">
                    <div className="text-xs dark:text-slate-400 text-slate-600 mb-1">Used Memory</div>
                    <div className="text-sm dark:text-purple-400 text-purple-600">{(metrics.memory.used / 1024).toFixed(1)} GB</div>
                  </div>
                  <div className="dark:bg-slate-800/30 bg-slate-100/50 p-3 rounded-lg hover:dark:bg-slate-700/40 hover:bg-slate-200/70 transition-all duration-200">
                    <div className="text-xs dark:text-slate-400 text-slate-600 mb-1">Free Memory</div>
                    <div className="text-sm dark:text-purple-400 text-purple-600">{(metrics.memory.free / 1024).toFixed(1)} GB</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </PageContainer>
  )
}