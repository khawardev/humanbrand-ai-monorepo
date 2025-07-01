import { cache } from 'react';
import { headers } from 'next/headers';
import { auth } from '@/lib/better-auth/auth';

export const getSession = cache(async () => {
    const session = await auth?.api?.getSession({ headers: await headers() });
    return session;
});