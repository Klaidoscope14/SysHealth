"use client"

import { useState, useEffect } from "react"
import { PageContainer } from "@/components/page-container"
import { Card } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, XAxis, YAxis, CartesianGrid, LineChart, Line } from "recharts"
import { HardDrive, Database, ArrowDownUp, AlertCircle, Layers } from "lucide-react"

interface DiskInfo {
  name: string;
  total: string;
  used: string;
  available: string;
  usagePercentage: number;
  type: string;
}

interface IOActivityData {
  time: string;
  reads: number;
  writes: number;
}

export default function StoragePage() {
  // State for disk information
  const [disks, setDisks] = useState<DiskInfo[]>([]);
  const [isLoadingDisks, setIsLoadingDisks] = useState(true);
  const [diskError, setDiskError] = useState<string | null>(null);
  
  // State for I/O activity
  const [ioActivity, setIOActivity] = useState<IOActivityData[]>([]);
  
  // Colors for the pie chart
  const COLORS = ['#22d3ee', '#a855f7', '#3b82f6', '#10b981', '#f97316', '#ef4444'];
  
  // Generate mock I/O activity data
  const generateIOData = () => {
    const data = [];
    const now = new Date();
    
    for (let i = 10; i > 0; i--) {
      const timePoint = new Date(now);
      timePoint.setMinutes(now.getMinutes() - i);
      
      data.push({
        time: timePoint.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reads: Math.floor(Math.random() * 50) + 10,
        writes: Math.floor(Math.random() * 30) + 5
      });
    }
    
    return data;
  };

  // Fetch disk information
  useEffect(() => {
    const fetchDiskInfo = async () => {
      try {
        const response = await fetch("/api/storage");
        if (!response.ok) throw new Error("Failed to fetch storage data");
        const data = await response.json();
        setDisks(data.drives);
        setDiskError(null);
      } catch (error) {
        console.error("Error fetching disk info:", error);
        setDiskError("Failed to fetch storage information");
      } finally {
        setIsLoadingDisks(false);
      }
    };

    // Initial fetch
    fetchDiskInfo();
    setIOActivity(generateIOData());
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDiskInfo, 30000);
    
    // IO Activity simulation update every 5 seconds
    const ioInterval = setInterval(() => {
      setIOActivity(prev => {
        const newData = [...prev];
        
        // Remove oldest data point
        if (newData.length > 0) newData.shift();
        
        // Add new data point
        const now = new Date();
        newData.push({
          time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          reads: Math.floor(Math.random() * 50) + 10,
          writes: Math.floor(Math.random() * 30) + 5
        });
        
        return newData;
      });
    }, 5000);
    
    return () => {
      clearInterval(interval);
      clearInterval(ioInterval);
    };
  }, []);

  // Prepare data for the pie chart
  const pieData = disks.map(disk => ({
    name: disk.name,
    value: disk.usagePercentage,
    usedSpace: disk.used,
    freeSpace: disk.available
  }));

  return (
    <PageContainer
      title="Storage"
      description="Monitor and manage your system's storage"
      className="max-w-full w-full"
    >
      <div className="flex flex-col space-y-6 w-full">
        {/* Disk Usage Card */}
        <Card className="dark:bg-slate-900/50 dark:border-slate-700/50 bg-white/60 border-slate-200/70 backdrop-blur-sm p-6 w-full transition-all duration-300">
          <div className="flex items-center mb-4">
            <HardDrive className="h-5 w-5 text-cyan-400 mr-2" />
            <h2 className="text-lg font-medium dark:text-slate-200 text-slate-800">Disk Usage</h2>
          </div>
          
          {isLoadingDisks ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 dark:border-cyan-500 border-cyan-600"></div>
            </div>
          ) : diskError ? (
            <div className="text-center h-64 flex flex-col justify-center items-center">
              <div className="text-2xl dark:text-red-400 text-red-500 mb-2">
                <AlertCircle />
              </div>
              <p className="dark:text-slate-300 text-slate-700">{diskError}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                      labelLine={false}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="dark:bg-slate-800/90 bg-white/90 p-3 shadow-md rounded border dark:border-slate-700/50 border-slate-200/50">
                              <p className="text-sm font-medium dark:text-slate-200 text-slate-700">{data.name}</p>
                              <p className="text-xs dark:text-cyan-400 text-cyan-600">Used: {data.usedSpace}</p>
                              <p className="text-xs dark:text-green-400 text-green-600">Free: {data.freeSpace}</p>
                              <p className="text-xs dark:text-amber-400 text-amber-600">Usage: {data.value}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium dark:text-slate-300 text-slate-700 mb-2">Storage Overview</h3>
                {disks.map((disk, index) => (
                  <div 
                    key={index} 
                    className="dark:bg-slate-800/50 bg-slate-100/70 p-3 rounded-lg hover:dark:bg-slate-700/50 hover:bg-slate-200/70 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg cursor-pointer"
                  >
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium dark:text-slate-300 text-slate-700">{disk.name}</span>
                      <span className="text-xs dark:text-slate-400 text-slate-500">{disk.type}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs dark:text-slate-400 text-slate-600">
                        {disk.used} / {disk.total}
                      </span>
                      <span className="text-xs font-medium dark:text-cyan-400 text-cyan-600">
                        {disk.usagePercentage}%
                      </span>
                    </div>
                    <div className="h-2 dark:bg-slate-700/30 bg-slate-200/70 rounded-full">
                      <div
                        className={`h-full rounded-full ${
                          disk.usagePercentage > 90
                            ? 'bg-red-500'
                            : disk.usagePercentage > 75
                            ? 'bg-amber-500'
                            : 'bg-cyan-500'
                        }`}
                        style={{ width: `${disk.usagePercentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
        
        {/* File Systems Card */}
        <Card className="dark:bg-slate-900/50 dark:border-slate-700/50 bg-white/60 border-slate-200/70 backdrop-blur-sm p-6 w-full transition-all duration-300">
          <div className="flex items-center mb-4">
            <Database className="h-5 w-5 text-purple-400 mr-2" />
            <h2 className="text-lg font-medium dark:text-slate-200 text-slate-800">File Systems</h2>
          </div>
          
          {isLoadingDisks ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 dark:border-purple-500 border-purple-600"></div>
            </div>
          ) : diskError ? (
            <div className="text-center h-64 flex flex-col justify-center items-center">
              <div className="text-2xl dark:text-red-400 text-red-500 mb-2">
                <AlertCircle />
              </div>
              <p className="dark:text-slate-300 text-slate-700">{diskError}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b dark:border-slate-700 border-slate-200">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium dark:text-slate-400 text-slate-500 uppercase tracking-wider">Mount Point</th>
                    <th className="px-3 py-3 text-left text-xs font-medium dark:text-slate-400 text-slate-500 uppercase tracking-wider">Type</th>
                    <th className="px-3 py-3 text-left text-xs font-medium dark:text-slate-400 text-slate-500 uppercase tracking-wider">Total</th>
                    <th className="px-3 py-3 text-left text-xs font-medium dark:text-slate-400 text-slate-500 uppercase tracking-wider">Used</th>
                    <th className="px-3 py-3 text-left text-xs font-medium dark:text-slate-400 text-slate-500 uppercase tracking-wider">Available</th>
                    <th className="px-3 py-3 text-left text-xs font-medium dark:text-slate-400 text-slate-500 uppercase tracking-wider">Usage</th>
                  </tr>
                </thead>
                <tbody>
                  {disks.map((disk, index) => (
                    <tr 
                      key={index} 
                      className={`
                        ${index % 2 === 0 ? 'dark:bg-slate-800/30 bg-slate-50/50' : ''} 
                        hover:dark:bg-slate-700/40 hover:bg-slate-100/70 transition-colors duration-200 cursor-pointer
                      `}
                    >
                      <td className="px-3 py-3 text-sm dark:text-slate-300 text-slate-700">{disk.name}</td>
                      <td className="px-3 py-3 text-sm dark:text-slate-300 text-slate-700">
                        <span className="px-2 py-1 text-xs rounded-full dark:bg-slate-700/50 bg-slate-200/70">
                          {disk.type}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-sm dark:text-slate-300 text-slate-700">{disk.total}</td>
                      <td className="px-3 py-3 text-sm dark:text-purple-400 text-purple-600">{disk.used}</td>
                      <td className="px-3 py-3 text-sm dark:text-green-400 text-green-600">{disk.available}</td>
                      <td className="px-3 py-3 text-sm">
                        <div className="flex items-center">
                          <div className="w-16 h-2 dark:bg-slate-700/30 bg-slate-200/70 rounded-full mr-2">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                disk.usagePercentage > 90
                                  ? 'bg-red-500'
                                  : disk.usagePercentage > 75
                                  ? 'bg-amber-500'
                                  : 'bg-purple-500'
                              }`}
                              style={{ width: `${disk.usagePercentage}%` }}
                            />
                          </div>
                          <span 
                            className={`text-xs font-medium ${
                              disk.usagePercentage > 90
                                ? 'dark:text-red-400 text-red-600'
                                : disk.usagePercentage > 75
                                ? 'dark:text-amber-400 text-amber-600'
                                : 'dark:text-purple-400 text-purple-600'
                            }`}
                          >
                            {disk.usagePercentage}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
        
        {/* I/O Activity Card */}
        <Card className="dark:bg-slate-900/50 dark:border-slate-700/50 bg-white/60 border-slate-200/70 backdrop-blur-sm p-6 w-full transition-all duration-300">
          <div className="flex items-center mb-4">
            <ArrowDownUp className="h-5 w-5 text-blue-400 mr-2" />
            <h2 className="text-lg font-medium dark:text-slate-200 text-slate-800">I/O Activity</h2>
          </div>
          
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ioActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis 
                  dataKey="time" 
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
                  domain={[0, 'dataMax + 10']}
                  tickFormatter={(value) => `${value} MB/s`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="dark:bg-slate-800/90 bg-white/90 px-3 py-2 shadow-md rounded border dark:border-slate-700/50 border-slate-200/50">
                          <p className="text-sm font-medium dark:text-slate-200 text-slate-700">
                            {label}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                            <p className="text-xs dark:text-blue-400 text-blue-600">
                              Reads: {payload[0].value} MB/s
                            </p>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            <p className="text-xs dark:text-green-400 text-green-600">
                              Writes: {payload[1].value} MB/s
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="reads" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  dot={{ r: 3 }} 
                  name="Reads"
                />
                <Line 
                  type="monotone" 
                  dataKey="writes" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  dot={{ r: 3 }} 
                  name="Writes"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex items-center justify-end space-x-6 mt-3 border-t dark:border-slate-700/50 border-slate-200/70 pt-2">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-xs dark:text-slate-300 text-slate-700">Disk Reads</span>
        </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-xs dark:text-slate-300 text-slate-700">Disk Writes</span>
        </div>
        </div>
        </Card>
      </div>
    </PageContainer>
  )
} 