"use client" 

import { useState, useEffect } from "react"
import { PageContainer } from "@/components/page-container"
import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { NetworkIcon, Activity, ExternalLink, Server } from "lucide-react"

interface NetworkData {
  timestamp: string;
  download: number;
  upload: number;
}

interface Connection {
  protocol: string;
  localAddress: string;
  foreignAddress: string;
  state: string;
  pid: string;
}

interface NetworkInterface {
  name: string;
  ipAddress: string;
  macAddress: string;
  status: "up" | "down";
  speed: string;
  bytesReceived: number;
  bytesSent: number;
}

const generateNetworkData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 10; i > 0; i--) {
    const timePoint = new Date(now);
    timePoint.setMinutes(now.getMinutes() - i);
    
    data.push({
      timestamp: timePoint.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      download: Math.floor(Math.random() * 10) + 1,
      upload: Math.floor(Math.random() * 5) + 0.5,
    });
  }
  
  return data;
};

const mockConnections: Connection[] = [
  { protocol: "TCP", localAddress: "192.168.1.5:443", foreignAddress: "52.95.54.1:https", state: "ESTABLISHED", pid: "1234" },
  { protocol: "TCP", localAddress: "192.168.1.5:49152", foreignAddress: "142.250.189.174:https", state: "ESTABLISHED", pid: "5678" },
  { protocol: "UDP", localAddress: "0.0.0.0:5353", foreignAddress: "*:*", state: "LISTENING", pid: "9012" },
  { protocol: "TCP", localAddress: "127.0.0.1:8080", foreignAddress: "127.0.0.1:52146", state: "ESTABLISHED", pid: "3456" },
  { protocol: "TCP", localAddress: "0.0.0.0:80", foreignAddress: "*:*", state: "LISTENING", pid: "7890" },
  { protocol: "TCP", localAddress: "192.168.1.5:49153", foreignAddress: "35.186.224.25:https", state: "ESTABLISHED", pid: "1122" },
  { protocol: "UDP", localAddress: "0.0.0.0:68", foreignAddress: "*:*", state: "LISTENING", pid: "3344" },
];

const mockInterfaces: NetworkInterface[] = [
  { 
    name: "en0", 
    ipAddress: "192.168.1.5", 
    macAddress: "a1:b2:c3:d4:e5:f6", 
    status: "up", 
    speed: "1 Gbps",
    bytesReceived: 1258000,
    bytesSent: 458000
  },
  { 
    name: "lo0", 
    ipAddress: "127.0.0.1", 
    macAddress: "00:00:00:00:00:00", 
    status: "up", 
    speed: "10 Gbps",
    bytesReceived: 8400,
    bytesSent: 8400
  },
  { 
    name: "en1", 
    ipAddress: "Not Assigned", 
    macAddress: "f6:e5:d4:c3:b2:a1", 
    status: "down", 
    speed: "0 Mbps",
    bytesReceived: 0,
    bytesSent: 0
  }
];

