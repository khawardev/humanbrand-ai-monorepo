import { LuLoaderCircle } from 'react-icons/lu'
import { ReactNode } from 'react'

const Spinner = ({children}: {children: ReactNode}) => {
  return (
    <div className='flex items-center gap-2'>
       <LuLoaderCircle className="text-background size-3 animate-spin" /> {children}
    </div>
  )
}

export default Spinner