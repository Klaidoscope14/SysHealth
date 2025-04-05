"use client" 
// This directive ensures that this component is a Client Component in Next.js, meaning it can use state, effects, and other client-side features.

import { useState, useEffect } from "react"
import { PageContainer } from "@/components/page-container" 
import { Card } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Activity, Cpu, Clock, AlertCircle } from "lucide-react"

interface Process {
  pid: string;
  name: string;
  cpu: number;
  memory: number;
  status: string;
}

interface ResourceData {
  timestamp: string;
  cpu: number;
  memory: number;
}

// Create a test data generator for development
const generateTestData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 10; i > 0; i--) {
    const timePoint = new Date(now);
    timePoint.setMinutes(now.getMinutes() - i);
    
    data.push({
      timestamp: timePoint.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      cpu: Math.floor(Math.random() * 50) + 10,
      memory: Math.floor(Math.random() * 40) + 30
    });
  }
  
  return data;
};

export default function ActivityPage() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [resourceData, setResourceData] = useState<ResourceData[]>(generateTestData());
  const [isLoadingProcesses, setIsLoadingProcesses] = useState(true);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);
  const [resourceError, setResourceError] = useState<string | null>(null);

  useEffect(() => {
    // Function to fetch processes
    const fetchProcesses = async () => {
      try {
        const response = await fetch("/api/processes");
        if (!response.ok) throw new Error("Failed to fetch processes");
        const data = await response.json();
        setProcesses(data.processes);
        setProcessError(null);
      } catch (error) {
        console.error("Error fetching processes:", error);
        setProcessError("Failed to fetch process data");
      } finally {
        setIsLoadingProcesses(false);
      }
    };

    // Function to update resource data
    const updateResourceData = async () => {
      try {
        const response = await fetch("/api/metrics");
        if (!response.ok) throw new Error("Failed to fetch metrics");
        const data = await response.json();
        
        console.log("Metrics API response:", data);
        
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setIsLoadingResources(false);
        
        setResourceData(prev => {
          const newData = [...prev, {
            timestamp,
            cpu: data.cpu.usage,
            memory: data.memory.usagePercentage
          }];
          
          console.log("Updated chart data:", newData);
          
          if (newData.length > 20) newData.shift();
          return newData;
        });
      } catch (error) {
        console.error("Error fetching metrics:", error);
        setResourceError("Failed to fetch resource data");
      }
    };

    // Initial fetches
    fetchProcesses();
    updateResourceData();

    // Set up intervals
    const processInterval = setInterval(fetchProcesses, 10000); // Every 10 seconds
    const resourceInterval = setInterval(updateResourceData, 5000); // Every 5 seconds

    // Cleanup
    return () => {
      clearInterval(processInterval);
      clearInterval(resourceInterval);
    };
  }, []);

  return (
    <PageContainer
      title="Activity Monitor"
      description="System activity and resource utilization"
      className="max-w-full w-full"
    >
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 w-full">
        {/* Active Processes Card */}
        <Card className="dark:bg-slate-900/50 dark:border-slate-700/50 bg-white/60 border-slate-200/70 backdrop-blur-sm p-4 h-[500px] w-full transition-all duration-300">
          <h2 className="text-lg font-medium dark:text-slate-200 text-slate-800 mb-4">Active Processes</h2>
          
          {isLoadingProcesses ? (
            <div className="flex justify-center items-center h-[420px]">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 dark:border-cyan-500 border-cyan-600"></div>
            </div>
          ) : processError ? (
            <div className="text-center h-[420px] flex flex-col justify-center items-center">
              <div className="text-2xl dark:text-red-400 text-red-500 mb-2">
                <AlertCircle />
              </div>
              <p className="dark:text-slate-300 text-slate-700">{processError}</p>
            </div>
          ) : (
            <div className="overflow-auto h-[420px]">
              <table className="w-full">
                <thead className="sticky top-0 dark:bg-slate-900/90 bg-white/90 backdrop-blur-sm z-10">
                  <tr className="border-b dark:border-slate-700 border-slate-200">
                    <th className="px-2 py-3 text-left text-xs font-medium dark:text-slate-400 text-slate-500 uppercase tracking-wider">PID</th>
                    <th className="px-2 py-3 text-left text-xs font-medium dark:text-slate-400 text-slate-500 uppercase tracking-wider">Process</th>
                    <th className="px-2 py-3 text-left text-xs font-medium dark:text-slate-400 text-slate-500 uppercase tracking-wider">CPU</th>
                    <th className="px-2 py-3 text-left text-xs font-medium dark:text-slate-400 text-slate-500 uppercase tracking-wider">Memory</th>
                    <th className="px-2 py-3 text-left text-xs font-medium dark:text-slate-400 text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {processes.map((process, index) => (
                    <tr 
                      key={`${process.pid}-${index}`} 
                      className={`
                        ${index % 2 === 0 ? 'dark:bg-slate-800/30 bg-slate-50/50' : ''} 
                        hover:dark:bg-slate-700/40 hover:bg-slate-100/70 transition-colors duration-200 cursor-pointer
                      `}
                    >
                      <td className="px-2 py-3 text-sm dark:text-slate-300 text-slate-700">{process.pid}</td>
                      <td className="px-2 py-3 text-sm dark:text-slate-300 text-slate-700">{process.name}</td>
                      <td className="px-2 py-3 text-sm">
                        <span 
                          className={`${
                            process.cpu > 50 
                              ? 'dark:text-red-400 text-red-600' 
                              : process.cpu > 20 
                                ? 'dark:text-amber-400 text-amber-600' 
                                : 'dark:text-cyan-400 text-cyan-600'
                          }`}
                        >
                          {process.cpu.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-2 py-3 text-sm dark:text-purple-400 text-purple-600">{process.memory.toFixed(1)}%</td>
                      <td className="px-2 py-3 text-sm">
                        <span 
                          className={`px-2 py-1 text-xs rounded-full ${
                            process.status === 'R' 
                              ? 'dark:bg-green-900/30 bg-green-100 dark:text-green-400 text-green-700' 
                              : 'dark:bg-slate-700/30 bg-slate-200 dark:text-slate-400 text-slate-600'
                          }`}
                        >
                          {process.status === 'R' ? 'Running' : 
                           process.status === 'S' ? 'Sleeping' : 
                           process.status === 'T' ? 'Stopped' : 
                           process.status === 'Z' ? 'Zombie' : 
                           process.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Resource Usage Timeline Card */}
        <Card className="dark:bg-slate-900/50 dark:border-slate-700/50 bg-white/60 border-slate-200/70 backdrop-blur-sm p-4 h-[500px] w-full transition-all duration-300">
          <h2 className="text-lg font-medium dark:text-slate-200 text-slate-800 mb-4">Resource Usage Timeline</h2>
          
          {isLoadingResources ? (
            <div className="flex justify-center items-center h-[420px]">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 dark:border-cyan-500 border-cyan-600"></div>
            </div>
          ) : resourceError ? (
            <div className="text-center h-[420px] flex flex-col justify-center items-center">
              <div className="text-2xl dark:text-red-400 text-red-500 mb-2">
                <AlertCircle />
              </div>
              <p className="dark:text-slate-300 text-slate-700">{resourceError}</p>
            </div>
          ) : (
            <>
              <div className="h-[420px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={resourceData}>
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
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis 
                      dataKey="timestamp" 
                      stroke="#94a3b8" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                    />
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
                            <div className="dark:bg-slate-800/90 bg-white/90 px-3 py-2 shadow-md rounded border dark:border-slate-700/50 border-slate-200/50">
                              <p className="text-sm font-medium dark:text-slate-200 text-slate-700">
                                {payload[0].payload.timestamp}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="h-2 w-2 rounded-full bg-cyan-500" />
                                <p className="text-xs dark:text-cyan-400 text-cyan-600">
                                  CPU: {payload[0].value}%
                                </p>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="h-2 w-2 rounded-full bg-purple-500" />
                                <p className="text-xs dark:text-purple-400 text-purple-600">
                                  Memory: {payload[1].value}%
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
                      strokeWidth={2}
                      fill="url(#colorCpu)"
                      name="CPU"
                    />
                    <Area
                      type="monotone"
                      dataKey="memory"
                      stroke="#a855f7"
                      strokeWidth={2}
                      fill="url(#colorMemory)"
                      name="Memory"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex items-center justify-end space-x-6 mt-3 border-t dark:border-slate-700/50 border-slate-200/70 pt-2">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-cyan-500 mr-2"></div>
                  <span className="text-xs dark:text-slate-300 text-slate-700">CPU: {resourceData[resourceData.length - 1]?.cpu.toFixed(1)}%</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-purple-500 mr-2"></div>
                  <span className="text-xs dark:text-slate-300 text-slate-700">Memory: {resourceData[resourceData.length - 1]?.memory.toFixed(1)}%</span>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </PageContainer>
  )
}