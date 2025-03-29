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
        const response = await fetch("/api/metrics") // Fetch metrics from the API endpoint.
        if (!response.ok) throw new Error("Failed to fetch metrics") // Handle error if API call fails.
        const data = await response.json() // Parse the response into JSON.
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
    >
      <div className="grid gap-6">
        {/* CPU Section */}
        <section>
          <h2 className="text-xl font-semibold text-slate-200 mb-4">CPU Performance</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* CPU Usage Chart */}
            <Card className="lg:col-span-2 bg-slate-900/50 border-slate-700/50 backdrop-blur-sm p-4">
              <h3 className="text-sm font-medium text-slate-300 mb-4">CPU Usage Over Time</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}> {/* Chart component to display data */}
                    <defs>
                      <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1"> {/* Gradient for CPU usage area */}
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
                      domain={[0, 100]} // Set the Y-axis range for percentage (0% to 100%).
                      ticks={[0, 25, 50, 75, 100]} // Define tick marks for the Y-axis.
                      tickFormatter={(value) => `${value}%`} // Format the Y-axis ticks as percentages.
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(15, 23, 42, 0.9)",
                        border: "1px solid rgba(148, 163, 184, 0.2)",
                        borderRadius: "6px",
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
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm p-4">
              <h3 className="text-sm font-medium text-slate-300 mb-4">CPU Details</h3>
              <div className="space-y-6">
                {/* Display current CPU usage with a progress bar */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-400">Current Usage</span>
                    <span className="text-lg font-semibold text-cyan-400">{metrics.cpu.usage}%</span>
                  </div>
                  <div className="h-2 bg-slate-700/30 rounded-full">
                    <div
                      className="h-full bg-cyan-500 rounded-full"
                      style={{ width: `${metrics.cpu.usage}%` }}
                    />
                  </div>
                </div>

                {/* Display CPU details such as cores and clock speed */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Cores</div>
                    <div className="text-sm text-cyan-400">{metrics.cpu.cores} Cores</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Clock Speed</div>
                    <div className="text-sm text-cyan-400">{metrics.cpu.clockSpeed.toFixed(2)} GHz</div>
                  </div>
                </div>

                {/* Display CPU load averages for 1, 5, and 15 minutes */}
                <div>
                  <div className="text-xs text-slate-400 mb-2">Load Average</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-slate-800/50 rounded p-2">
                      <div className="text-xs text-slate-400">1 min</div>
                      <div className="text-sm text-cyan-400">{metrics.cpu.loadAverage['1min'].toFixed(2)}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded p-2">
                      <div className="text-xs text-slate-400">5 min</div>
                      <div className="text-sm text-cyan-400">{metrics.cpu.loadAverage['5min'].toFixed(2)}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded p-2">
                      <div className="text-xs text-slate-400">15 min</div>
                      <div className="text-sm text-cyan-400">{metrics.cpu.loadAverage['15min'].toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Memory Section */}
        <section>
          <h2 className="text-xl font-semibold text-slate-200 mb-4">Memory Usage</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Memory Usage Chart */}
            <Card className="lg:col-span-2 bg-slate-900/50 border-slate-700/50 backdrop-blur-sm p-4">
              <h3 className="text-sm font-medium text-slate-300 mb-4">Memory Usage Over Time</h3>
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
                      domain={[0, 100]} // Set the Y-axis range for memory usage percentage (0% to 100%).
                      ticks={[0, 25, 50, 75, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(15, 23, 42, 0.9)",
                        border: "1px solid rgba(148, 163, 184, 0.2)",
                        borderRadius: "6px",
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
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm p-4">
              <h3 className="text-sm font-medium text-slate-300 mb-4">Memory Details</h3>
              <div className="space-y-6">
                {/* Display current memory usage with a progress bar */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-400">Memory Usage</span>
                    <span className="text-lg font-semibold text-purple-400">{metrics.memory.usagePercentage}%</span>
                  </div>
                  <div className="h-2 bg-slate-700/30 rounded-full">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${metrics.memory.usagePercentage}%` }}
                    />
                  </div>
                </div>

                {/* Display memory statistics (total, used, and free memory) */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Total Memory</div>
                    <div className="text-sm text-purple-400">{(metrics.memory.total / 1024).toFixed(1)} GB</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Used Memory</div>
                    <div className="text-sm text-purple-400">{(metrics.memory.used / 1024).toFixed(1)} GB</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Free Memory</div>
                    <div className="text-sm text-purple-400">{(metrics.memory.free / 1024).toFixed(1)} GB</div>
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