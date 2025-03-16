export async function openTerminal() {
  try {
    const command = process.platform === 'darwin' ? 'open -a Terminal .' : 'gnome-terminal'
    
    // Using the Fetch API to make a request to a local endpoint that will execute the command
    const response = await fetch('/api/terminal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command }),
    })

    if (!response.ok) {
      throw new Error('Failed to open terminal')
    }
  } catch (error) {
    console.error('Error opening terminal:', error)
  }
} 