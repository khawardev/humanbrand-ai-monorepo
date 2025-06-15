'use client'
import Image from "next/image"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { AIAG_VERSION } from "@/lib/ai/constants"

export const Hero = () => {
    const theme = useTheme()

    return (
        // <div className="sm:pt-44 sm:pb-56 pt-16 pb-12">
        // <section className="bg-linear-to-b relative to-muted from-background">

        <section >
            <div className=" md:pb-12">
                <div className="div-center-md">
                    <div className="md:w-2/3">
                        <div>
                            <h1 className="text-balance  font-extrabold">
                                <span className=" md:flex  hidden items-start gap-8"> <Image className=" rounded-full" src={'https://i.postimg.cc/ZYDgZQyF/aiag-logo.jpg'} alt="" width={90} height={90} /> AIAG Content Action Model {AIAG_VERSION}</span>
                                <span className=" md:hidden flex items-start gap-8"> <Image className=" rounded-full" src={'https://i.postimg.cc/ZYDgZQyF/aiag-logo.jpg'} alt="" width={70} height={70} /> AIAG CAM {AIAG_VERSION}</span>
                            </h1>
                            <h5 className="text-muted-foreground my-6 max-w-2xl text-balance text-xl">Select the options needed in each section for the desired content.</h5>
                            {/* <div className="flex items-center gap-3">
                                <Button onClick={onExploreClick} className="pr-4.5">
                                    <span className="flex items-center gap-2">
                                        <span className="text-nowrap">Explore</span>
                                        <ChevronDown className="opacity-50" />
                                    </span>
                                </Button>
                            </div> */}
                        </div>
                    </div>
                </div>

                {/* <div className="perspective-near mt-24 translate-x-12 md:absolute md:-right-10 md:bottom-16 md:left-1/2 md:top-40 md:mt-0 md:translate-x-0">
                        <div className="bg-background border  rounded-lg shadow-foreground/10 ring-foreground/5 relative h-full -translate-y-12 skew-x-6 overflow-hidden  shadow-md ring-1">
                            {theme.resolvedTheme === 'dark' ? <Image
                                src="https://i.postimg.cc/jq6nwvYt/Screenshot-6.png"
                                alt="app screen"
                                width="2880"
                                height="1842"
                                className="object-top-left size-full object-cover"
                            /> : <Image
                                src="https://i.postimg.cc/rmwnCfkF/Screenshot-8.png"
                                alt="app screen"
                                width="2880"
                                height="1842"
                                className="object-top-left size-full object-cover"
                            />
                            }
                        </div>
                </div> */}
                {/* <div className="perspective-near mt-24 translate-x-12 md:absolute md:-right-6 md:bottom-16 md:left-1/2 md:top-40 md:mt-0 md:translate-x-0">
                    <div className="before:border-foreground/5 before:bg-foreground/5 relative h-full before:absolute before:-inset-x-4 before:bottom-7 before:top-0 before:skew-x-6 before:rounded-[calc(var(--radius)+0.5rem)] before:border">
                        <div className="bg-background rounded-2xl shadow-foreground/10 ring-foreground/5 relative h-full -translate-y-12 skew-x-6 overflow-hidden border border-transparent shadow-md ring-1">

                            {theme.resolvedTheme === 'dark' ? <Image
                                src="https://i.postimg.cc/jq6nwvYt/Screenshot-6.png"
                                alt="app screen"
                                width="2880"
                                height="1842"
                                className="object-top-left size-full object-cover"
                            /> : <Image
                                src="https://i.postimg.cc/y8GD4bcX/Screenshot-7.png"
                                alt="app screen"
                                width="2880"
                                height="1842"
                                className="object-top-left size-full object-cover"
                            />
                            }
                        </div>
                    </div>
                </div> */}
            </div>
            {/* <div className="absolute bottom-0 left-0 z-40 w-full h-[20%] bg-gradient-to-b from-transparent to-background"></div> */}
        </section>
    )
}