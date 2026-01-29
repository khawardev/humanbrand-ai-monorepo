import { getUser } from '@/server/actions/users-actions'
import React from 'react'
import { Alert, AlertTitle } from "@/components/ui/alert";
import { MdOutlineMailLock } from "react-icons/md"

const AdminMailAlert = async () => {
    const user: any = await getUser();


    if (!user) return <Alert variant={'destructive'}>
        <MdOutlineMailLock />
        <AlertTitle>Please Login to Access AIAG CAM 26.1</AlertTitle>
    </Alert>;

    return (
        <>
            {user?.adminVerified === false && (
                <Alert variant={'destructive'}>
                    <MdOutlineMailLock />
                    <AlertTitle>Please wait for the Admin to Approve</AlertTitle>
                </Alert>
            )}
        </>

    )
}

export default AdminMailAlert