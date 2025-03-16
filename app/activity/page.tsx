"use client"

import { PageContainer } from "@/components/page-container"

export default function ActivityPage() {
  return (
    <PageContainer
      title="System Activity"
      description="Monitor real-time system activity and resource usage"
    >
      <div className="grid gap-4">
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-sm font-medium text-cyan-50">Active Processes</h3>
          {/* Process list will be implemented here */}
        </div>
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-sm font-medium text-cyan-50">Resource Usage Timeline</h3>
          {/* Resource timeline will be implemented here */}
        </div>
      </div>
    </PageContainer>
  )
} 