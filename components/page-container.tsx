"use client"

import { cn } from "@/lib/utils"

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  children: React.ReactNode
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
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  )
} 