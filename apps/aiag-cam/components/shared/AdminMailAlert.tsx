import { getUser } from '@/server/actions/usersActions'
import React from 'react'
import { Alert, AlertTitle } from "@/components/ui/alert";
import { MdOutlineMailLock } from "react-icons/md"

const AdminMailAlert = async () => {
    const user: any = await getUser();


    if (!user) return <Alert variant={'destructive'}>
        <MdOutlineMailLock />
        <AlertTitle>Please Login to Access AIAG CAM 26.2</AlertTitle>
    </Alert>;

    return (
        <>
            {!user?.adminVerified && (
                <Alert variant={'destructive'}>
                    <MdOutlineMailLock />
                    <AlertTitle>Wait for Admin Approval</AlertTitle>
                </Alert>
            )}
        </>

    )
}

export default AdminMailAlert