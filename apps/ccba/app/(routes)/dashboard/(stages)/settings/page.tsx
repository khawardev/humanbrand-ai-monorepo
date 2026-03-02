import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { DashboardInnerLayout, DashboardLayoutHeading } from "@/components/stages/ccba/dashboard/shared/DashboardComponents"
import { getCurrentUser } from "@/server/actions/authActions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function Page() {
    const user = await getCurrentUser()
    return (
        <>
            <DashboardLayoutHeading
                title="Settings"
                subtitle="Manage your team, billing, and account preferences"
            />
            <DashboardInnerLayout>
                <div className="col-span-9 space-y-8 rounded-xl p-0.5">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-base font-medium">Team Name</h3>
                            <p className="text-sm text-muted-foreground">Update your team's display name</p>
                        </div>
                        <div className="flex gap-2">
                            <Input defaultValue="Personal" className="max-w-md bg-background" />
                            <Button variant="secondary">Save</Button>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-base font-medium">Invite Team Members</h3>
                            <p className="text-sm text-muted-foreground">Add new members to your team</p>
                        </div>
                        <div className="flex gap-2 max-w-xl">
                            <Input placeholder="Enter email address" className="flex-1 bg-background" />
                            <Button variant="secondary">Send Invite</Button>
                        </div>
                        <p className="text-sm text-muted-foreground">Invited members will receive an email with instructions to join your team.</p>
                    </div>

                    <Separator />


                    {/* Team Members List */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-base font-medium">Team Members</h3>
                            <p className="text-sm text-muted-foreground">Manage your team's access and permissions</p>
                        </div>

                        <div className="flex items-center justify-between p-2 border rounded-lg bg-card/50">
                            <div className="flex items-center gap-2">
                                <Avatar>
                                    <AvatarImage
                                        src={`https://avatar.vercel.sh/${user?.email}.png`}
                                        alt={user?.name || ""}
                                    />
                                    <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium flex items-center gap-2">
                                        {user?.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">{user?.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardInnerLayout>
        </>
    )
}