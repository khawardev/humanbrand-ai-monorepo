import { HalfLogo } from '@/components/shared/Logo'
import { Spinner } from '@/components/shared/Spinner'
import React from 'react'
import { LuLoaderCircle } from 'react-icons/lu'

const Loading = () => {
    return (
        <div className='flex-center animate-pulse min-h-[85vh]'>
            {/* <LuLoaderCircle className="text-muted-foreground size-4 animate-spin" /> */}
            {/* <HalfLogo /> */}
            <span className="relative flex size-3.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/80 opacity-75"></span>
                <span className="relative inline-flex size-3.5 rounded-full bg-primary/80"></span>
            </span>
        </div>
    )
}

export default Loading