import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    site: "https://hire-flow-last-fv7m44pjy-bryan-tiamzons-projects.vercel.app",
  },
});

// Configure custom email template
const emailTemplate = {
  CONFIRM_SIGNUP: {
    subject: "Welcome to HireFlow - Email Verification Required",
    content: `
      <!DOCTYPE html>
      <html>
        <body style="margin: 0; padding: 0; background-color: #f7f7f7; font-family: Arial, sans-serif;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; margin-top: 40px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);">
            <tr>
              <td style="padding: 40px 30px; text-align: center;">
                <img src="https://hire-flow-last-fv7m44pjy-bryan-tiamzons-projects.vercel.app/hireflow-logo.ico" alt="HireFlow Logo" style="width: 120px; margin-bottom: 20px;">
                <h1 style="color: #333333; font-size: 24px; margin: 0 0 20px 0;">Verify Your Email Address</h1>
                <p style="color: #666666; font-size: 16px; line-height: 24px; margin-bottom: 30px;">
                  Thank you for creating a HireFlow account. To get started, please verify your email address by clicking the button below:
                </p>
                <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 14px 36px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; margin-bottom: 30px;">Verify Email Address</a>
                <p style="color: #666666; font-size: 14px; line-height: 20px;">
                  If you did not create a HireFlow account, please disregard this email.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px 30px; text-align: center; background-color: #f8fafc; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                <p style="color: #666666; font-size: 12px; margin: 0;">
                  &copy; ${new Date().getFullYear()} HireFlow. All rights reserved.<br>
                  This is an automated email, please do not reply.
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  },
};

// Apply the email template
supabase.auth.setConfig({
  emailAuth: {
    emailTemplate,
  },
});
