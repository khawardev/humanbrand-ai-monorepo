'use client'; 

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { MdError, MdOutlineNoEncryptionGmailerrorred } from 'react-icons/md';

type AccessDeniedProps = {
    redirectDelay?: number; 
};

export default function AccessDenied({ redirectDelay = 2000 }: AccessDeniedProps) {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/'); 
        }, redirectDelay);
        return () => clearTimeout(timer);
    }, [router, redirectDelay]); 

    return (
        <div className="flex flex-col justify-center  space-y-3 items-center h-[75vh] text-center">
            <MdOutlineNoEncryptionGmailerrorred className=' text-accent-foreground/70 size-14' />
            <h3 className='text-accent-foreground/70'>Access Denied</h3>
            <h5 className='text-accent-foreground/70'>You do not have the required permissions to view this page.</h5>
        </div>
    );
}