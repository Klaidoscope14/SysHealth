"use client" 

import { useState, useEffect } from "react";
import { PageContainer } from "@/components/page-container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Lock, Bell, CheckCircle, Loader2 } from "lucide-react";

export default function SettingsPage() {
  // Profile state
  const [name, setName] = useState("Admin User");
  const [email, setEmail] = useState("admin@example.com");
  const [profileSaved, setProfileSaved] = useState(false);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  
  // Security state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  
  // Notification preferences state
  const [systemUpdates, setSystemUpdates] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [maintenanceNotifs, setMaintenanceNotifs] = useState(false);
  const [notificationsSaved, setNotificationsSaved] = useState(false);
  const [isNotificationsSaving, setIsNotificationsSaving] = useState(false);
  
  // Initialize profile from localStorage if it exists
  useEffect(() => {
    try {
      // Try loading from localStorage first
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const profileData = JSON.parse(savedProfile);
        setName(profileData.name);
        setEmail(profileData.email);
      } else {
        // If no localStorage data, try fetching from API
        fetch('/api/profile')
          .then(res => res.json())
          .then(data => {
            if (data.success && data.profile) {
              setName(data.profile.name);
              setEmail(data.profile.email);
              // Also save to localStorage for future use
              localStorage.setItem('userProfile', JSON.stringify(data.profile));
            }
          })
          .catch(err => console.error('Error fetching profile:', err));
      }
      
      const savedNotifications = localStorage.getItem('notificationPreferences');
      if (savedNotifications) {
        const notifData = JSON.parse(savedNotifications);
        setSystemUpdates(notifData.systemUpdates ?? true);
        setSecurityAlerts(notifData.securityAlerts ?? true);
        setMaintenanceNotifs(notifData.maintenanceNotifs ?? false);
      }
    } catch (error) {
      console.error('Error loading settings from localStorage:', error);
    }
  }, []);
  
  // Handle profile save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate profile data
    if (!name.trim() || !email.trim()) {
      return;
    }
    
    // Show loading state
    setIsProfileSaving(true);
    
    // Prepare profile data
    const profileData = { name, email };
    
    // Simulate API call with timeout
    fetch('/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Save to localStorage
          localStorage.setItem('userProfile', JSON.stringify(profileData));
          
          const event = new Event('profileUpdated');
          window.dispatchEvent(event);
          console.log("Profile saved:", profileData);
          
          setIsProfileSaving(false);
          setProfileSaved(true);
          
          setTimeout(() => setProfileSaved(false), 3000);
        } else {
          console.error("Failed to save profile:", data.error);
          setIsProfileSaving(false);
        }
      })
      .catch(error => {
        console.error("Error saving profile:", error);
        setIsProfileSaving(false);
      });
  };
  
  // Handle password update
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSaved(false);
    
    // Validate password data
    if (!currentPassword) {
      setPasswordError("Current password is required");
      return;
    }
    
    if (!newPassword) {
      setPasswordError("New password is required");
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    // Show loading state
    setIsPasswordSaving(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      console.log("Password updated");
      
      // Reset form and show success
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsPasswordSaving(false);
      setPasswordSaved(true);
      
      // Auto hide success message after 3 seconds
      setTimeout(() => setPasswordSaved(false), 3000);
    }, 800);
  };
  
  // Handle notification preferences save
  const handleSaveNotifications = () => {
    // Show loading state
    setIsNotificationsSaving(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Save to localStorage
      const notificationPreferences = {
        systemUpdates,
        securityAlerts,
        maintenanceNotifs
      };
      localStorage.setItem('notificationPreferences', JSON.stringify(notificationPreferences));
      
      // In a real app, you would save these preferences to a database or API
      console.log("Notification preferences saved:", notificationPreferences);
      
      // Update the UI
      setIsNotificationsSaving(false);
      setNotificationsSaved(true);
      
      // Auto hide success message after 3 seconds
      setTimeout(() => setNotificationsSaved(false), 3000);
    }, 800);
  };

  return (
    <PageContainer
      title="Settings"
      description="Manage your account settings and preferences"
    >
      <div className="flex flex-col space-y-8 w-full">
        {/* Profile Card */}
        <Card className="p-6 bg-slate-900/50 border-slate-700/50 backdrop-blur-sm dark:bg-slate-900/50 dark:border-slate-700/50 bg-white/60 border-slate-200/70 w-full transition-all duration-300 hover:shadow-md relative">
          {profileSaved && (
            <div className="absolute top-4 right-4 flex items-center px-3 py-1 rounded-md bg-green-900/80 border border-green-700 text-green-100">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="text-xs">Profile updated successfully!</span>
            </div>
          )}
          
          <div className="flex items-center mb-4">
            <User className="h-5 w-5 text-blue-400 mr-2" />
            <h2 className="text-lg font-medium dark:text-slate-200 text-slate-800">Profile</h2>
          </div>
          
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label 
                  htmlFor="name" 
                  className="block text-sm font-medium dark:text-slate-300 text-slate-700"
                >
                  Full Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-slate-800/30 border-slate-700/50 dark:bg-slate-800/30 dark:border-slate-700/50 bg-white/60 border-slate-200/70"
                  placeholder="Your full name"
                  aria-label="Full Name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium dark:text-slate-300 text-slate-700"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-800/30 border-slate-700/50 dark:bg-slate-800/30 dark:border-slate-700/50 bg-white/60 border-slate-200/70"
                  placeholder="Your email address"
                  aria-label="Email Address"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-600 dark:hover:bg-cyan-700 transition-all duration-300"
                disabled={isProfileSaving}
              >
                {isProfileSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Security Card */}
        <Card className="p-6 bg-slate-900/50 border-slate-700/50 backdrop-blur-sm dark:bg-slate-900/50 dark:border-slate-700/50 bg-white/60 border-slate-200/70 w-full transition-all duration-300 hover:shadow-md relative">
          {passwordSaved && (
            <div className="absolute top-4 right-4 flex items-center px-3 py-1 rounded-md bg-green-900/80 border border-green-700 text-green-100">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="text-xs">Password updated</span>
            </div>
          )}
          
          <div className="flex items-center mb-4">
            <Lock className="h-5 w-5 text-purple-400 mr-2" />
            <h2 className="text-lg font-medium dark:text-slate-200 text-slate-800">Security</h2>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-base font-medium dark:text-slate-200 text-slate-700">Change Password</h3>
              <p className="text-sm dark:text-slate-400 text-slate-500">Update your password to maintain account security</p>
            </div>
            <form className="space-y-4" onSubmit={handleUpdatePassword}>
              {passwordError && (
                <div className="p-2 text-xs text-red-400 bg-red-900/20 border border-red-800/40 rounded-md">
                  {passwordError}
                </div>
              )}
              <div className="space-y-2">
                <label 
                  htmlFor="current-password" 
                  className="block text-sm font-medium dark:text-slate-300 text-slate-700"
                >
                  Current Password
                </label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-slate-800/30 border-slate-700/50 dark:bg-slate-800/30 dark:border-slate-700/50 bg-white/60 border-slate-200/70"
                  placeholder="Enter your current password"
                  aria-label="Current Password"
                />
              </div>
              <div className="space-y-2">
                <label 
                  htmlFor="new-password" 
                  className="block text-sm font-medium dark:text-slate-300 text-slate-700"
                >
                  New Password
                </label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-slate-800/30 border-slate-700/50 dark:bg-slate-800/30 dark:border-slate-700/50 bg-white/60 border-slate-200/70"
                  placeholder="Enter new password"
                  aria-label="New Password"
                />
              </div>
              <div className="space-y-2">
                <label 
                  htmlFor="confirm-password" 
                  className="block text-sm font-medium dark:text-slate-300 text-slate-700"
                >
                  Confirm New Password
                </label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-slate-800/30 border-slate-700/50 dark:bg-slate-800/30 dark:border-slate-700/50 bg-white/60 border-slate-200/70"
                  placeholder="Confirm new password"
                  aria-label="Confirm New Password"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-600 dark:hover:bg-cyan-700"
                  disabled={isPasswordSaving}
                >
                  {isPasswordSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </Card>

        {/* Notifications Card */}
        <Card className="p-6 bg-slate-900/50 border-slate-700/50 backdrop-blur-sm dark:bg-slate-900/50 dark:border-slate-700/50 bg-white/60 border-slate-200/70 w-full transition-all duration-300 hover:shadow-md relative">
          {notificationsSaved && (
            <div className="absolute top-4 right-4 flex items-center px-3 py-1 rounded-md bg-green-900/80 border border-green-700 text-green-100">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="text-xs">Preferences saved</span>
            </div>
          )}
          
          <div className="flex items-center mb-4">
            <Bell className="h-5 w-5 text-amber-400 mr-2" />
            <h2 className="text-lg font-medium dark:text-slate-200 text-slate-800">Notifications</h2>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-base font-medium dark:text-slate-200 text-slate-700">Notification Preferences</h3>
              <p className="text-sm dark:text-slate-400 text-slate-500">Customize how you receive notifications</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium dark:text-slate-300 text-slate-700">System Updates</h4>
                  <p className="text-xs dark:text-slate-400 text-slate-500">Get notified about system updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={systemUpdates}
                    onChange={(e) => setSystemUpdates(e.target.checked)}
                    aria-label="Enable system update notifications"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium dark:text-slate-300 text-slate-700">Security Alerts</h4>
                  <p className="text-xs dark:text-slate-400 text-slate-500">Receive security related notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={securityAlerts}
                    onChange={(e) => setSecurityAlerts(e.target.checked)}
                    aria-label="Enable security alert notifications"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium dark:text-slate-300 text-slate-700">Maintenance Notifications</h4>
                  <p className="text-xs dark:text-slate-400 text-slate-500">Get notified about scheduled maintenance</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={maintenanceNotifs}
                    onChange={(e) => setMaintenanceNotifs(e.target.checked)}
                    aria-label="Enable maintenance notifications" 
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="button"
                className="bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-600 dark:hover:bg-cyan-700"
                onClick={handleSaveNotifications}
                disabled={isNotificationsSaving}
              >
                {isNotificationsSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Preferences"
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}