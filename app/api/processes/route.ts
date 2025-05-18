import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
// Converting 'exec' into an asynchronous function using 'promisify'.

export async function GET() {
  try {
    let command = '';

    // Determine the appropriate system command based on the operating system.
    if (process.platform === 'darwin' || process.platform === 'linux') {
      // On macOS and Linux, use 'ps' to list active processes along with CPU and memory usage.
      command = 'ps -ax -o pid,comm,%cpu,%mem,state';
    } else if (process.platform === 'win32') {
      // On Windows, use 'tasklist' to fetch process details in CSV format.
      command = 'tasklist /FO CSV /NH';
    }

    // Execute the command asynchronously and get the output.
    const { stdout } = await execAsync(command);

    const lines = stdout.trim().split('\n');
    const processes = lines.slice(1).map(line => {
    const [pid, command, cpu, mem, state] = line.trim().split(/\s+/);

      return {
        pid,                        // Process ID
        name: command,              // Process name
        cpu: parseFloat(cpu) || 0,  // CPU usage percentage (default to 0 if not a number)
        memory: parseFloat(mem) || 0, // Memory usage percentage (default to 0 if not a number)
        status: state               // Process status (running, sleeping, etc.)
      };
    });

    processes.sort((a, b) => b.cpu - a.cpu);

    return NextResponse.json({ processes: processes.slice(0, 20) });
  } catch (error) {
    console.error('Error fetching processes:', error);
    return NextResponse.json({ error: 'Failed to fetch processes' }, { status: 500 });
  }
}