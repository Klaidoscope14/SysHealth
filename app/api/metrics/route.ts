import { NextResponse } from "next/server" 
import os from "os" 
import { execSync } from "child_process" 

export async function GET() {
  try {
    const cpus = os.cpus()
    const loadAvg = os.loadavg()
    
    const cpuUsage = await calculateCPUUsage()
    const osType = os.type();
    const osVersion = os.version();
    const kernelVersion = os.release();

    const uptimeSec = os.uptime();
    
    const bootTime = new Date(Date.now() - uptimeSec * 1000)
  .toLocaleString("en-US", { 
    month: "short", 
    day: "numeric", 
    year: "numeric", 
    hour: "numeric", 
    minute: "numeric", 
    hour12: true 
  });

    const totalMem = os.totalmem()
    let freeMem = os.freemem()
    let usedMem = totalMem - freeMem
    let adjustedUsage = (usedMem / totalMem) * 100

    if (process.platform === "darwin") {
      try {
        const vmStatOutput = execSync("vm_stat").toString()
        const pageSize = 4096 
        const pagesActive = parseInt(vmStatOutput.match(/Pages active:\s+(\d+)/)?.[1] || "0")
        const pagesWired = parseInt(vmStatOutput.match(/Pages wired down:\s+(\d+)/)?.[1] || "0")
        const pagesCompressed = parseInt(vmStatOutput.match(/Pages occupied by compressor:\s+(\d+)/)?.[1] || "0")
        
        const actuallyUsed = (pagesActive + pagesWired + pagesCompressed) * pageSize
        adjustedUsage = (actuallyUsed / totalMem) * 100
        usedMem = actuallyUsed
        freeMem = totalMem - usedMem
      } catch (error) {
        console.error("Error parsing vm_stat:", error)
      }
    }

    const hours = Math.floor(uptimeSec / 3600);
    const minutes = Math.floor((uptimeSec % 3600) / 60);
    const seconds = Math.floor(uptimeSec % 60);
    const uptimeStr = `${hours}h ${minutes}m ${seconds}s`;

    return NextResponse.json({
      cpu: {
        usage: cpuUsage,
        cores: cpus.length,
        clockSpeed: cpus[0].speed / 1000,
        loadAverage: {
          "1min": loadAvg[0],
          "5min": loadAvg[1],
          "15min": loadAvg[2]
        },
        uptime: uptimeStr,
        system: {
          os: osVersion,
          kernel: osType,
          kernelVersion,
          lastBoot: bootTime
        }
      },
      memory: {
        total: parseInt((totalMem / 1024 / 1024).toFixed(0)), 
        used: parseInt((usedMem / 1024 / 1024).toFixed(0)),   
        free: parseInt((freeMem / 1024 / 1024).toFixed(0)),  
        usagePercentage: Math.min(100, Math.round(adjustedUsage))
      },
      uptime: uptimeStr
    })
  } catch (error) {
    console.error("Error fetching system metrics:", error)
    return NextResponse.json({ error: "Failed to fetch system metrics" }, { status: 500 })
  }
}

function calculateCPUUsage() {
  try {
    const getCPUInfo = () => {
      const cpus = os.cpus();
      return cpus.map(cpu => {
        const total = Object.values(cpu.times).reduce((a, b) => a + b);
        return {
          idle: cpu.times.idle,
          total
        };
      });
    };

    const start = getCPUInfo();
    const wait = (ms: number) => new Promise(res => setTimeout(res, ms));
    
    return new Promise(async resolve => {
      await wait(100); 
      const end = getCPUInfo();

      let idleDiff = 0;
      let totalDiff = 0;

      for (let i = 0; i < start.length; i++) {
        idleDiff += end[i].idle - start[i].idle;
        totalDiff += end[i].total - start[i].total;
      }

      const usage = 1 - idleDiff / totalDiff;
      resolve(Math.round(usage * 100));
    });
  } catch (error) {
    console.error("Error calculating CPU usage:", error);
    return Promise.resolve(0);
  }
}