import * as React from "react"
import { cn } from "@/lib/utils"

type InputVariant = "default" | "secondary" | "error" | "muted"
type InputSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"

interface InputProps extends Omit<React.ComponentProps<"input">, "size"> {
  variant?: InputVariant
  size?: InputSize
  icon?: React.ReactNode
  endElement?: React.ReactNode
}

const variantStyles: Record<InputVariant, string> = {
  default:
    "dark:bg-accent bg-popover dark:focus:bg-accent/50 focus:bg-popover/30  border-input/90 ",
  secondary:
    "bg-secondary/20 focus:bg-secondary/10 active:bg-secondary/5 border-secondary/80 focus:border-secondary/40 focus:ring-secondary/40",
  error:
    "bg-input/20 focus:bg-destructive/10 active:bg-destructive/5 border-destructive/90 focus:border-destructive/40 focus:ring-destructive/40",
  muted:
    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 px-3 py-1 text-base shadow-xs outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive rounded-lg border-0 bg-background pl-10 transition-colors focus-visible:bg-background/10 active:bg-background/5 focus-visible:ring-0 focus-visible:ring-offset-0",
}

const sizeStyles: Record<InputSize, string> = {
  sm: "h-7 px-2 py-1 text-sm",
  md: "h-10 px-3 py-1 text-base",
  lg: "h-11 px-3 py-2 text-base",
  xl: "h-13 px-3 py-2 text-base",
  "2xl": "h-15 px-3 py-2 text-base",
  "3xl": "h-20 px-30 py-4 text-base rounded-none",
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", size = "md", icon, endElement, ...props }, ref) => {
    const hasIcon = !!icon

    return (
      <div className={cn("relative flex-1", hasIcon && "group")}>
        {icon && (
          <span className="-translate-y-1/2 absolute top-1/2 md:left-4 left-4  text-muted-foreground/50 transition-opacity group-focus-within:opacity-70">
            {icon}
          </span>
        )}
        <input
          type={type}
          data-slot="input"
          className={cn(
            "flex w-full min-w-0 rounded-md border shadow-xs transition-colors duration-100 ease-in-out outline-none",
            variant !== "muted" && variantStyles[variant],
            variant === "muted" && variantStyles.muted,
            sizeStyles[size],
            hasIcon && " pl-11",
            className
          )}
          ref={ref}
          {...props}
        />
        {endElement && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {endElement}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }