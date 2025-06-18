'use client'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOutIcon } from 'lucide-react'
import { signOut } from '@/lib/auth-client'
import { useRouter } from "next/navigation"

const UserMenu = ({ user }: any) => {
  console.log(user,'<-> user <->');
  
  const router = useRouter()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className=" hover:cursor-pointer">
          <AvatarImage src={user.image&&user.image} alt="Profile image" />
          <AvatarFallback>{user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64" align="end">
        <DropdownMenuLabel className="flex gap-2 items-center min-w-0 ">
          <img src={user?.image} className="size-8 rounded-md" alt="" />
          <div className="flex flex-col">
            <span className="text-foreground tracking-tight truncate text-sm font-medium">
              {user?.name}
            </span>
            <span className="text-xs w-[85%] overflow-hidden text-muted-foreground text-ellipsis whitespace-wrap font-normal">
              {user?.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={async () => {
          await signOut();
          router.refresh();
        }}>
          <LogOutIcon size={16} className="opacity-60 mr-2" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export default UserMenu
