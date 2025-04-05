"use client"

import { Bell, LogOut, Moon, Settings, Sun, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import Link from "next/link"

export function TopNav() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true)
  const [userProfile, setUserProfile] = useState({
    name: "User Account",
    email: "loading..."
  })
  const [notifications] = useState([
    { id: 1, text: "System update available", time: "2 mins ago" },
    { id: 2, text: "Backup completed successfully", time: "1 hour ago" },
    { id: 3, text: "Security scan completed", time: "3 hours ago" },
  ])

  // This effect runs once after the component mounts
  useEffect(() => {
    setMounted(true)
    
    // Load user profile from localStorage if available
    try {
      const savedProfile = localStorage.getItem('userProfile')
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile))
      } else {
        // If not in localStorage, try to fetch from API
        fetch('/api/profile')
          .then(res => res.json())
          .then(data => {
            if (data.success && data.profile) {
              setUserProfile(data.profile)
              // Also save to localStorage for future use
              localStorage.setItem('userProfile', JSON.stringify(data.profile))
            }
          })
          .catch(err => console.error('Error fetching profile:', err))
      }
    } catch (error) {
      console.error('Error loading profile from localStorage:', error)
    }
    
    // Set up event listener for profile updates
    const handleProfileUpdate = () => {
      try {
        const savedProfile = localStorage.getItem('userProfile')
        if (savedProfile) {
          const profileData = JSON.parse(savedProfile)
          setUserProfile(profileData)
          console.log('Profile updated in TopNav:', profileData)
        }
      } catch (error) {
        console.error('Error handling profile update:', error)
      }
    }
    
    // Handle storage events specifically
    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === 'userProfile') {
        handleProfileUpdate()
      }
    }
    
    // Listen for storage events from other tabs/windows
    window.addEventListener('storage', handleStorageEvent)
    
    // Listen for custom event from settings page
    window.addEventListener('profileUpdated', handleProfileUpdate)
    
    return () => {
      // Clean up event listeners with the same function references
      window.removeEventListener('storage', handleStorageEvent)
      window.removeEventListener('profileUpdated', handleProfileUpdate)
    }
  }, [])

  // Handle sign out functionality
  const handleSignOut = () => {
    // For now, just log out to console. In a real app, this would call your auth service
    console.log("User signed out")
    // You could redirect to login page or clear credentials here
  }

  // Mark notifications as read when dropdown is opened
  const handleNotificationsOpen = () => {
    setHasUnreadNotifications(false)
  }

  return (
    <div className="flex items-center gap-4">
      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full dark:bg-slate-900/50 bg-white/60 dark:border-slate-700/50 border-slate-200/50 backdrop-blur-sm"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label="Toggle theme"
      >
        {mounted && (
          <>
            <Sun className="h-4 w-4 rotate-0 scale-100 text-amber-500 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 text-slate-300 transition-all dark:rotate-0 dark:scale-100" />
          </>
        )}
      </Button>

      {/* Notifications */}
      <DropdownMenu onOpenChange={handleNotificationsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full dark:bg-slate-900/50 bg-white/60 dark:border-slate-700/50 border-slate-200/50 backdrop-blur-sm relative"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4 dark:text-slate-300 text-slate-700" />
            {hasUnreadNotifications && (
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-cyan-500 border-2 dark:border-slate-900 border-white"></span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 dark:bg-slate-900/95 bg-white/95 dark:border-slate-700/50 border-slate-200/50 backdrop-blur-sm">
          {notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3">
              <div className="text-sm dark:text-slate-200 text-slate-700">{notification.text}</div>
              <div className="text-xs dark:text-slate-400 text-slate-500">{notification.time}</div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full dark:bg-slate-900/50 bg-white/60 dark:border-slate-700/50 border-slate-200/50 backdrop-blur-sm"
            aria-label="User menu"
          >
            <User className="h-4 w-4 dark:text-slate-300 text-slate-700" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 dark:bg-slate-900/95 bg-white/95 dark:border-slate-700/50 border-slate-200/50 backdrop-blur-sm">
          <div className="p-2">
            <p className="text-sm font-medium dark:text-slate-100 text-slate-700">{userProfile.name}</p>
            <p className="text-xs dark:text-slate-400 text-slate-500">{userProfile.email}</p>
          </div>
          <DropdownMenuSeparator className="dark:bg-slate-700/50 bg-slate-200/50" />
          <DropdownMenuItem className="flex items-center gap-2 p-2 cursor-pointer dark:hover:bg-slate-800/50 hover:bg-slate-100/80">
            <Link href="/settings" className="flex items-center gap-2 w-full dark:text-slate-200 text-slate-700">
              <Settings className="h-4 w-4" />
              <span>Profile Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2 p-2 cursor-pointer dark:text-red-400 text-red-600 dark:hover:bg-slate-800/50 hover:bg-slate-100/80" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
} 