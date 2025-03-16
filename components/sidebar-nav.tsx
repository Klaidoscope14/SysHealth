"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { 
  Terminal, 
  Home, 
  Activity, 
  Settings, 
  HardDrive,
  Cpu,
  Network,
  Shield
} from "lucide-react"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

const navigationItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/",
    description: "System overview and main metrics"
  },
  {
    title: "CPU & Memory",
    icon: Cpu,
    href: "/cpu",
    description: "CPU and memory usage monitoring"
  },
  {
    title: "System Activity",
    icon: Activity,
    href: "/activity",
    description: "Real-time system activity monitoring"
  },
  {
    title: "Storage",
    icon: HardDrive,
    href: "/storage",
    description: "Storage usage and disk management"
  },
  {
    title: "Network",
    icon: Network,
    href: "/network",
    description: "Network traffic and connections"
  },
  {
    title: "Security",
    icon: Shield,
    href: "/security",
    description: "System security and firewall settings"
  },
  {
    title: "Console",
    icon: Terminal,
    href: "#",
    action: "openTerminal",
    description: "System terminal access"
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
    description: "Application settings and preferences"
  }
]

export function SidebarNav() {
  const pathname = usePathname()
  const { state } = useSidebar()

  const handleTerminal = async () => {
    try {
      const response = await fetch('/api/terminal', {
        method: 'POST',
      })
      if (!response.ok) {
        console.error('Failed to open terminal')
      }
    } catch (error) {
      console.error('Error opening terminal:', error)
    }
  }

  return (
    <SidebarMenu>
      {navigationItems.map((item) => (
        <SidebarMenuItem key={item.title}>
          {item.action === "openTerminal" ? (
            <SidebarMenuButton
              onClick={handleTerminal}
              isActive={false}
              tooltip={state === "collapsed" ? item.title : item.description}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </SidebarMenuButton>
          ) : (
            <Link href={item.href} passHref legacyBehavior>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={state === "collapsed" ? item.title : item.description}
              >
                <a>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </Link>
          )}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
} 