import { ReactNode } from 'react'
import { Icons } from './Icons'

export const ButtonSpinner = ({children}: {children: ReactNode}) => {
  return (
    <div className='flex items-center gap-2'>
      <Icons.loading className="size-3 animate-spin" /> {children}
    </div>
  )
}


export const Spinner = () => {
  return (
    <Icons.loading className="text-muted-foreground size-3 animate-spin" />
  )
}


export const LineSpinner = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex items-center gap-2 text-muted-foreground text-sm '>
      <Icons.loading className="size-3 inline-block animate-spin" /> {children}
    </div>
  )
}