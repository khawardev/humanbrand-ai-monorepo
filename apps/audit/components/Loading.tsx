import React from 'react'

const Loading = () => {
    return (
        <div className='flex justify-center items-center min-h-screen'>
            <span className="relative flex size-3.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/80 opacity-75"></span>
                <span className="relative inline-flex size-3.5 rounded-full bg-primary/80"></span>
            </span>
        </div>
    )
}

export default Loading