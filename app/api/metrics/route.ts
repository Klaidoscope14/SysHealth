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
    // Get total system memory in bytes
    const totalMem = os.totalmem()

    // Get free memory in bytes
    let freeMem = os.freemem()
    
    // By default, assume available memory is the same as free memory
    let availableMem = freeMem 
    let usedMem = totalMem - freeMem

    // Check for Linux platform
    if (process.platform === "linux") {
      // Read memory information from /proc/meminfo (Linux-specific)
      const memInfo = fs.readFileSync("/proc/meminfo", "utf8").split("\n")

      // Find the line that reports "MemAvailable" (available memory)
      const availableMemLine = memInfo.find(line => line.startsWith("MemAvailable:"))

      if (availableMemLine) {
        // Extract the available memory value in KB and convert it to bytes
        availableMem = parseInt(availableMemLine.split(/\s+/)[1]) * 1024
        // Recalculate used memory
        usedMem = totalMem - availableMem
      }
    } 
    // Check for macOS platform
    else if (process.platform === "darwin") {
      // Execute "vm_stat" command to retrieve memory page statistics
      const vmStatOutput = execSync("vm_stat").toString()

      // Page size is always 4KB on macOS
      const pageSize = 4096 

      // Extract the number of free pages from vm_stat output
      const freePages = parseInt(vmStatOutput.match(/Pages free:\s+(\d+)/)?.[1] || "0")
      
      // Extract the number of inactive pages (memory that is not actively used but available)
      const inactivePages = parseInt(vmStatOutput.match(/Pages inactive:\s+(\d+)/)?.[1] || "0")

      // Convert total available memory to bytes
      availableMem = (freePages + inactivePages) * pageSize
      usedMem = totalMem - availableMem
    }

    // Return system memory metrics as a JSON response
    return NextResponse.json({
      memory: {
        total: (totalMem / 1024 / 1024).toFixed(2), // Convert total memory to MB
        used: (usedMem / 1024 / 1024).toFixed(2),   // Convert used memory to MB
        free: (availableMem / 1024 / 1024).toFixed(2), // Convert available memory to MB
        usagePercentage: ((usedMem / totalMem) * 100).toFixed(2) // Calculate memory usage percentage
      }
    })
  } catch (error) {
    // Handle errors gracefully and log them
    console.error("Error fetching system metrics:", error)
    
    // Return a 500 error response if something goes wrong
    return NextResponse.json({ error: "Failed to fetch system metrics" }, { status: 500 })
  }
}