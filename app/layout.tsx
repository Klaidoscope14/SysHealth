"use client"

import { Inter } from "next/font/google"
import { SidebarProvider, Sidebar, SidebarContent } from "@/components/ui/sidebar"
import { SidebarNav } from "@/components/sidebar-nav"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <SidebarProvider defaultOpen={true}>
          <div className="relative flex min-h-screen">
            <Sidebar className="border-r">
              <SidebarContent>
                <div className="flex h-14 items-center border-b px-4">
                  <span className="font-semibold">SysHealth</span>
                </div>
                <SidebarNav />
              </SidebarContent>
            </Sidebar>
            <div className="flex-1">
              <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-14 items-center px-6">
                  <h1 className="text-lg font-semibold">System Monitor</h1>
                </div>
              </header>
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}
