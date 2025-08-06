"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = sendVerificationEmail;
const resend_1 = require("resend");
async function sendVerificationEmail(email, token, isUserSetup) {
    const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
    const route = isUserSetup
        ? `user-setup?setup_account_token=${token}`
        : `verify-email?verificationToken=${token}`;
    const verificationUrl = `${process.env.WEB_APP_ROUTE}/${route}&user_email=${email}`;
    return await resend.emails.send({
        from: "PM Tracker <no-reply_onboarding@resend.dev>", // must be verified in Resend
        // to: email,
        to: "frnkmendoza101@gmail.com", // for testing purposes
        subject: isUserSetup ? "Setup your account" : "Verify your email",
        html: `
          <p>Click the link below to ${isUserSetup ? "verify your email:" : "setup you account"} </p>
          <a href="${verificationUrl}">${verificationUrl}</a>
          <p>This link expires in 1 day.</p>
          `,
    });
}
