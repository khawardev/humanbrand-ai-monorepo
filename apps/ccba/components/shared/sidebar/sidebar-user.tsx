'use client'

import { useState } from 'react'
import { ChevronsUpDown, Book, FileText, Settings, Globe, CreditCard, LogOut } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RiUserSmileLine } from "react-icons/ri"
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { logout } from '@/server/actions/authActions'

export default function SidebarUser({ user }: any ) {
  const [open, setOpen] = useState(false)
  const router = useRouter();

  const handleLogout = async () => {
    const { success, message } = await logout();
    if (!success) return toast.error(message);

    router.push("/login");
    toast.success(message);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar>
            <AvatarImage
              src={`https://avatar.vercel.sh/${user?.email}.png`}
              alt={user?.name || ""}
            />
            <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user?.name}</span>
            <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
          </div>

          <ChevronsUpDown className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-60 ml-3" side="top" align="end" sideOffset={4}>
        <DropdownMenuLabel label="Account" rootOpenSetter={setOpen} />
        <DropdownMenuSeparator />

        <DropdownMenuItem className="dark:bg-border bg-accent">
          <div className="flex items-center gap-2 text-left text-sm">
            <Avatar>
              <AvatarImage src={`https://avatar.vercel.sh/${user?.email}.png`} alt={user?.name || ""} />
              <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user?.name}</span>
              <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
            </div>
          </div>
          <div className="ml-auto size-2 rounded-full bg-primary" />
        </DropdownMenuItem>
        {/* <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href='/dashboard/profile'><RiUserSmileLine /> Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href='/dashboard/blog'><Book /> Blog</Link>
          </DropdownMenuItem> 
        </DropdownMenuGroup> */}
        {/* <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href='/dashboard/settings'><Settings />  Settings</Link>
          </DropdownMenuItem> */}
        {/* <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Globe /> Domain checker
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings /> Account Settings
          </DropdownMenuItem>
        </DropdownMenuGroup> */}

        <DropdownMenuSeparator />
        {/* <DropdownMenuGroup>
         <DropdownMenuItem>
            <FileText /> Documentation
          </DropdownMenuItem> 
          <DropdownMenuItem>
            <CreditCard /> Manage Subscriptions
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator /> */}

        <DropdownMenuItem variant="destructive" onClick={handleLogout}>
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}