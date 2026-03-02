import VerifyEmail from '@/components/emails/verify-email';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    const { to, subject, username, verifyUrl } = await req.json();
    // const emailHtml = renderToStaticMarkup(
    //     VerifyEmail({ username, verifyUrl })
    // );
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER!,
            pass: process.env.EMAIL_PASS!,
        },
    });

    const mailOptions: any = {
        from: process.env.EMAIL_USER!,
        to,
        subject,
        html: `<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <title>Verify your email</title>


    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

    <style>

      body, p, h1, a, div {
        font-family: 'Inter', sans-serif !important;
      }
    </style>
  </head>
  <body style="background-color: #f3f4f6; font-family: 'Inter', sans-serif; padding: 40px 0;">
    <div style="background-color: #ffffff; border-radius: 8px; padding: 32px; max-width: 600px; margin: 0 auto; font-family: 'Inter', sans-serif;">
      <h1 style="font-size: 18px; font-weight: bold; color: #111827; margin: 0 0 14px; font-family: 'Inter', sans-serif;">
        Verify your email address
      </h1>

      <p style="font-size: 14px; color: #374151; line-height: 24px; margin: 0 0 24px; font-family: 'Inter', sans-serif;">
        Thanks <strong>${username}</strong> for signing up! To complete your registration and secure your account,
        please verify your email address by clicking the button below.
      </p>

      <div style="text-align: center; margin-bottom: 32px;">
        <a href="${verifyUrl}" style="background-color: #8FFF00 ; color: #374151; padding: 6px 13px; border-radius: 6px; font-size: 14px; font-weight: 500; text-decoration: none; display: inline-block; font-family: 'Inter', sans-serif;">
          Verify Email 
        </a>
      </div>

      <p style="font-size: 14px; color: #6b7280; line-height: 20px; margin: 0 0 32px; font-family: 'Inter', sans-serif;">
        This verification link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
      </p>

      <p style="font-size: 13px; color: #6b7280; line-height: 16px; margin: 0; font-family: 'Inter', sans-serif;">
        Best regards,<br />Riz
        
      </p>

      <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
   
        <p style="font-size: 13px; color: #6b7280; line-height: 14px; margin: 8px 0 0; font-family: 'Inter', sans-serif;">
          © 2024 Human Brand AI. All rights reserved.
        </p>
      </div>
    </div>
  </body>
</html>
`,
    };

    try {
        await transporter.sendMail(mailOptions);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error });
    }
}
