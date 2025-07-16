"use client"

import { useState, useEffect } from "react"
import { PageContainer } from "@/components/page-container"
import { Card } from "@/components/ui/card"
import { AlertTriangle, Shield, FileText, Check, X, AlertCircle, Clock, Shield as ShieldIcon } from "lucide-react"

interface SecurityStatus {
  overallStatus: 'secure' | 'warning' | 'vulnerable';
  lastScan: string;
  vulnerabilities: {
    high: number;
    medium: number;
    low: number;
  };
  securityScore: number;
  firewallStatus: 'enabled' | 'disabled';
  antivirusStatus: 'enabled' | 'disabled';
}

interface FirewallRule {
  id: string;
  name: string;
  type: 'inbound' | 'outbound';
  action: 'allow' | 'deny';
  protocol: string;
  source: string;
  destination: string;
  port: string;
  enabled: boolean;
}

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  source: string;
  message: string;
}

const mockSecurityStatus: SecurityStatus = {
  overallStatus: 'warning',
  lastScan: '2023-07-15 14:30:22',
  vulnerabilities: {
    high: 2,
    medium: 5,
    low: 12
  },
  securityScore: 76,
  firewallStatus: 'enabled',
  antivirusStatus: 'enabled'
};

const mockFirewallRules: FirewallRule[] = [
  {
    id: '1',
    name: 'Allow HTTP',
    type: 'inbound',
    action: 'allow',
    protocol: 'TCP',
    source: 'Any',
    destination: 'Local',
    port: '80',
    enabled: true
  },
  {
    id: '2',
    name: 'Allow HTTPS',
    type: 'inbound',
    action: 'allow',
    protocol: 'TCP',
    source: 'Any',
    destination: 'Local',
    port: '443',
    enabled: true
  },
  {
    id: '3',
    name: 'Block Telnet',
    type: 'inbound',
    action: 'deny',
    protocol: 'TCP',
    source: 'Any',
    destination: 'Local',
    port: '23',
    enabled: true
  },
  {
    id: '4',
    name: 'Allow SSH',
    type: 'inbound',
    action: 'allow',
    protocol: 'TCP',
    source: '192.168.1.0/24',
    destination: 'Local',
    port: '22',
    enabled: true
  },
  {
    id: '5',
    name: 'Allow DNS',
    type: 'outbound',
    action: 'allow',
    protocol: 'UDP',
    source: 'Local',
    destination: 'Any',
    port: '53',
    enabled: true
  },
];

const mockLogs: LogEntry[] = [
  {
    timestamp: '2023-07-15 15:42:12',
    level: 'warning',
    source: 'Firewall',
    message: 'Blocked connection attempt from 203.45.78.32 to port 22'
  },
  {
    timestamp: '2023-07-15 15:30:05',
    level: 'info',
    source: 'System',
    message: 'Security scan completed successfully'
  },
  {
    timestamp: '2023-07-15 14:55:37',
    level: 'error',
    source: 'Authentication',
    message: 'Failed login attempt for user admin from 192.168.1.45'
  },
  {
    timestamp: '2023-07-15 14:32:18',
    level: 'info',
    source: 'Firewall',
    message: 'Rule "Block Telnet" triggered for IP 78.45.12.23'
  },
  {
    timestamp: '2023-07-15 14:15:03',
    level: 'warning',
    source: 'System',
    message: 'High CPU usage detected - 92% for 5 minutes'
  },
  {
    timestamp: '2023-07-15 14:10:53',
    level: 'info',
    source: 'System',
    message: 'Security definitions updated to version 2023.07.15'
  },
  {
    timestamp: '2023-07-15 13:45:22',
    level: 'warning',
    source: 'Authentication',
    message: 'Multiple failed login attempts detected for user admin'
  },
];

