"use client"

import { PageContainer } from "@/components/page-container"

export default function NetworkPage() {
  return (
    <PageContainer
      title="Network"
      description="Monitor network traffic and connections"
    >
      <div className="grid gap-4">
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-sm font-medium text-cyan-50">Network Traffic</h3>
          {/* Network traffic chart will be implemented here */}
        </div>
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-sm font-medium text-cyan-50">Active Connections</h3>
          {/* Active connections table will be implemented here */}
        </div>
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-sm font-medium text-cyan-50">Network Interfaces</h3>
          {/* Network interfaces list will be implemented here */}
        </div>
      </div>
    </PageContainer>
  )
} 