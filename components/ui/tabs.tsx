"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"
import { Blur } from "@/components/shared/MagicBlur"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-6", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex p-1 items-center justify-start gap-1 rounded-lg bg-muted/80  text-muted-foreground border border-border/50",
        "overflow-x-auto scrollbar-hide backdrop-blur-sm",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm  ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "data-[state=active]:bg-primary data-[state=active]:text-background data-[state=active]:shadow-sm data-[state=active]:font-medium",
        "hover:text-foreground hover:bg-muted-foreground/10",
        "[&_svg]:size-4 [&_svg]:mr-2 ",
        className
      )}
      {...props}
    />
  )
}




function TabsContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    >
      <Blur className="w-full h-full space-y-8">
        {children}
      </Blur>
    </TabsPrimitive.Content>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
