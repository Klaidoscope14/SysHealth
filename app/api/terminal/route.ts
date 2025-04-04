import { exec } from 'child_process'
import { NextResponse } from 'next/server'

// Function to determine the correct terminal command based on the operating system
const getTerminalCommand = () => {
  switch (process.platform) {
    case 'darwin': 
      return 'open -a Terminal .' // macOS: Opens the default Terminal app
    case 'win32': 
      return 'start cmd.exe' // Windows: Opens Command Prompt
    case 'linux': 
      // Linux: Try different terminal emulators in order
      const linuxTerminals = [
        'gnome-terminal', // GNOME Terminal
        'konsole',        // KDE Konsole
        'xterm',          // XTerm
        'terminator',     // Terminator
        'urxvt'           // RXVT-Unicode
      ]
      return linuxTerminals.join(' || ') // Tries each terminal until one works
    default:
      return 'xterm' // Fallback for unknown OS
  }
}

// API endpoint to open the system terminal
export async function POST() {
  try {
    const command = getTerminalCommand() // Get the terminal command based on OS
    
    return new Promise((resolve) => {
      exec(command, (error) => { // Execute the command to open the terminal
        if (error) {
          console.error('Error executing terminal command:', error)
          resolve(NextResponse.json({ error: 'Failed to open terminal' }, { status: 500 })) // Return error if execution fails
        } else {
          resolve(NextResponse.json({ success: true })) // Return success if terminal opens
        }
      })
    })
  } catch (error) {
    console.error('Error in terminal API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 }) // Handle unexpected errors
  }
}