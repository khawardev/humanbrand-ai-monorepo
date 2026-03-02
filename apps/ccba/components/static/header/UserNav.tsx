"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logout } from "@/server/actions/authActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon, Building } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types";
import { CiUser } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa6";
import { TiUserOutline } from "react-icons/ti";
import { GiEgyptianProfile } from "react-icons/gi";
import { RiUserSmileLine } from "react-icons/ri";

type UserNavProps = {
  user: User;
};

export function UserNav({ user }: UserNavProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const { success, message } = await logout();
    if (!success) return toast.error(message);

    router.push("/login");
    toast.success(message);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={'icon'} >
          <Avatar >
            <AvatarImage
              src={`https://avatar.vercel.sh/${user.email}.png`}
              alt={user.name || ""}
            />
            <AvatarFallback>
              {user.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={15} className="w-48" align="end" forceMount>
        <div className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={'/dashboard/profile'}>
            <span ><RiUserSmileLine /></span>
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
