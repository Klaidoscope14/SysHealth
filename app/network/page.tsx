"use client" // This indicates that this is a client-side component in a Next.js application.

import { PageContainer } from "@/components/page-container" // Importing the PageContainer component to wrap the content of the page.

export default function NetworkPage() {
  return (
    <PageContainer
      title="Network" // Title for the page displayed in the PageContainer.
      description="Monitor network traffic and connections" // Description for the page, provides information about the page's purpose.
    >
      {/* The main content of the page */}
      <div className="grid gap-4"> {/* Grid layout with gap of 4 between items */}
        
        {/* Network Traffic Card */}
        <div className="glass-card rounded-lg p-4"> {/* This card will hold the network traffic chart */}
          <h3 className="text-sm font-medium text-cyan-50">Network Traffic</h3> {/* Heading for the network traffic section */}
          {/* Network traffic chart will be implemented here */}
          {/* Placeholder for where you would eventually implement a chart displaying network traffic */}
        </div>

        {/* Active Connections Card */}
        <div className="glass-card rounded-lg p-4"> {/* This card will hold the table for active connections */}
          <h3 className="text-sm font-medium text-cyan-50">Active Connections</h3> {/* Heading for the active connections section */}
          {/* Active connections table will be implemented here */}
          {/* Placeholder for where you would eventually implement a table showing active network connections */}
        </div>

        {/* Network Interfaces Card */}
        <div className="glass-card rounded-lg p-4"> {/* This card will display the list of network interfaces */}
          <h3 className="text-sm font-medium text-cyan-50">Network Interfaces</h3> {/* Heading for the network interfaces section */}
          {/* Network interfaces list will be implemented here */}
          {/* Placeholder for where you would eventually implement a list of available network interfaces */}
        </div>

      </div>
    </PageContainer>
  )
}