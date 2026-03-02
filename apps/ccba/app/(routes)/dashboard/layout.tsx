import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { LeftSidebar } from "@/components/shared/sidebar/left-sidebar"
import { getCurrentUser } from "@/server/actions/authActions"
import { ThemeSwitcher } from "@/components/ui/theme-switcher"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();
    return (
        <SidebarProvider>
            <LeftSidebar user={user} />
            <SidebarInset>
                <header className="flex w-full h-16 shrink-0 items-center gap-2 border-b px-6 transition-[width,height] ease-linear  dark:bg-accent/40 bg-background rounded-tl-xl rounded-tr-xl  ">
                    <div className="flex items-center gap-2 mr-auto">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="h-7" />
                        <p className="text-muted-foreground text-sm">BrandOS V2.1</p>

                        {/* <TeamDropdown /> */}
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeSwitcher />
                    </div>
                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}