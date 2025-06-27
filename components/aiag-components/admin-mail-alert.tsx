// 'use client';

// import React, { useEffect, useState } from 'react';
// import { Alert, AlertTitle } from "@/components/ui/alert";
// import { MdOutlineMailLock } from "react-icons/md";
// import { getUser } from '@/actions/users-actions';

// const AdminMailAlert = () => {
//     const [user, setUser] = useState<any>(null);

//     useEffect(() => {
//         const fetchUser = async () => {
//             const fetchedUser = await getUser();
//             console.log(fetchedUser, `<-> fetchedUser <->`);

//             setUser(fetchedUser);
//         };

//         fetchUser();
//     }, []);

//     if (!user) return <Alert variant={'destructive'}>
//         <MdOutlineMailLock />
//         <AlertTitle>Please Login to Access AIAG CAM 25.1</AlertTitle>
//     </Alert>;


//     return (
//         user?.adminVerified === false && (
//             <Alert variant={'destructive'}>
//                 <MdOutlineMailLock />
//                 <AlertTitle>Please wait for the Admin to Approve {user?.admemailVerifiedinVerified}</AlertTitle>
//             </Alert>
//         )
//     );
// };

// export default AdminMailAlert;




import { getUser } from '@/actions/users-actions'
import React from 'react'
import { Alert, AlertTitle } from "@/components/ui/alert";
import { MdOutlineMailLock } from "react-icons/md"

const AdminMailAlert = async () => {
    const user: any = await getUser();


    if (!user) return <Alert variant={'destructive'}>
        <MdOutlineMailLock />
        <AlertTitle>Please Login to Access AIAG CAM 25.1</AlertTitle>
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