import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    let command = '';
    if (process.platform === 'darwin' || process.platform === 'linux') {
      command = 'ps -ax -o pid,comm,%cpu,%mem,state';
    } else if (process.platform === 'win32') {
      command = 'tasklist /FO CSV /NH';
    }

    const { stdout } = await execAsync(command);
    const lines = stdout.trim().split('\n');
    
    const processes = lines.slice(1).map(line => {
      const [pid, command, cpu, mem, state] = line.trim().split(/\s+/);
      return {
        pid,
        name: command,
        cpu: parseFloat(cpu) || 0,
        memory: parseFloat(mem) || 0,
        status: state
      };
    });

    // Sort by CPU usage
    processes.sort((a, b) => b.cpu - a.cpu);

    return NextResponse.json({ processes: processes.slice(0, 20) }); // Return top 20 processes
  } catch (error) {
    console.error('Error fetching processes:', error);
    return NextResponse.json({ error: 'Failed to fetch processes' }, { status: 500 });
  }
} 