'use client'
import { useTheme } from 'next-themes'
import React from 'react'
export const HalfBlackLogo = () => {
    return (
        <div className={`flex size-10 items-center  justify-center`}>
            <img src={'https://i.postimg.cc/nzx83C4D/HB-logo.png'} width={1000} alt={`Logo`}
            />
        </div>
    )
}
export const HalfLogo = () => {
    const theme = useTheme()
    return (
        <div className={`flex size-10 items-center  justify-center`}>
            {theme.resolvedTheme === 'light' ? <img src={'https://i.postimg.cc/nzx83C4D/HB-logo.png'} width={1000} alt={`Logo`}
                className=' cursor-pointer  '
            /> : <img src={'https://i.postimg.cc/5ythqc3x/HB-Green-Halflogo-name-mark-side-green-1.png'} width={1000} alt={`Logo`}
                className=' cursor-pointer  '
            />}
        </div>
    )
}


export const FullLogo = () => {
    const theme = useTheme()
    return (
        <div className={`flex  items-center  justify-center `}>
            {theme.resolvedTheme === 'light' ? <img src={'https://i.postimg.cc/yY06gqFK/HB-logo-name-mark-side-black-1.png'} width={160} alt={`Logo`}
                className=' cursor-pointer   '
            /> : <img src={'https://i.postimg.cc/c1jwNRnH/HB-logo-name-mark-side-green-1.png'} width={160} alt={`Logo`}
                    className=' cursor-pointer '
            />}
        </div>
    )
}
export const FullLogoMobile = () => {
    const theme = useTheme()
    return (
        <div className={`flex items-center  justify-center `}>
            {theme.resolvedTheme === 'light' ? <img src={'https://i.postimg.cc/yY06gqFK/HB-logo-name-mark-side-black-1.png'} width={140} alt={`Logo`}
                className=' cursor-pointer   '
            /> : <img src={'https://i.postimg.cc/c1jwNRnH/HB-logo-name-mark-side-green-1.png'} width={140} alt={`Logo`}
                    className=' cursor-pointer '
            />}
        </div>
    )
}
export const FullGreenLogo = () => {
    return (
        <div className={`flex size-42 items-center  justify-center`}>
            <img src={'https://i.postimg.cc/c1jwNRnH/HB-logo-name-mark-side-green-1.png'} width={1000} alt={`Logo`}
                className=' cursor-pointer  '
            />
        </div>
    )
}
