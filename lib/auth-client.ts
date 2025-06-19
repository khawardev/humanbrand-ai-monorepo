import { createAuthClient } from 'better-auth/react';
import { config } from "dotenv";
config({ path: ".env.local" });
export const authClient = createAuthClient({
    baseURL: 'https://aiag-content-action-model-3-3.vercel.app',
});

// export const authClient = createAuthClient({
//     baseURL: process.env.NODE_ENV === 'production'
//         ? process.env.BETTER_AUTH_PROD_URL
//         : 'http://localhost:3000',
// });

export const {
    signIn,
    signUp,
    signOut,
    useSession,
    updateUser,
} = authClient;