import { LuLoaderCircle } from 'react-icons/lu'
import { ReactNode } from 'react'

export const ButtonSpinner = ({children}: {children: ReactNode}) => {
  return (
    <div className='flex items-center gap-2'>
      <LuLoaderCircle className="text-white size-3 animate-spin" /> {children}
    </div>
  )
}


export const Spinner = () => {
  return (
    <LuLoaderCircle className="text-muted-foreground size-3 animate-spin" />
  )
}


export const LineSpinner = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex items-center gap-2 text-muted-foreground text-sm '>
      <LuLoaderCircle className="size-3 inline-block animate-spin" /> {children}
    </div>
  )
}