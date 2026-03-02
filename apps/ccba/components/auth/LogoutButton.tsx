"use client";

import { logout } from "@/server/actions/authActions";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const { success, message } = await logout();
    if (!success) return toast.error(message);

    router.push("/login");
    toast.success(message);
  };

  return (
    <Button
      variant={'destructive'}
      onClick={handleLogout}
    >
      Sign out
    </Button>
  );
}
