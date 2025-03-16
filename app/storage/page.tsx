"use client"

import { PageContainer } from "@/components/page-container"

export default function StoragePage() {
  return (
    <PageContainer
      title="Storage"
      description="Monitor and manage your system's storage"
    >
      <div className="grid gap-4">
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-sm font-medium text-cyan-50">Disk Usage</h3>
          {/* Disk usage visualization will be implemented here */}
        </div>
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-sm font-medium text-cyan-50">File Systems</h3>
          {/* File systems table will be implemented here */}
        </div>
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-sm font-medium text-cyan-50">I/O Activity</h3>
          {/* I/O activity chart will be implemented here */}
        </div>
      </div>
    </PageContainer>
  )
} 