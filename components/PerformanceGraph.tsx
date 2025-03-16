"use client"

import { useEffect, useState } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MetricData {
  timestamp: string
  cpu: number
  memory: number
  network: number
}

interface ProcessData {
  pid: string;
  name: string;
  cpu: number;
  memory: number;
  status: string;
}

interface StorageData {
  name: string;
  total: string;
  used: string;
  available: string;
  usagePercentage: number;
  type: string;
}

interface DetailedMetrics {
  cpu: {
    usage: number;
    cores: number;
    temperature: number;
    clockSpeed: number;
    loadAverage: {
      '1min': number;
      '5min': number;
      '15min': number;
    };
  };
  memory: {
    total: number;
    used: number;
    free: number;
    cached: number;
    buffers: number;
    usagePercentage: number;
    swapUsed: number;
    swapTotal: number;
  };
}

export function PerformanceGraph() {
  const [chartData, setChartData] = useState<MetricData[]>([])
  const [systemLoad, setSystemLoad] = useState(0)
  const [processes, setProcesses] = useState<ProcessData[]>([])
  const [processError, setProcessError] = useState<string | null>(null)
  const [storageData, setStorageData] = useState<StorageData[]>([])
  const [storageError, setStorageError] = useState<string | null>(null)
  const [detailedMetrics, setDetailedMetrics] = useState<DetailedMetrics>({
    cpu: {
      usage: 0,
      cores: 0,
      temperature: 0,
      clockSpeed: 0,
      loadAverage: { '1min': 0, '5min': 0, '15min': 0 }
    },
    memory: {
      total: 0,
      used: 0,
      free: 0,
      cached: 0,
      buffers: 0,
      usagePercentage: 0,
      swapUsed: 0,
      swapTotal: 0
    }
  })

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/metrics")
        if (!response.ok) throw new Error("Failed to fetch metrics")
        const data = await response.json()
        
        const timestamp = new Date().toLocaleTimeString()
        setSystemLoad(data.cpu.usage)
        setDetailedMetrics(data)
        
        setChartData((prev) => {
          const newData = [...prev, {
            timestamp,
            cpu: data.cpu.usage,
            memory: data.memory.usagePercentage,
            network: Math.random() * 30 + 20
          }]
          if (newData.length > 20) newData.shift()
          return newData
        })
      } catch (error) {
        console.error("Error fetching metrics:", error)
      }
    }

    const fetchProcesses = async () => {
      try {
        const response = await fetch("/api/processes")
        if (!response.ok) throw new Error("Failed to fetch processes")
        const data = await response.json()
        setProcesses(data.processes)
        setProcessError(null)
      } catch (error) {
        console.error("Error fetching processes:", error)
        setProcessError("Failed to fetch process list")
      }
    }

    const fetchStorage = async () => {
      try {
        const response = await fetch("/api/storage")
        if (!response.ok) throw new Error("Failed to fetch storage info")
        const data = await response.json()
        setStorageData(data.drives)
        setStorageError(null)
      } catch (error) {
        console.error("Error fetching storage info:", error)
        setStorageError("Failed to fetch storage information")
      }
    }

    // Initial fetch
    fetchMetrics()
    fetchProcesses()
    fetchStorage()

    // Set up intervals for real-time updates
    const metricsInterval = setInterval(fetchMetrics, 5000)
    const processesInterval = setInterval(fetchProcesses, 5000)
    const storageInterval = setInterval(fetchStorage, 300000) // Update storage every 5 minutes

    return () => {
      clearInterval(metricsInterval)
      clearInterval(processesInterval)
      clearInterval(storageInterval)
    }
  }, [])

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
      <CardHeader className="border-b border-slate-700/50 pb-3">
        <Tabs defaultValue="performance" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-slate-800/50 p-1">
              <TabsTrigger
                value="performance"
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
              >
                Performance
              </TabsTrigger>
              <TabsTrigger
                value="processes"
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
              >
                Processes
              </TabsTrigger>
              <TabsTrigger
                value="storage"
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
              >
                Storage
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-cyan-500 mr-1"></div>
                CPU
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-purple-500 mr-1"></div>
                Memory
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-blue-500 mr-1"></div>
                Network
              </div>
            </div>
          </div>

          <TabsContent value="performance" className="mt-0">
            <div className="grid grid-cols-4 gap-4">
              {/* Main graph area - 3 columns */}
              <div className="col-span-3">
                <div className="relative">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorNetwork" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        
                        {/* Grid lines */}
                        <CartesianGrid 
                          strokeDasharray="3 3" 
                          stroke="#334155" 
                          vertical={false}
                        />
                        
                        {/* Y-axis */}
                        <YAxis
                          stroke="#94a3b8"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          domain={[0, 100]}
                          ticks={[0, 25, 50, 75, 100]}
                          tickFormatter={(value) => `${value}%`}
                        />
                        
                        {/* X-axis */}
                        <XAxis
                          dataKey="timestamp"
                          stroke="#94a3b8"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
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
                        <Area
                          type="monotone"
                          dataKey="memory"
                          stroke="#a855f7"
                          fill="url(#colorMemory)"
                          strokeWidth={2}
                          name="Memory"
                        />
                        <Area
                          type="monotone"
                          dataKey="network"
                          stroke="#3b82f6"
                          fill="url(#colorNetwork)"
                          strokeWidth={2}
                          name="Network"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* System Load Overlay */}
                  <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-sm rounded-md px-3 py-2 border border-slate-700/50">
                    <div className="text-xs text-slate-400">System Load</div>
                    <div className="text-lg font-mono text-cyan-400">{systemLoad}%</div>
                  </div>
                </div>
              </div>

              {/* Right side quick stats - 1 column */}
              <div className="col-span-1">
                <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                  <h3 className="text-sm font-medium text-slate-300 mb-3">Quick Stats</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-slate-400 mb-1">CPU Utilization</div>
                      <div className="flex items-center">
                        <div className="flex-grow h-1.5 bg-slate-700/30 rounded-full mr-2">
                          <div
                            className="h-full bg-cyan-500 rounded-full"
                            style={{ width: `${detailedMetrics.cpu.usage}%` }}
                          />
                        </div>
                        <span className="text-xs text-cyan-400">{detailedMetrics.cpu.usage}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Memory Usage</div>
                      <div className="flex items-center">
                        <div className="flex-grow h-1.5 bg-slate-700/30 rounded-full mr-2">
                          <div
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${detailedMetrics.memory.usagePercentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-purple-400">{detailedMetrics.memory.usagePercentage}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="processes" className="mt-0">
            <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden">
              <div className="grid grid-cols-12 gap-4 text-xs text-slate-400 p-4 border-b border-slate-700/50 bg-slate-800/50">
                <div className="col-span-2">PID</div>
                <div className="col-span-4">Process</div>
                <div className="col-span-2">CPU %</div>
                <div className="col-span-2">Memory %</div>
                <div className="col-span-2">Status</div>
              </div>

              <div className="divide-y divide-slate-700/30">
                {processError ? (
                  <div className="p-4 text-red-400 text-sm">{processError}</div>
                ) : processes.length === 0 ? (
                  <div className="p-4 text-slate-400 text-sm">Loading processes...</div>
                ) : (
                  processes.map((process) => (
                    <div key={process.pid} className="grid grid-cols-12 gap-4 py-3 px-4 text-sm hover:bg-slate-800/50">
                      <div className="col-span-2 text-slate-500">{process.pid}</div>
                      <div className="col-span-4 text-slate-300 truncate" title={process.name}>{process.name}</div>
                      <div className="col-span-2 text-cyan-400">{process.cpu.toFixed(1)}%</div>
                      <div className="col-span-2 text-purple-400">{process.memory.toFixed(1)}%</div>
                      <div className="col-span-2">
                        <span className="px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-400 border border-green-500/30">
                          {process.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="storage" className="mt-0">
            <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden">
              <div className="grid grid-cols-12 gap-6 text-xs text-slate-400 p-4 border-b border-slate-700/50 bg-slate-800/50">
                <div className="col-span-3">Drive</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Total</div>
                <div className="col-span-2">Used</div>
                <div className="col-span-2">Available</div>
                <div className="col-span-1 text-center">Usage</div>
              </div>

              <div className="divide-y divide-slate-700/30">
                {storageError ? (
                  <div className="p-4 text-red-400 text-sm">{storageError}</div>
                ) : storageData.length === 0 ? (
                  <div className="p-4 text-slate-400 text-sm">Loading storage information...</div>
                ) : (
                  storageData.map((drive, index) => (
                    <div key={index} className="grid grid-cols-12 gap-6 py-4 px-4 text-sm hover:bg-slate-800/50">
                      <div className="col-span-3 text-slate-300">{drive.name}</div>
                      <div className="col-span-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          drive.type === 'SSD' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        } border`}>
                          {drive.type}
                        </span>
                      </div>
                      <div className="col-span-2 text-slate-300 tabular-nums">{drive.total}</div>
                      <div className="col-span-2 text-purple-400 tabular-nums">{drive.used}</div>
                      <div className="col-span-2 text-cyan-400 tabular-nums">{drive.available}</div>
                      <div className="col-span-1">
                        <div className="w-full bg-slate-700/30 rounded-full h-2.5">
                          <div
                            className={`h-full rounded-full ${
                              drive.usagePercentage > 90 
                                ? 'bg-red-500' 
                                : drive.usagePercentage > 75 
                                ? 'bg-amber-500' 
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${drive.usagePercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardHeader>
    </Card>
  )
} 