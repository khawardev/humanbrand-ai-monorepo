import { Spinner } from '@/shared/spinner'
import React from 'react'
import { LuLoaderCircle } from 'react-icons/lu'

const Loading = () => {
    return (
        <div className='flex-center min-h-[90vh]'> <LuLoaderCircle className="text-muted-foreground size-4 animate-spin" /></div>
    )
}

export default Loading