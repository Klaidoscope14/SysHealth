import { NextResponse } from 'next/server';
// Import NextResponse to send JSON responses in a Next.js API route.

import { exec } from 'child_process';
// Import 'exec' from 'child_process' to run system commands.

import { promisify } from 'util';
// Import 'promisify' to convert callback-based 'exec' into a promise-based function.

const execAsync = promisify(exec);
// Convert 'exec' into an async function for easier handling.

export async function GET() {
  try {
    let command = '';

    // Determine the appropriate system command based on the operating system.
    if (process.platform === 'darwin' || process.platform === 'linux') {
      // macOS/Linux: Use 'df -h' to get disk usage and filter only physical drives.
      command = 'df -h | grep -E "^/dev/"';
    } else if (process.platform === 'win32') {
      // Windows: Use 'wmic' to fetch drive details (size and free space).
      command = 'wmic logicaldisk get size,freespace,caption';
    }

    // Execute the command asynchronously and get the output.
    const { stdout } = await execAsync(command);

    // Split the output into lines for processing.
    const lines = stdout.trim().split('\n');

    // Process each line and extract relevant disk information.
    const drives = lines.map(line => {
      if (process.platform === 'darwin' || process.platform === 'linux') {
        // For Linux/macOS, extract disk details using whitespace as a separator.
        const [device, size, used, available, percentage, mountpoint] = line.trim().split(/\s+/);

        // Helper function to convert sizes (e.g., TB, GB, MB) into GB format.
        const convertToGB = (sizeStr: string) => {
          const num = parseFloat(sizeStr); // Extract numeric value
          const unit = sizeStr.replace(/[0-9.]/g, ''); // Extract unit (GB, MB, TB)

          switch (unit.toUpperCase()) {
            case 'TB': return `${(num * 1024).toFixed(1)} GB`; // Convert TB to GB
            case 'GB':
            case 'G':
            case 'GI':
            case 'GIB': return `${num.toFixed(1)} GB`; // Keep GB as is
            case 'MB':
            case 'M':
            case 'MI':
            case 'MIB': return `${(num / 1024).toFixed(1)} GB`; // Convert MB to GB
            default: return `${num.toFixed(1)} GB`; // Default case
          }
        };

        return {
          name: mountpoint, // Mount point (e.g., / or /home)
          total: convertToGB(size), // Total disk size
          used: convertToGB(used), // Used disk space
          available: convertToGB(available), // Free space available
          usagePercentage: parseInt(percentage.replace('%', '')), // Usage in percentage
          type: device.includes('disk') ? 'SSD' : 'HDD' // Basic SSD/HDD detection
        };
      } else {
        // For Windows, extract drive details using spaces as separators.
        const [caption, freespace, size] = line.trim().split(/\s+/);

        // Convert bytes to GB
        const total = parseInt(size) / (1024 * 1024 * 1024);
        const free = parseInt(freespace) / (1024 * 1024 * 1024);
        const used = total - free;

        return {
          name: caption, // Drive letter (e.g., C:, D:)
          total: `${total.toFixed(1)} GB`, // Total size in GB
          used: `${used.toFixed(1)} GB`, // Used space in GB
          available: `${free.toFixed(1)} GB`, // Available space in GB
          usagePercentage: Math.round((used / total) * 100), // Calculate usage percentage
          type: 'Unknown' // No reliable way to detect SSD vs HDD on Windows
        };
      }
    });

    // Sort drives by usage percentage in descending order and take the top 4.
    drives.sort((a, b) => b.usagePercentage - a.usagePercentage);

    // Return a JSON response with the top 4 drives.
    return NextResponse.json({ drives: drives.slice(0, 4) });
  } catch (error) {
    // Handle errors gracefully by logging them.
    console.error('Error fetching storage info:', error);

    // Return a 500 status code with an error message.
    return NextResponse.json({ error: 'Failed to fetch storage information' }, { status: 500 });
  }
}