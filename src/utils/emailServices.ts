import { Resend } from "resend";

export async function sendVerificationEmail(email: string, token: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const verificationUrl = `${process.env.WEB_APP_ROUTE}/verify-email?verificationToken=${token}`;

  return await resend.emails.send({
    from: "PM Tracker <no-reply_onboarding@resend.dev>", // must be verified in Resend
    // to: email,
    to: "frnkmendoza101@gmail.com", // for testing purposes
    subject: "Verify your email",
    html: `
          <p>Click the link below to verify your email:</p>
          <a href="${verificationUrl}">${verificationUrl}</a>
          <p>This link expires in 1 day.</p>
          `,
  });
}
