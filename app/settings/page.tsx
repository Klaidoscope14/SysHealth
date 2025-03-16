"use client"

import { PageContainer } from "@/components/page-container"

export default function SettingsPage() {
  return (
    <PageContainer
      title="Settings"
      description="Configure application settings and preferences"
    >
      <div className="grid gap-4">
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-sm font-medium text-cyan-50">General Settings</h3>
          {/* General settings form will be implemented here */}
        </div>
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-sm font-medium text-cyan-50">Appearance</h3>
          {/* Theme and UI settings will be implemented here */}
        </div>
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-sm font-medium text-cyan-50">Notifications</h3>
          {/* Notification settings will be implemented here */}
        </div>
      </div>
    </PageContainer>
  )
} 