"use client" // Indicates that this component is client-side in a Next.js app.

import { Inter } from "next/font/google" // Importing the Inter font from Google Fonts to use in the application.
import { SidebarProvider, Sidebar, SidebarContent } from "@/components/ui/sidebar" // Importing sidebar components to build the sidebar navigation.
import { SidebarNav } from "@/components/sidebar-nav" // Importing the navigation component for the sidebar.
import "./globals.css" // Importing the global CSS styles.
import { TopNav } from "@/components/top-nav"
import { ThemeProvider } from "next-themes" // Import ThemeProvider for dark/light mode

const inter = Inter({ subsets: ["latin"] }) // Initializing the Inter font with Latin characters support.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode // The 'children' prop allows this layout to wrap the content of any nested pages.
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark"> 
      <body className={`${inter.className} bg-background text-foreground antialiased dark:bg-slate-950 dark:text-slate-200`}> 
        {/* Applying the Inter font, background, foreground text colors, and antialiased text rendering */}
        
        {/* ThemeProvider to manage theme state */}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {/* SidebarProvider component is used to manage the sidebar state (whether it's open or closed) */}
          <SidebarProvider defaultOpen={true}> {/* Initially opens the sidebar */}
            <div className="relative flex min-h-screen"> {/* This is the main container with flex layout and full screen height */}
              
              {/* Sidebar Section */}
              <Sidebar className="border-r dark:border-slate-800"> {/* Sidebar component with a right border */}
                <SidebarContent> {/* Content inside the sidebar */}
                  <div className="flex h-14 items-center border-b px-4 dark:border-slate-800"> {/* Top section of the sidebar with a title */}
                    <span className="font-semibold">SysHealth</span> {/* Title inside the sidebar */}
                  </div>
                  <SidebarNav /> {/* Sidebar navigation component, which will render the navigation links */}
                </SidebarContent>
              </Sidebar>

              {/* Main Content Area */}
              <div className="flex-1"> {/* Main content area that takes up the remaining space */}
                
                {/* Sticky Header */}
                <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-slate-800 dark:bg-slate-950/95 dark:supports-[backdrop-filter]:bg-slate-950/60">
                  {/* Sticky header with blurred background on scroll */}
                  <div className="flex h-14 items-center justify-between w-full px-6">
                    <h1 className="text-lg font-semibold">System Monitor</h1> {/* Page title */}
                    <TopNav />
                  </div>
                </header>
                
                {/* Main Section to display page content */}
                <main className="flex-1 overflow-y-auto">
                  {children} {/* This is where the content passed to this layout (the 'children' prop) will be rendered */}
                </main>
              </div>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}