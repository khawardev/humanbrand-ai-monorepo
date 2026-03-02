import * as React from "react"

import { cn } from "@repo/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-muted-foreground placeholder:text-base text-base  aria-invalid:border-destructive bg-input/20 border-input/90 flex field-sizing-content min-h-16 w-full rounded-md border  px-3 py-2 text-[15px] shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
