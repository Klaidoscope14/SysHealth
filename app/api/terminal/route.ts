import { exec } from 'child_process'
import { NextResponse } from 'next/server'

const getTerminalCommand = () => {
  switch (process.platform) {
    case 'darwin': 
      return 'open -a Terminal .' 
    case 'win32': 
      return 'start cmd.exe' 
    case 'linux': 
      const linuxTerminals = [
        'gnome-terminal', 
        'konsole',        
        'xterm',          
        'terminator',     
        'urxvt'           
      ]
      return linuxTerminals.join(' || ') 
    default:
      return 'xterm'
  }
}

export async function POST() {
  try {
    const command = getTerminalCommand() 
    
    return new Promise((resolve) => {
      exec(command, (error) => { 
        if (error) {
          console.error('Error executing terminal command:', error)
          resolve(NextResponse.json({ error: 'Failed to open terminal' }, { status: 500 })) 
        } else {
          resolve(NextResponse.json({ success: true })) 
        }
      })
    })
  } catch (error) {
    console.error('Error in terminal API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 }) 
  }
}