/**
 * Email notification service
 */

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("SMTP credentials not configured. Email not sent.");
      return false;
    }

    await transporter.sendMail({
      from: `"DAT WEB3 GUY" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ""),
    });

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

export async function sendNotificationEmail(
  email: string,
  title: string,
  message: string,
  airdropTitle?: string,
  airdropSlug?: string
): Promise<boolean> {
  const html = generateEmailTemplate(title, message, airdropTitle, airdropSlug);
  
  return await sendEmail({
    to: email,
    subject: title,
    html,
  });
}

function generateEmailTemplate(
  title: string,
  message: string,
  airdropTitle?: string,
  airdropSlug?: string
): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const airdropLink = airdropSlug ? `${baseUrl}/airdrops/${airdropSlug}` : null;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">DAT WEB3 GUY</h1>
        </div>
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-top: 0;">${title}</h2>
          <p style="color: #4b5563; font-size: 16px;">${message}</p>
          ${airdropLink ? `
            <div style="margin: 30px 0; text-align: center;">
              <a href="${airdropLink}" style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                View Airdrop
              </a>
            </div>
          ` : ""}
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            You're receiving this because you're tracking airdrops on DAT WEB3 GUY.<br>
            <a href="${baseUrl}/dashboard/settings/notifications" style="color: #667eea;">Manage notification preferences</a>
          </p>
        </div>
      </body>
    </html>
  `;
}
