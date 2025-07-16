import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    let command = '';
    if (process.platform === 'darwin' || process.platform === 'linux') {
      command = 'df -h | grep -E "^/dev/"';
    } else if (process.platform === 'win32') {
      command = 'wmic logicaldisk get size,freespace,caption';
    }

    const { stdout } = await execAsync(command);

    const lines = stdout.trim().split('\n');

    const drives = lines.map(line => {
      if (process.platform === 'darwin' || process.platform === 'linux') {
        const [device, size, used, available, percentage, mountpoint] = line.trim().split(/\s+/);

        const convertToGB = (sizeStr: string) => {
          const num = parseFloat(sizeStr);
          const unit = sizeStr.replace(/[0-9.]/g, ''); 

          switch (unit.toUpperCase()) {
            case 'TB': return `${(num * 1024).toFixed(1)} GB`; 
            case 'GB':
            case 'G':
            case 'GI':
            case 'GIB': return `${num.toFixed(1)} GB`; 
            case 'MB':
            case 'M':
            case 'MI':
            case 'MIB': return `${(num / 1024).toFixed(1)} GB`; 
            default: return `${num.toFixed(1)} GB`; 
          }
        };

        return {
          name: mountpoint,
          total: convertToGB(size),
          used: convertToGB(used),
          available: convertToGB(available),
          usagePercentage: parseInt(percentage.replace('%', '')),
          type: device.includes('disk') ? 'SSD' : 'HDD'
        };
      } else {
        const [caption, freespace, size] = line.trim().split(/\s+/);

        const total = parseInt(size) / (1024 * 1024 * 1024);
        const free = parseInt(freespace) / (1024 * 1024 * 1024);
        const used = total - free;

        return {
          name: caption,
          total: `${total.toFixed(1)} GB`,
          used: `${used.toFixed(1)} GB`,
          available: `${free.toFixed(1)} GB`,
          usagePercentage: Math.round((used / total) * 100),
          type: 'Unknown'
        };
      }
    });

    drives.sort((a, b) => b.usagePercentage - a.usagePercentage);
    return NextResponse.json({ drives: drives.slice(0, 4) });
  } catch (error) {
    console.error('Error fetching storage info:', error);
    return NextResponse.json({ error: 'Failed to fetch storage information' }, { status: 500 });
  }
}