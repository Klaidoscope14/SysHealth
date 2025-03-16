"use client"

import { PageContainer } from "@/components/page-container"

export default function SecurityPage() {
  return (
    <PageContainer
      title="Security"
      description="Monitor and manage system security"
    >
      <div className="grid gap-4">
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-sm font-medium text-cyan-50">Security Status</h3>
          {/* Security status overview will be implemented here */}
        </div>
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-sm font-medium text-cyan-50">Firewall Rules</h3>
          {/* Firewall rules table will be implemented here */}
        </div>
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-sm font-medium text-cyan-50">System Logs</h3>
          {/* Security logs will be implemented here */}
        </div>
      </div>
    </PageContainer>
  )
} 