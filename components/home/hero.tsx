import Image from "next/image"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export const Hero = () => {
    return (
        <section className="bg-linear-to-b relative to-muted from-background">
            <div className="sm:pt-44 sm:pb-56 pt-16 pb-12">
                <div className="mx-auto w-full max-w-5xl md:px-12 px-4">
                    <div className="md:w-1/2">
                        <div>
                            <h1 className="max-w-md text-balance text-5xl font-medium md:text-6xl">AIAG Content Action Model 3.3</h1>
                            <h5 className="text-muted-foreground my-6 max-w-2xl text-balance text-xl">Select the options needed in each section for the desired content.</h5>
                            <div className="flex items-center gap-3">
                                <Button asChild className="pr-4.5">
                                    <Link href="#form-start">
                                        <span className="text-nowrap">Explore</span>
                                        <ChevronDown className="opacity-50" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="perspective-near mt-24 translate-x-12 md:absolute md:-right-6 md:bottom-16 md:left-1/2 md:top-40 md:mt-0 md:translate-x-0">
                    <div className="before:border-foreground/5 before:bg-foreground/5 relative h-full before:absolute before:-inset-x-4 before:bottom-7 before:top-0 before:skew-x-6 before:rounded-[calc(var(--radius)+1rem)] before:border">
                        <div className="bg-background rounded-(--radius) shadow-foreground/10 ring-foreground/5 relative h-full -translate-y-12 skew-x-6 overflow-hidden border border-transparent shadow-md ring-1">
                            <Image
                                src="https://tailark.com/_next/image?url=%2Fdark-card.webp&w=3840&q=75"
                                alt="app screen"
                                width="2880"
                                height="1842"
                                className="object-top-left size-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 z-40 w-full h-[30%] bg-gradient-to-b from-transparent to-background"></div>
        </section>
    )
}