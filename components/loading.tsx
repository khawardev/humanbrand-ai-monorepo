import { Spinner } from '@/shared/spinner'
import React from 'react'

const Loading = () => {
    return (
        <div className='flex-center min-h-[90vh]'><Spinner /></div>
    )
}

export default Loading