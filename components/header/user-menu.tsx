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
import { signOut } from '@/lib/auth/auth-client'
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
      <DropdownMenuContent className="max-w-48" align="end">
        <DropdownMenuItem className="flex gap-2 items-center ">
          <Avatar className="border border-input">
            <AvatarImage src={user.image && user.image || `https://avatar.vercel.sh/${user.email}.png`} alt="Profile image" />
            <AvatarFallback>{user.name?.slice(0, 1).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden min-w-0">
            <span title={user?.name} className="text-foreground tracking-tight truncate text-sm font-medium">
              {user?.name}
            </span>
            <span title={user?.email} className="text-sm text-muted-foreground  truncate font-normal">
              {user?.email}
            </span>
          </div>
        </DropdownMenuItem>
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
