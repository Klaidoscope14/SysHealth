import { NextResponse } from "next/server" 
// Importing Next.js response utility to return JSON responses.

import os from "os" 
// Importing the OS module to retrieve system-level information such as memory usage.

import { execSync } from "child_process" 
// Importing child_process to execute shell commands for macOS memory retrieval.

import fs from "fs" 
// Importing file system module to read Linux memory info from `/proc/meminfo`.

export async function GET() {
  try {
    // Get CPU information
    const cpus = os.cpus()
    const loadAvg = os.loadavg()
    
    // Calculate CPU usage
    const cpuUsage = calculateCPUUsage()
    
    // Get memory information - adjusted for macOS accounting
    const totalMem = os.totalmem()
    let freeMem = os.freemem()
    let usedMem = totalMem - freeMem
    let adjustedUsage = (usedMem / totalMem) * 100

    // On macOS, use vm_stat to get more accurate memory usage
    if (process.platform === "darwin") {
      try {
        const vmStatOutput = execSync("vm_stat").toString()
        
        // Extract page size and various memory pages
        const pageSize = 4096 // Default page size on macOS
        const pagesFree = parseInt(vmStatOutput.match(/Pages free:\s+(\d+)/)?.[1] || "0")
        const pagesActive = parseInt(vmStatOutput.match(/Pages active:\s+(\d+)/)?.[1] || "0")
        const pagesInactive = parseInt(vmStatOutput.match(/Pages inactive:\s+(\d+)/)?.[1] || "0")
        const pagesSpeculative = parseInt(vmStatOutput.match(/Pages speculative:\s+(\d+)/)?.[1] || "0")
        const pagesWired = parseInt(vmStatOutput.match(/Pages wired down:\s+(\d+)/)?.[1] || "0")
        const pagesCompressed = parseInt(vmStatOutput.match(/Pages occupied by compressor:\s+(\d+)/)?.[1] || "0")
        
        // Calculate memory usage considering cached/inactive memory as available
        const actuallyUsed = (pagesActive + pagesWired + pagesCompressed) * pageSize
        adjustedUsage = (actuallyUsed / totalMem) * 100
        usedMem = actuallyUsed
        freeMem = totalMem - usedMem
      } catch (error) {
        console.error("Error parsing vm_stat:", error)
        // Fall back to os module calculation if vm_stat fails
      }
    }

    // Return system metrics as a JSON response
    return NextResponse.json({
      cpu: {
        usage: cpuUsage,
        cores: cpus.length,
        clockSpeed: cpus[0].speed / 1000, // Convert MHz to GHz
        loadAverage: {
          "1min": loadAvg[0],
          "5min": loadAvg[1],
          "15min": loadAvg[2]
        }
      },
      memory: {
        total: parseInt((totalMem / 1024 / 1024).toFixed(0)), // Convert total memory to MB
        used: parseInt((usedMem / 1024 / 1024).toFixed(0)),   // Convert used memory to MB
        free: parseInt((freeMem / 1024 / 1024).toFixed(0)),   // Convert free memory to MB
        usagePercentage: Math.min(100, Math.round(adjustedUsage)) // Cap at 100%
      }
    })
  } catch (error) {
    // Handle errors gracefully and log them
    console.error("Error fetching system metrics:", error)
    
    // Return a 500 error response if something goes wrong
    return NextResponse.json({ error: "Failed to fetch system metrics" }, { status: 500 })
  }
}

function calculateCPUUsage() {
  try {
    const cpus = os.cpus()
    const usage = cpus.reduce((acc, cpu) => {
      const total = Object.values(cpu.times).reduce((a, b) => a + b)
      const idle = cpu.times.idle
      return acc + ((total - idle) / total)
    }, 0) / cpus.length
    
    return Math.round(usage * 100)
  } catch (error) {
    console.error("Error calculating CPU usage:", error)
    return 0
  }
}