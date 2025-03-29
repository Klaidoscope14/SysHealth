import * as React from "react"

// Define the breakpoint for mobile screens
const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // State to track whether the screen is mobile-sized or not
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Create a MediaQueryList object to check screen width
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    // Function to update state based on screen width
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Listen for changes in screen width
    mql.addEventListener("change", onChange)

    // Initialize the state on mount
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    // Cleanup function to remove the event listener
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Return a boolean indicating whether the screen is mobile-sized
  return !!isMobile
}