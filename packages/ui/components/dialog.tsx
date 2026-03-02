'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'framer-motion'
import { XIcon } from 'lucide-react'
import * as React from 'react'

import { cn } from '@repo/lib/utils'

const dialogContentVariants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    filter: 'blur(10px)',
    y: 8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    y: 0,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    filter: 'blur(8px)',
    y: 4,
  },
}

const dialogOverlayVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
}

const DialogContext = React.createContext<{ isOpen: boolean }>({ isOpen: false })

function Dialog({
  open,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  const [isOpen, setIsOpen] = React.useState(open ?? false)

  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      setIsOpen(newOpen)
      onOpenChange?.(newOpen)
    },
    [onOpenChange]
  )

  return (
    <DialogContext.Provider value={{ isOpen }}>
      <DialogPrimitive.Root
        data-slot="dialog"
        open={open}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </DialogContext.Provider>
  )
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay forceMount asChild data-slot="dialog-overlay">
      <motion.div
        animate="visible"
        className={cn('fixed inset-0 z-50 bg-black/60 backdrop-blur-sm', className)}
        exit="exit"
        initial="hidden"
        transition={{
          duration: 0.2,
          ease: [0.4, 0, 0.2, 1],
        }}
        variants={dialogOverlayVariants}
      />
    </DialogPrimitive.Overlay>
  )
}

function AnimatedDialogContent({
  className,
  children,
  showCloseButton = true,
}: {
  className?: string
  children: React.ReactNode
  showCloseButton?: boolean
}) {
  return (
    <DialogPrimitive.Content forceMount asChild data-slot="dialog-content">
      <motion.div
        animate="visible"
        className={cn(
          "fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-2xl   border-2 bg-popover p-6 shadow-2xl sm:max-w-lg dark:bg-accent ",
          className,
        )}
        exit="exit"
        initial="hidden"
        transition={{
          duration: 0.25,
          ease: [0.32, 0.72, 0, 1],
        }}
        variants={dialogContentVariants}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            className="absolute top-4 hover:bg-input/40 transition-all duration-200 p-2 rounded-md right-4 opacity-70 ring-offset-background hover:opacity-100 active:scale-[0.97] focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
            data-slot="dialog-close"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </motion.div>
    </DialogPrimitive.Content>
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  const { isOpen } = React.useContext(DialogContext)

  return (
    <DialogPrimitive.Portal forceMount data-slot="dialog-portal">
      <AnimatePresence>
        {isOpen && (
          <>
            <DialogOverlay key="dialog-overlay" />
            <AnimatedDialogContent
              key="dialog-content"
              className={className}
              showCloseButton={showCloseButton}
            >
              {children}
            </AnimatedDialogContent>
          </>
        )}
      </AnimatePresence>
    </DialogPrimitive.Portal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('mb-2 flex flex-col gap-2 text-left', className)}
      data-slot="dialog-header"
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-row justify-end gap-2', className)}
      data-slot="dialog-footer"
      {...props}
    />
  )
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn('font-medium text-lg leading-none', className)}
      data-slot="dialog-title"
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn('text-muted-foreground text-sm', className)}
      data-slot="dialog-description"
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
