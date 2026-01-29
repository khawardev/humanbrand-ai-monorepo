import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/server/db';
import * as schema from '@/server/db/schema/users-schema';
import { sendEmail } from "@/lib/email";
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema,
    }),
    emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, url }) => {
            const html = `
      <div style="font-family: Inter, sans-serif;">
        <h1>Reset your password</h1>
        <p>Hello <b>${user.name ?? user.email}</b>,</p>
        <p>Click the button below to set a new password:</p>
        <a href="${url}" 
           style="display:inline-block;padding:10px 20px;background:#8FFF00;color:#111;text-decoration:none;border-radius:6px;">
          Reset Password
        </a>
        <p style="margin-top:20px;font-size:14px;color:#666;">
          This link expires in 1 hour. If you didn’t request it, ignore this email.
        </p>
      </div>`;

            await sendEmail({
                to: user.email,
                subject: "Reset your password",
                html,
            });
        },
        onPasswordReset: async ({ user }) => {
            console.log(`Password reset for ${user.email}`);
        },
    },
    socialProviders: {
        google: {
            clientId: process?.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    // session: {
    //     expiresIn: 60 * 60 * 24,
    //     disableSessionRefresh: true
    // }
    session: {
        expiresIn: secondsUntilMidnight(),
        updateAge: 0
    }
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;

function secondsUntilMidnight() {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(now.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    return Math.floor((tomorrow.getTime() - now.getTime()) / 1000)
}