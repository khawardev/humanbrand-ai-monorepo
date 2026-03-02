import React from 'react'
import { LogoutButton } from "@/components/auth/LogoutButton";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

const ProfileComp = ({ user }:any) => {
  return (
      <div className="w-full space-y-6">
          
          <Card className=" p-5">
              <div className="flex justify-between">
                  <p className="text-muted-foreground">Name</p>
                  <p>{user.name}</p>
              </div>
              <Separator />
              <div className="flex justify-between">
                  <p className="text-muted-foreground">Email</p>
                  <p>{user.email}</p>
              </div>
          </Card>
          <div className="flex justify-end">
              <LogoutButton />
          </div>
      </div>
  )
}

export default ProfileComp