'use client'
import Image from "next/image"
import { AIAG_VERSION } from "@/lib/aiag/constants"

export const Hero = () => {

    return (
            <div className=" md:py-12">
                <div className="div-center-md md:py-12 py-0">
                    <div className="md:w-2/3 select-none">
                        <div>
                            <h1 className="text-balance  font-extrabold">
                            <span className=" md:flex  hidden items-start gap-8"> <Image className=" rounded-full" src={'https://i.postimg.cc/ZYDgZQyF/aiag-logo.jpg'} alt="" width={90} height={90} />AIAG Content <br /> Action Model {AIAG_VERSION}</span>
                            <span className=" md:hidden flex items-start gap-8"> <Image className=" rounded-full" src={'https://i.postimg.cc/ZYDgZQyF/aiag-logo.jpg'} alt="" width={70} height={70} /> AIAG <br /> CAM {AIAG_VERSION}</span>
                            </h1>
                            <h5 className="text-muted-foreground my-6 max-w-2xl text-balance text-xl">Select the options needed in each section for the desired content.</h5>
                        </div>
                    </div>
                </div>
            </div>
    )
}