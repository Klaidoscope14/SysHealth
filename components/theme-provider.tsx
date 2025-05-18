"use client" 

import {
  ThemeProvider as NextThemesProvider, // Import ThemeProvider from next-themes
  type ThemeProviderProps, // Import the type definition for props
} from "next-themes"

// Define a custom ThemeProvider component that wraps around next-themes
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    // Pass all received props to NextThemesProvider and render children
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  )
}