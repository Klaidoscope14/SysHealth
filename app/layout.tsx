"use client" 

import { Inter } from "next/font/google" 
import { SidebarProvider, Sidebar, SidebarContent } from "@/components/ui/sidebar" 
import { SidebarNav } from "@/components/sidebar-nav" 
import "./globals.css" 
import { TopNav } from "@/components/top-nav"
import { ThemeProvider } from "next-themes" 

const inter = Inter({ subsets: ["latin"] }) 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode 
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark"> 
      <body className={`${inter.className} bg-background text-foreground antialiased dark:bg-slate-950 dark:text-slate-200`}> 
        
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          
          <SidebarProvider defaultOpen={true}> 
            <div className="relative flex min-h-screen"> 
              
              <Sidebar className="border-r dark:border-slate-800"> 
                <SidebarContent> 
                  <div className="flex h-14 items-center border-b px-4 dark:border-slate-800"> 
                    <span className="font-semibold">SysHealth</span> 
                  </div>
                  <SidebarNav /> 
                </SidebarContent>
              </Sidebar>

              <div className="flex-1"> 
                
                <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-slate-800 dark:bg-slate-950/95 dark:supports-[backdrop-filter]:bg-slate-950/60">
                  <div className="flex h-14 items-center justify-between w-full px-6">
                    <h1 className="text-lg font-semibold">System Monitor</h1> 
                    <TopNav />
                  </div>
                </header>
                
                <main className="flex-1 overflow-y-auto">
                  {children}
                </main>
              </div>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}