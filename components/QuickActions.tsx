"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Shield, RefreshCw, Download, Terminal } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

export function QuickActions() {
  // State for resource allocation
  const [processingPower, setProcessingPower] = useState(42)
  const [memoryAllocation, setMemoryAllocation] = useState(68)
  const [networkBandwidth, setNetworkBandwidth] = useState(35)
  const [priorityLevel, setPriorityLevel] = useState(4)
  const [isScanning, setIsScanning] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [notification, setNotification] = useState<{ title: string; message: string; type: 'info' | 'success' | 'error' } | null>(null)

  // Show notification
  const showNotification = (title: string, message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setNotification({ title, message, type })
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  // Handle security scan
  const handleSecurityScan = async () => {
    if (isScanning) return
    
    setIsScanning(true)
    showNotification("Security scan initiated", "Scanning system for security vulnerabilities...", "info")
    
    // Simulate scan process
    setTimeout(() => {
      setIsScanning(false)
      showNotification("Security scan completed", "No vulnerabilities found. System is secure.", "success")
    }, 3000)
  }
  
  // Handle data sync
  const handleSyncData = async () => {
    if (isSyncing) return
    
    setIsSyncing(true)
    showNotification("Data synchronization started", "Syncing system data with remote servers...", "info")
    
    // Simulate sync process
    setTimeout(() => {
      setIsSyncing(false)
      showNotification("Data sync completed", "All data synchronized successfully.", "success")
    }, 4000)
  }
  
  // Handle backup
  const handleBackup = async () => {
    if (isBackingUp) return
    
    setIsBackingUp(true)
    showNotification("System backup initiated", "Backing up critical system data...", "info")
    
    // Simulate backup process with progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      if (progress === 100) {
        clearInterval(interval)
        setIsBackingUp(false)
        showNotification("Backup completed", "System backup completed successfully.", "success")
      } else {
        showNotification("Backup in progress", `${progress}% completed...`, "info")
      }
    }, 800)
  }
  
  // Handle console open
  const handleOpenConsole = async () => {
    showNotification("Console opened", "Opening system terminal...", "info")
    
    try {
      // Make a request to the terminal API endpoint
      const response = await fetch('/api/terminal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ command: 'open' })
      });
      
      if (response.ok) {
        showNotification("Terminal launched", "System terminal has been opened successfully.", "success");
      } else {
        throw new Error('Failed to open terminal');
      }
    } catch (error) {
      console.error("Failed to open terminal:", error);
      showNotification(
        "Terminal access failed", 
        "Could not open terminal. Please try again or open manually.", 
        "error"
      );
    }
  }

  // Handle priority level change
  const handlePriorityChange = (value: number[]) => {
    const newPriority = value[0]
    setPriorityLevel(newPriority)
    
    // Apply resource allocation based on priority level
    if (newPriority >= 4) {
      // High priority - allocate more resources
      setProcessingPower(Math.min(processingPower + 10, 90))
      setMemoryAllocation(Math.min(memoryAllocation + 10, 90))
      setNetworkBandwidth(Math.min(networkBandwidth + 10, 90))
      
      showNotification("Priority increased", "System resources have been reallocated for higher performance.", "info")
    } else if (newPriority <= 2) {
      // Low priority - conserve resources
      setProcessingPower(Math.max(processingPower - 20, 20))
      setMemoryAllocation(Math.max(memoryAllocation - 20, 30))
      setNetworkBandwidth(Math.max(networkBandwidth - 20, 15))
      
      showNotification("Priority decreased", "System is now operating in power-saving mode.", "info")
    } else {
      // Medium priority - balanced allocation
      setProcessingPower(42)
      setMemoryAllocation(68)
      setNetworkBandwidth(35)
      
      showNotification("Priority balanced", "System resources are balanced for general use.", "info")
    }
  }

  // Quick actions array with icons, labels, and handlers
  const quickActions = [
    { 
      icon: Shield, 
      label: "Security Scan", 
      handler: handleSecurityScan,
      isLoading: isScanning 
    },
    { 
      icon: RefreshCw, 
      label: "Sync Data", 
      handler: handleSyncData,
      isLoading: isSyncing 
    },
    { 
      icon: Download, 
      label: "Backup", 
      handler: handleBackup,
      isLoading: isBackingUp 
    },
    { 
      icon: Terminal, 
      label: "Console", 
      handler: handleOpenConsole,
      isLoading: false 
    }
  ]

  return (
    <div className="space-y-8 relative">
      {/* Quick Actions Card */}
      <Card className="bg-slate-800/80 dark:bg-slate-900/50 dark:border-slate-700/50 bg-white/60 border-slate-200/70 backdrop-blur-sm p-6 relative">
        {/* Notification */}
        {notification && (
          <div className={`absolute -top-16 left-0 right-0 p-4 rounded-lg shadow-lg transition-all duration-300 z-50 ${
            notification.type === 'success' ? 'bg-green-900/90 border border-green-700' : 
            notification.type === 'error' ? 'bg-red-900/90 border border-red-700' :
            'bg-slate-900/90 border border-slate-700'
          }`}>
            <h3 className="font-medium text-white text-sm">{notification.title}</h3>
            <p className="text-xs text-slate-300 mt-1">{notification.message}</p>
          </div>
        )}

        <h2 className="text-xl font-semibold dark:text-slate-200 text-slate-800 mb-4">Quick Actions</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.handler}
              className="bg-slate-700/50 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 hover:bg-slate-600/50 rounded-lg p-4 border border-slate-600/50 dark:border-slate-700/50 transition-all duration-200 transform hover:scale-[1.02]"
              disabled={action.isLoading}
            >
              {action.isLoading ? (
                <div className="animate-spin h-6 w-6 rounded-full border-2 border-slate-200/70 border-t-transparent mx-auto mb-2"></div>
              ) : (
                <action.icon className="h-6 w-6 text-cyan-400 mx-auto mb-2" />
              )}
              <div className="text-sm dark:text-slate-300 text-slate-100 text-center">
                {action.isLoading ? 'Processing...' : action.label}
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Resource Allocation Card */}
      <Card className="bg-slate-800/80 dark:bg-slate-900/50 dark:border-slate-700/50 bg-white/60 border-slate-200/70 backdrop-blur-sm p-6">
        <h2 className="text-xl font-semibold dark:text-slate-200 text-slate-800 mb-4">Resource Allocation</h2>
        
        <div className="space-y-4">
          {/* Processing Power Allocation */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm dark:text-slate-400 text-slate-300">Processing Power</div>
              <div className="text-xs text-cyan-400">{processingPower}% allocated</div>
            </div>
            <Progress value={processingPower} className="h-2 bg-slate-700/50">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400" style={{ width: `${processingPower}%` }} />
            </Progress>
          </div>

          {/* Memory Allocation */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm dark:text-slate-400 text-slate-300">Memory Allocation</div>
              <div className="text-xs text-purple-400">{memoryAllocation}% allocated</div>
            </div>
            <Progress value={memoryAllocation} className="h-2 bg-slate-700/50">
              <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400" style={{ width: `${memoryAllocation}%` }} />
            </Progress>
          </div>

          {/* Network Bandwidth Allocation */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm dark:text-slate-400 text-slate-300">Network Bandwidth</div>
              <div className="text-xs text-blue-400">{networkBandwidth}% allocated</div>
            </div>
            <Progress value={networkBandwidth} className="h-2 bg-slate-700/50">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400" style={{ width: `${networkBandwidth}%` }} />
            </Progress>
          </div>

          {/* Priority Level Slider */}
          <div className="pt-4 border-t border-slate-700/50">
            <div className="flex items-center justify-between text-sm mb-2">
              <div className="dark:text-slate-400 text-slate-300">Priority Level</div>
              <div className="text-cyan-400 text-xs">{priorityLevel}/5</div>
            </div>
            <Slider 
              className="w-full" 
              defaultValue={[priorityLevel]} 
              max={5} 
              min={1}
              step={1} 
              onValueChange={handlePriorityChange}
            />
            <div className="flex justify-between mt-1 text-xs text-slate-500">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
} 