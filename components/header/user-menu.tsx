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
import { signOut } from '@/lib/better-auth/auth-client'
import { useRouter } from "next/navigation"
import { Skeleton } from "../ui/skeleton"

const UserMenu = ({ user }: any) => {
  if (!user) return <Skeleton />;
  const router = useRouter()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="border border-input hover:cursor-pointer">
          <AvatarImage src={user.image && user.image || `https://avatar.vercel.sh/${user.email}.png`} alt="Profile image" />
          <AvatarFallback>{user.name?.slice(0, 1).toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-4" align="end">
        <DropdownMenuLabel className="flex gap-2 items-center ">
          <Avatar className="border border-input">
            <AvatarImage src={user.image && user.image || `https://avatar.vercel.sh/${user.email}.png`} alt="Profile image" />
          <AvatarFallback>{user.name?.slice(0, 1).toUpperCase()}</AvatarFallback>
        </Avatar>
          <div className="flex flex-col ">
            <span className="text-foreground tracking-tight truncate text-sm font-medium">
              {user?.name}
            </span>
            <span className="text-xs overflow-hidden text-muted-foreground text-ellipsis whitespace-wrap font-normal">
              {user?.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={async () => {
          await signOut();
          router.refresh();
        }}>
          <LogOutIcon size={16} className="opacity-60 mr-1" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export default UserMenu
