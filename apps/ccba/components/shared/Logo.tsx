'use client'
import { useRouter } from 'next/navigation'
import React from 'react'
export const FullLogo = () => {
    const router = useRouter()
    return (
        <button onClick={() => (router.push('/'))}  className="flex items-center " suppressHydrationWarning={true}>
            <span className="inline dark:hidden">
                <img
                    src="https://i.postimg.cc/nzx83C4D/HB-logo.png"
                    width={40}
                    alt="Logo"
                    className="cursor-pointer block lg:hidden"
                />
                <img
                    src="https://i.postimg.cc/yY06gqFK/HB-logo-name-mark-side-black-1.png"
                    width={140}
                    alt="Logo"
                    className="cursor-pointer hidden lg:block"
                />
            </span>

            <span className="hidden dark:inline">
                <img
                    src="https://i.postimg.cc/5ythqc3x/HB-Green-Halflogo-name-mark-side-green-1.png"
                    width={40}
                    alt="Logo"
                    className="cursor-pointer block lg:hidden"
                />
                <img
                    src="https://i.postimg.cc/c1jwNRnH/HB-logo-name-mark-side-green-1.png"
                    width={140}
                    alt="Logo"
                    className="cursor-pointer hidden lg:block"
                />
            </span>
        </button>
    )
}


export const HalfLogo = () => {
    const router = useRouter()
    return (
        <button onClick={() => (router.push('/'))} className="flex items-center " suppressHydrationWarning={true}>
            <span className="inline dark:hidden">
                <img
                    src="https://i.postimg.cc/nzx83C4D/HB-logo.png"
                    width={40}
                    alt="Logo"
                    className="cursor-pointer "
                />
            </span>

            <span className="hidden dark:inline">
                <img
                    src="https://i.postimg.cc/5ythqc3x/HB-Green-Halflogo-name-mark-side-green-1.png"
                    width={40}
                    alt="Logo"
                    className="cursor-pointer"
                />
            </span>
        </button>
    )
}
