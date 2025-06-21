import { LuLoaderCircle } from 'react-icons/lu'
const Spinner = ({className}:any) => {
  return (
    <LuLoaderCircle className={` ${className} animate-spin text-muted-foreground`} />
  )
}

export default Spinner