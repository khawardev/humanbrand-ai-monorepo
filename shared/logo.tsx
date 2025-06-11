'use client'
import Image from 'next/image'
import React from 'react'
const Logo = () => {
    return (
        <div className={`flex aspect-square items-center justify-center `}>
            <Image className='[filter:drop-shadow(0_-5px_8px_rgba(251,218,136,0.1))_drop-shadow(0_5px_8px_rgba(132,77,228,0.1))] transition duration-300 hover:scale-105 rounded-full' width={100} height={100} alt="logo" src={'https://i.postimg.cc/Zn9SFWzV/Whisk-400d38a1c6-3.png'} />
        </div>
    )
}

export default Logo