export default function SecurityPage() {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>(mockSecurityStatus);
  const [firewallRules, setFirewallRules] = useState<FirewallRule[]>(mockFirewallRules);
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStatusColor = (status: 'secure' | 'warning' | 'vulnerable') => {
    switch (status) {
      case 'secure':
        return {
          bg: 'dark:bg-green-900/30 bg-green-100',
          text: 'dark:text-green-400 text-green-700',
          icon: <Check className="h-5 w-5 text-green-500" />
        };
      case 'warning':
        return {
          bg: 'dark:bg-amber-900/30 bg-amber-100',
          text: 'dark:text-amber-400 text-amber-700',
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />
        };
      case 'vulnerable':
        return {
          bg: 'dark:bg-red-900/30 bg-red-100',
          text: 'dark:text-red-400 text-red-700',
          icon: <X className="h-5 w-5 text-red-500" />
        };
    }
  };

  const getLogTypeColor = (level: 'info' | 'warning' | 'error') => {
    switch (level) {
      case 'info':
        return {
          bg: 'dark:bg-blue-900/30 bg-blue-100',
          text: 'dark:text-blue-400 text-blue-700',
          icon: <AlertCircle className="h-4 w-4 dark:text-blue-400 text-blue-600" />
        };
      case 'warning':
        return {
          bg: 'dark:bg-amber-900/30 bg-amber-100',
          text: 'dark:text-amber-400 text-amber-700',
          icon: <AlertTriangle className="h-4 w-4 dark:text-amber-400 text-amber-600" />
        };
      case 'error':
        return {
          bg: 'dark:bg-red-900/30 bg-red-100',
          text: 'dark:text-red-400 text-red-700',
          icon: <X className="h-4 w-4 dark:text-red-400 text-red-600" />
        };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <PageContainer
      title="Security"
      description="Monitor and manage system security"
      className="max-w-full w-full px-5"
    >
      <div className="flex flex-col space-y-8 w-full px-2">
        <Card className="dark:bg-slate-900/50 dark:border-slate-700/50 bg-white/60 border-slate-200/70 backdrop-blur-sm p-6 w-full transition-all duration-300 hover:shadow-md">
          <div className="flex items-center mb-4">
            <Shield className="h-5 w-5 text-indigo-400 mr-2" />
            <h2 className="text-lg font-medium dark:text-slate-200 text-slate-800">Security Status</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column: Overall status and vulnerabilities */}
            <div className="space-y-6">
              <div className="flex items-center">
                <div className={`${getStatusColor(securityStatus.overallStatus).bg} rounded-lg p-4 flex items-center justify-between w-full`}>
                  <div className="flex items-center">
                    {getStatusColor(securityStatus.overallStatus).icon}
                    <span className={`ml-2 text-sm font-medium ${getStatusColor(securityStatus.overallStatus).text}`}>
                      {securityStatus.overallStatus === 'secure' ? 'System Secure' : 
                       securityStatus.overallStatus === 'warning' ? 'Security Warning' : 'System Vulnerable'}
                    </span>
                  </div>
                  <div className="flex items-center m-5">
                    <Clock className="h-4 w-4 dark:text-slate-400 text-slate-600 mr-1" />
                    <span className="text-xs dark:text-slate-400 text-slate-600">
                      Last scan: {formatTimestamp(securityStatus.lastScan)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 dark:bg-slate-800/50 bg-slate-100/70 rounded-lg">
                <h3 className="text-sm font-medium dark:text-slate-300 text-slate-700 mb-3">Vulnerabilities</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs dark:text-slate-400 text-slate-600">High</span>
                    <span className="text-xs dark:text-red-400 text-red-600 font-medium">{securityStatus.vulnerabilities.high}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: `${Math.min(securityStatus.vulnerabilities.high * 10, 100)}%` }}></div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-xs dark:text-slate-400 text-slate-600">Medium</span>
                    <span className="text-xs dark:text-amber-400 text-amber-600 font-medium">{securityStatus.vulnerabilities.medium}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(securityStatus.vulnerabilities.medium * 5, 100)}%` }}></div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-xs dark:text-slate-400 text-slate-600">Low</span>
                    <span className="text-xs dark:text-blue-400 text-blue-600 font-medium">{securityStatus.vulnerabilities.low}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min(securityStatus.vulnerabilities.low * 2, 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="p-4 dark:bg-slate-800/50 bg-slate-100/70 rounded-lg flex flex-col items-center justify-center">
                <h3 className="text-sm font-medium dark:text-slate-300 text-slate-700 mb-3">Security Score</h3>
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-32 h-32" viewBox="0 0 36 36">
                    <path
                      className="dark:text-slate-700 text-slate-300"
                      strokeDasharray="100, 100"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      className={securityStatus.securityScore >= 80 ? "text-green-500" : securityStatus.securityScore >= 60 ? "text-amber-500" : "text-red-500"}
                      strokeDasharray={`${securityStatus.securityScore}, 100`}
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-3xl font-semibold ${getScoreColor(securityStatus.securityScore)}`}>
                      {securityStatus.securityScore}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 dark:bg-slate-800/50 bg-slate-100/70 rounded-lg">
                <h3 className="text-sm font-medium dark:text-slate-300 text-slate-700 mb-3">Protection Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <ShieldIcon className="h-4 w-4 dark:text-slate-400 text-slate-600 mr-1" />
                      <span className="text-xs dark:text-slate-400 text-slate-600">Firewall</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${securityStatus.firewallStatus === 'enabled' ? 'dark:bg-green-900/30 bg-green-100 dark:text-green-400 text-green-700' : 'dark:bg-red-900/30 bg-red-100 dark:text-red-400 text-red-700'}`}>
                      {securityStatus.firewallStatus === 'enabled' ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 dark:text-slate-400 text-slate-600 mr-1" />
                      <span className="text-xs dark:text-slate-400 text-slate-600">Antivirus</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${securityStatus.antivirusStatus === 'enabled' ? 'dark:bg-green-900/30 bg-green-100 dark:text-green-400 text-green-700' : 'dark:bg-red-900/30 bg-red-100 dark:text-red-400 text-red-700'}`}>
                      {securityStatus.antivirusStatus === 'enabled' ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="dark:bg-slate-900/50 dark:border-slate-700/50 bg-white/60 border-slate-200/70 backdrop-blur-sm p-6 w-full transition-all duration-300 hover:shadow-md">
          <div className="flex items-center mb-4">
            <Shield className="h-5 w-5 text-orange-400 mr-2" />
            <h2 className="text-lg font-medium dark:text-slate-200 text-slate-800">Firewall Rules</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b dark:border-slate-700 border-slate-200">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium dark:text-slate-400 text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="px-3 py-3 text-left text-xs font-medium dark:text-slate-400 text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="px-3 py-3 text-left text-xs font-medium dark:text-slate-400 text-slate-500 uppercase tracking-wider">Action</th>
                  <th className="px-3 py-3 text-left text-xs font-medium dark:text-slate-400 text-slate-500 uppercase tracking-wider">Protocol</th>
                  <th className="px-3 py-3 text-left text-xs font-medium dark:text-slate-400 text-slate-500 uppercase tracking-wider">Source</th>
                  <th className="px-3 py-3 text-left text-xs font-medium dark:text-slate-400 text-slate-500 uppercase tracking-wider">Destination</th>
                  <th className="px-3 py-3 text-left text-xs font-medium dark:text-slate-400 text-slate-500 uppercase tracking-wider">Port</th>
                  <th className="px-3 py-3 text-left text-xs font-medium dark:text-slate-400 text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {firewallRules.map((rule, index) => (
                  <tr 
                    key={index} 
                    className={`
                      ${index % 2 === 0 ? 'dark:bg-slate-800/30 bg-slate-50/50' : ''} 
                      hover:dark:bg-slate-700/40 hover:bg-slate-100/70 transition-colors duration-200 cursor-pointer
                    `}
                  >
                    <td className="px-3 py-3 text-sm dark:text-slate-300 text-slate-700">{rule.name}</td>
                    <td className="px-3 py-3 text-sm">
                      <span 
                        className={`px-2 py-1 text-xs rounded-full ${
                          rule.type === 'inbound' 
                            ? 'dark:bg-blue-900/30 bg-blue-100 dark:text-blue-400 text-blue-700' 
                            : 'dark:bg-purple-900/30 bg-purple-100 dark:text-purple-400 text-purple-700'
                        }`}
                      >
                        {rule.type}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm">
                      <span 
                        className={`px-2 py-1 text-xs rounded-full ${
                          rule.action === 'allow' 
                            ? 'dark:bg-green-900/30 bg-green-100 dark:text-green-400 text-green-700' 
                            : 'dark:bg-red-900/30 bg-red-100 dark:text-red-400 text-red-700'
                        }`}
                      >
                        {rule.action}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm dark:text-slate-300 text-slate-700">{rule.protocol}</td>
                    <td className="px-3 py-3 text-sm dark:text-slate-300 text-slate-700">{rule.source}</td>
                    <td className="px-3 py-3 text-sm dark:text-slate-300 text-slate-700">{rule.destination}</td>
                    <td className="px-3 py-3 text-sm dark:text-slate-300 text-slate-700">{rule.port}</td>
                    <td className="px-3 py-3 text-sm dark:text-slate-300 text-slate-700">
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full ${rule.enabled ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                        <span>{rule.enabled ? 'Active' : 'Inactive'}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        
        <Card className="dark:bg-slate-900/50 dark:border-slate-700/50 bg-white/60 border-slate-200/70 backdrop-blur-sm p-6 w-full transition-all duration-300 hover:shadow-md">
          <div className="flex items-center mb-4">
            <FileText className="h-5 w-5 text-teal-400 mr-2" />
            <h2 className="text-lg font-medium dark:text-slate-200 text-slate-800">System Logs</h2>
          </div>
          
          <div className="space-y-3">
            {logs.map((log, index) => {
              const typeColor = getLogTypeColor(log.level);
              return (
                <div 
                  key={index} 
                  className="p-3 dark:bg-slate-800/50 bg-slate-100/70 rounded-lg hover:dark:bg-slate-700/40 hover:bg-slate-200/70 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${typeColor.bg} ${typeColor.text} flex items-center`}>
                        {typeColor.icon}
                        <span className="ml-1">{log.level.toUpperCase()}</span>
                      </span>
                      <span className="ml-2 text-sm font-medium dark:text-slate-300 text-slate-700">{log.source}</span>
                    </div>
                    <span className="text-xs dark:text-slate-400 text-slate-600">{log.timestamp}</span>
                  </div>
                  <p className="text-sm dark:text-slate-300 text-slate-700">{log.message}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </PageContainer>
  )
}