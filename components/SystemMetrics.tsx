"use client" 

import { useEffect, useState } from "react"
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts" 
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "@/components/ui/card" 
import { Progress } from "@/components/ui/progress" 
import { Cpu, MemoryStick } from "lucide-react" 

interface MetricData {
  timestamp: string
  cpu: number
  memory: number
}

interface SystemMetrics {
  cpu: {
    usage: number
  }
  memory: {
    total: number
    used: number
    free: number
    usagePercentage: number
  }
}

export function SystemMetrics() {
  const [cpuUsage, setCpuUsage] = useState<number>(0)
  const [memoryUsage, setMemoryUsage] = useState<number>(0)
  const [memoryInfo, setMemoryInfo] = useState<{ total: number; used: number; free: number }>({
    total: 0,
    used: 0,
    free: 0,
  })
  const [chartData, setChartData] = useState<MetricData[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/metrics")
        if (!response.ok) {
          throw new Error("Failed to fetch metrics")
        }
        
        const data: SystemMetrics = await response.json()
        setCpuUsage(data.cpu.usage)
        setMemoryUsage(data.memory.usagePercentage)
        setMemoryInfo({
          total: data.memory.total,
          used: data.memory.used,
          free: data.memory.free,
        })

        const timestamp = new Date().toLocaleTimeString()
        setChartData((prev) => {
          const newData = [...prev, { 
            timestamp, 
            cpu: data.cpu.usage, 
            memory: data.memory.usagePercentage 
          }]
          if (newData.length > 20) newData.shift() 
          return newData
        })

        setError(null) 
      } catch (err) {
        console.error("Error fetching metrics:", err)
        setError("Failed to fetch system metrics") 
      }
    }

    fetchMetrics()

    const interval = setInterval(fetchMetrics, 2000)

    return () => clearInterval(interval) 
  }, [])
  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-cyan-400" />
                CPU Usage
              </div>
            </CardTitle>
            <span className="text-2xl font-bold text-cyan-400">{cpuUsage}%</span> 
          </CardHeader>
          <CardContent>
            <Progress value={cpuUsage} className="h-2" /> 
            <div className="mt-2 text-xs text-slate-400">
              System Load Average
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <MemoryStick className="h-4 w-4 text-purple-400" />
                Memory Usage
              </div>
            </CardTitle>
            <span className="text-2xl font-bold text-purple-400">{memoryUsage}%</span> 
          </CardHeader>
          <CardContent>
            <Progress value={memoryUsage} className="h-2" /> 
            <div className="mt-2 grid grid-cols-3 text-xs text-slate-400">
              <div>
                Total: {memoryInfo.total} GB
              </div>
              <div>
                Used: {memoryInfo.used} GB
              </div>
              <div>
                Free: {memoryInfo.free} GB
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Resource Usage History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" /> 
                <XAxis
                  dataKey="timestamp"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  domain={[0, 100]}
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
                  fillOpacity={1}
                  fill="url(#colorCpu)"
                  name="CPU"
                />
                <Area
                  type="monotone"
                  dataKey="memory"
                  stroke="#a855f7"
                  fill="url(#colorMemory)"
                  name="Memory"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}