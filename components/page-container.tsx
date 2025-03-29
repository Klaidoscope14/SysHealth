"use client" // Indicates that this component is a client-side component in a Next.js app.

import { cn } from "@/lib/utils" // Importing a utility function `cn` to handle conditional class names.

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string // The title of the page, required as a prop.
  description?: string // The description of the page, optional.
  children: React.ReactNode // The content (children) of the page, which can be any React node.
}

export function PageContainer({
  title,
  description,
  children,
  className,
  ...props
}: PageContainerProps) {
  return (
    <div className={cn("flex flex-col gap-4 p-6", className)} {...props}>
      {/* Main container div with flex layout and padding, and accepts custom classes through `className` */}
      
      <div className="flex flex-col gap-1">
        {/* Title and description section */}
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {/* Title of the page, with larger text size, bold font, and tight letter spacing */}
        
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
          /* Optional description paragraph, displayed only if the `description` prop is provided. 
          It has smaller text and a muted foreground color. */
        )}
      </div>
      
      {/* Render the children content passed to the component */}
      {children}
    </div>
  )
}