export default function NetworkPage() {
  const [networkData, setNetworkData] = useState<NetworkData[]>(generateNetworkData());
  const [connections, setConnections] = useState<Connection[]>(mockConnections);
  const [interfaces, setInterfaces] = useState<NetworkInterface[]>(mockInterfaces);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateNetworkData = () => {
      setNetworkData(prev => {
        const newData = [...prev];
        
        if (newData.length > 0) newData.shift();
        
        const now = new Date();
        newData.push({
          timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          download: Math.floor(Math.random() * 10) + 1,
          upload: Math.floor(Math.random() * 5) + 0.5,
        });
        
        return newData;
      });
    };
    
    const interval = setInterval(updateNetworkData, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <PageContainer
      title="Network"
      description="Monitor network traffic and connections"
      className="max-w-full w-full"
    >
      <div className="flex flex-col space-y-6 w-full">
        <Card className="dark:bg-slate-900/50 dark:border-slate-700/50 bg-white/60 border-slate-200/70 backdrop-blur-sm p-6 w-full transition-all duration-300">
          <div className="flex items-center mb-4">
            <Activity className="h-5 w-5 text-blue-400 mr-2" />
            <h2 className="text-lg font-medium dark:text-slate-200 text-slate-800">Network Traffic</h2>
          </div>
          
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={networkData}>
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
                  domain={[0, 'dataMax + 2']}
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
                              Download: {payload[0].value} MB/s
                            </p>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            <p className="text-xs dark:text-green-400 text-green-600">
                              Upload: {payload[1].value} MB/s
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
                  dataKey="download" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  dot={{ r: 3 }} 
                  name="Download"
                />
                <Line 
                  type="monotone" 
                  dataKey="upload" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  dot={{ r: 3 }} 
                  name="Upload"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex items-center justify-end space-x-6 mt-3 border-t dark:border-slate-700/50 border-slate-200/70 pt-2">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-xs dark:text-slate-300 text-slate-700">
                Download: {networkData[networkData.length - 1]?.download.toFixed(1)} MB/s
              </span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-xs dark:text-slate-300 text-slate-700">
                Upload: {networkData[networkData.length - 1]?.upload.toFixed(1)} MB/s
              </span>
            </div>
          </div>
        </Card>
        
        <Card className="dark:bg-slate-900/50 dark:border-slate-700/50 bg-white/60 border-slate-200/70 backdrop-blur-sm p-6 w-full transition-all duration-300">
          <div className="flex items-center mb-4">
            <ExternalLink className="h-5 w-5 text-purple-400 mr-2" />
            <h2 className="text-lg font-medium dark:text-slate-200 text-slate-800">Active Connections</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b dark:border-slate-700 border-slate-200">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium dark:text-slate-400 text-slate-500 uppercase tracking-wider">Protocol</th>
                  <th className="px-3 py-3 text-left text-xs font-medium dark:text-slate-400 text-slate-500 uppercase tracking-wider">Local Address</th>
                  <th className="px-3 py-3 text-left text-xs font-medium dark:text-slate-400 text-slate-500 uppercase tracking-wider">Foreign Address</th>
                  <th className="px-3 py-3 text-left text-xs font-medium dark:text-slate-400 text-slate-500 uppercase tracking-wider">State</th>
                  <th className="px-3 py-3 text-left text-xs font-medium dark:text-slate-400 text-slate-500 uppercase tracking-wider">PID</th>
                </tr>
              </thead>
              <tbody>
                {connections.map((connection, index) => (
                  <tr 
                    key={index} 
                    className={`
                      ${index % 2 === 0 ? 'dark:bg-slate-800/30 bg-slate-50/50' : ''} 
                      hover:dark:bg-slate-700/40 hover:bg-slate-100/70 transition-colors duration-200 cursor-pointer
                    `}
                  >
                    <td className="px-3 py-3 text-sm dark:text-slate-300 text-slate-700">{connection.protocol}</td>
                    <td className="px-3 py-3 text-sm dark:text-slate-300 text-slate-700">{connection.localAddress}</td>
                    <td className="px-3 py-3 text-sm dark:text-slate-300 text-slate-700">{connection.foreignAddress}</td>
                    <td className="px-3 py-3 text-sm">
                      <span 
                        className={`px-2 py-1 text-xs rounded-full 
                          ${connection.state === 'ESTABLISHED' 
                            ? 'dark:bg-green-900/30 bg-green-100 dark:text-green-400 text-green-700' 
                            : connection.state === 'LISTENING'
                            ? 'dark:bg-blue-900/30 bg-blue-100 dark:text-blue-400 text-blue-700'
                            : 'dark:bg-amber-900/30 bg-amber-100 dark:text-amber-400 text-amber-700'
                          }`}
                      >
                        {connection.state}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm dark:text-slate-300 text-slate-700">{connection.pid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        
        <Card className="dark:bg-slate-900/50 dark:border-slate-700/50 bg-white/60 border-slate-200/70 backdrop-blur-sm p-6 w-full transition-all duration-300">
          <div className="flex items-center mb-4">
            <Server className="h-5 w-5 text-cyan-400 mr-2" />
            <h2 className="text-lg font-medium dark:text-slate-200 text-slate-800">Network Interfaces</h2>
          </div>
          
          <div className="grid gap-4">
            {interfaces.map((iface, index) => (
              <div 
                key={index} 
                className="dark:bg-slate-800/50 bg-slate-100/70 p-4 rounded-lg hover:dark:bg-slate-700/50 hover:bg-slate-200/70 transition-all duration-200 transform hover:scale-[1.02] cursor-pointer"
              >
                <div className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <span className="text-base font-medium dark:text-slate-200 text-slate-800">{iface.name}</span>
                    <span 
                      className={`ml-2 px-2 py-0.5 text-xs rounded-full 
                        ${iface.status === 'up' ? 'dark:bg-green-900/30 bg-green-100 dark:text-green-400 text-green-700' : 'dark:bg-red-900/30 bg-red-100 dark:text-red-400 text-red-700'}`}
                    >
                      {iface.status === 'up' ? 'UP' : 'DOWN'}
                    </span>
                  </div>
                  <span className="text-sm dark:text-cyan-400 text-cyan-600">{iface.speed}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div>
                    <div className="text-xs dark:text-slate-400 text-slate-600 mb-1">IP Address</div>
                    <div className="text-sm dark:text-slate-300 text-slate-700">{iface.ipAddress}</div>
                  </div>
                  <div>
                    <div className="text-xs dark:text-slate-400 text-slate-600 mb-1">MAC Address</div>
                    <div className="text-sm dark:text-slate-300 text-slate-700">{iface.macAddress}</div>
                  </div>
                </div>
                
                <div className="mt-3 pt-2 border-t dark:border-slate-700/50 border-slate-200/70">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs dark:text-slate-400 text-slate-600 mb-1">Received</div>
                      <div className="text-sm dark:text-green-400 text-green-600">{(iface.bytesReceived / 1000000).toFixed(1)} MB</div>
                    </div>
                    <div>
                      <div className="text-xs dark:text-slate-400 text-slate-600 mb-1">Sent</div>
                      <div className="text-sm dark:text-blue-400 text-blue-600">{(iface.bytesSent / 1000000).toFixed(1)} MB</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageContainer>
  )
}