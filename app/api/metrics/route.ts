import { NextResponse } from "next/server"
import os from "os"
import { execSync } from "child_process"
import fs from "fs"

export async function GET() {
  try {
    const totalMem = os.totalmem()
    let freeMem = os.freemem()
    let availableMem = freeMem // Default to free memory
    let usedMem = totalMem - freeMem

    if (process.platform === "linux") {
      // Linux: Read from /proc/meminfo
      const memInfo = fs.readFileSync("/proc/meminfo", "utf8").split("\n")

      const availableMemLine = memInfo.find(line => line.startsWith("MemAvailable:"))
      if (availableMemLine) {
        availableMem = parseInt(availableMemLine.split(/\s+/)[1]) * 1024 // Convert KB to Bytes
        usedMem = totalMem - availableMem
      }
    } else if (process.platform === "darwin") {
      // macOS: Use "vm_stat" to get available memory
      const vmStatOutput = execSync("vm_stat").toString()
      const pageSize = 4096 // Page size is always 4KB on macOS

      // Extract free and inactive memory pages
      const freePages = parseInt(vmStatOutput.match(/Pages free:\s+(\d+)/)?.[1] || "0")
      const inactivePages = parseInt(vmStatOutput.match(/Pages inactive:\s+(\d+)/)?.[1] || "0")

      // Convert to bytes
      availableMem = (freePages + inactivePages) * pageSize
      usedMem = totalMem - availableMem
    }

    return NextResponse.json({
      memory: {
        total: (totalMem / 1024 / 1024).toFixed(2), // Convert to MB
        used: (usedMem / 1024 / 1024).toFixed(2),
        free: (availableMem / 1024 / 1024).toFixed(2),
        usagePercentage: ((usedMem / totalMem) * 100).toFixed(2)
      }
    })
  } catch (error) {
    console.error("Error fetching system metrics:", error)
    return NextResponse.json({ error: "Failed to fetch system metrics" }, { status: 500 })
  }
}