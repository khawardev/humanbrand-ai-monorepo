'use client'

import { Drawer } from 'vaul'

export default function VaulDrawer() {
    return (
        <Drawer.Root shouldScaleBackground>
            <Drawer.Trigger className="relative flex h-10 flex-shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90">
                Open Drawer
            </Drawer.Trigger>

            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-background/40" />
                <Drawer.Content className="flex flex-col rounded-t-[10px] mt-24 h-fit fixed bottom-0 left-0 right-0 outline-none bg-background">
                    <div className="p-4 rounded-t-[10px] flex-1 bg-card text-card-foreground">
                        <div aria-hidden className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-8" />

                        <div className="max-w-md mx-auto">
                            <Drawer.Title className="font-medium mb-4">Drawer for React.</Drawer.Title>
                            <p className="text-muted-foreground mb-2">
                                This component can be used as a Dialog replacement on mobile and tablet devices. You can read about why
                                and how it was built{' '}
                                <a
                                    target="_blank"
                                    className="underline"
                                    href="https://emilkowal.ski/ui/building-a-drawer-component"
                                >
                                    here
                                </a>
                                .
                            </p>
                            <p className="text-muted-foreground mb-2">
                                This one specifically is the most simplest setup you can have, just a simple drawer with a trigger.
                            </p>
                        </div>
                    </div>

                    <div className="p-4 bg-muted border-t border-border mt-auto">
                        <div className="flex gap-6 justify-end max-w-md mx-auto">
                            <a
                                className="text-xs text-muted-foreground flex items-center gap-0.5"
                                href="https://github.com/emilkowalski/vaul"
                                target="_blank"
                            >
                                GitHub
                                <svg
                                    fill="none"
                                    height="16"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    width="16"
                                    aria-hidden="true"
                                    className="w-3 h-3 ml-1"
                                >
                                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                                    <path d="M15 3h6v6"></path>
                                    <path d="M10 14L21 3"></path>
                                </svg>
                            </a>
                            <a
                                className="text-xs text-muted-foreground flex items-center gap-0.5"
                                href="https://twitter.com/emilkowalski_"
                                target="_blank"
                            >
                                Twitter
                                <svg
                                    fill="none"
                                    height="16"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    width="16"
                                    aria-hidden="true"
                                    className="w-3 h-3 ml-1"
                                >
                                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                                    <path d="M15 3h6v6"></path>
                                    <path d="M10 14L21 3"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    )
}