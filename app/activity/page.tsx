"use client" 
// This directive ensures that this component is a Client Component in Next.js, meaning it can use state, effects, and other client-side features.

import { PageContainer } from "@/components/page-container" 
// Importing the PageContainer component, which likely provides a structured layout with a title and description.

export default function ActivityPage() {
  return (
    <PageContainer
      title="System Activity"
      description="Monitor real-time system activity and resource usage"
    >
      {/* Creating a grid layout to organize content */}
      <div className="grid gap-4">
        
        {/* Card for displaying active system processes */}
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-sm font-medium text-cyan-50">Active Processes</h3>
          {/* Process list will be implemented here in the future */}
        </div>

        {/* Card for displaying a resource usage timeline */}
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-sm font-medium text-cyan-50">Resource Usage Timeline</h3>
          {/* Resource timeline will be implemented here in the future */}
        </div>

      </div>
    </PageContainer>
  )
}