import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL!,
    secret: process.env.BETTER_AUTH_SECRET!,
});

export const {
    signIn,
    signUp,
    signOut,
    useSession,
    updateUser,
} = authClient;