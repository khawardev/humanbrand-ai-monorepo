import AI_Prompt from '@/components/ui/ai-prompt'
import React from 'react'

const page = () => {
    return (
        <div className='sm:w-8/12 w-full flex flex-col sm:px-0 px-4 justify-end mx-auto h-[85vh] '>
            <AI_Prompt />
        </div>
    )
}

export default page