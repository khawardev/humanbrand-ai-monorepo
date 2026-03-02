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

const UserMenu = ({ user }: { user: any }) => {
    const router = useRouter()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar className=" hover:cursor-pointer rounded-full">
                    <AvatarImage src={user.image && user.image} className=" rounded-full" alt="Profile image" />
                    <AvatarFallback>{user.name?.slice(0, 1).toUpperCase()}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={async () => {
                    await signOut();
                    router.refresh();
                }}>
                    <LogOutIcon size={16} className="opacity-60 " />
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
export default UserMenu