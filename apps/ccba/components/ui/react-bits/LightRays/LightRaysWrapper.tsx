"use client"

import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation";
import LightRays from "./LightRays";


export default function LightRaysWrapper({
    children,
    className,
    raysOrigin = "top-center",
    raysSpeed = 0.2,
    lightSpread = 1.4,
    rayLength = 15,
    followMouse = false,
    mouseInfluence = 0,
    noiseAmount = 0.3,
    distortion = 0.05,
}: any) {
    const { theme } = useTheme();
    const pathname = usePathname();
    const raysColor = theme === "dark" ? "#71EA01" : "#000000";

    const shouldShowLightRays = !pathname.startsWith("/dashboard");

    return (
        <div className={cn("relative h-screen", className)}>
            <div className="absolute z-10 w-full h-full overflow-y-auto">
                {children}
            </div>

            {shouldShowLightRays && (
                <LightRays
                    raysOrigin={'top-left'}
                    raysColor={raysColor}
                    raysSpeed={raysSpeed}
                    lightSpread={lightSpread}
                    rayLength={rayLength}
                    followMouse={followMouse}
                    mouseInfluence={mouseInfluence}
                    noiseAmount={noiseAmount}
                    distortion={distortion}
                    className="absolute inset-0 -z-10 h-full w-full"
                />
            )}
        </div>
    )
}