'use client'
import React from 'react'
export const HalfLogo = () => {
    return (
        <div className={`flex size-10 items-center  justify-center`}>
            <img src={'https://i.postimg.cc/nzx83C4D/HB-logo.png'} width={1000} alt={`Logo`}
                className=' cursor-pointer  dark:brightness-0 dark:invert '
            />
        </div>
    )
}


export const FullLogo = () => {
    return (
        <div className={`flex size-40 items-center  justify-center`}>
            <img src={'https://i.postimg.cc/7h9wfsw1/HB-logo-name-mark-side-black.png'} width={1000} alt={`Logo`}
                className=' cursor-pointer  dark:brightness-0 dark:invert '
            />
        </div>
    )
}
