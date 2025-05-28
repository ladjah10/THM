import * as fs from 'fs';
import * as path from 'path';
import { MailService } from '@sendgrid/mail';

const mailService = new MailService();

const apiKey = process.env.SENDGRID_API_KEY;
const senderEmail = process.env.EMAIL_SENDER || "hello@wgodw.com";

if (!apiKey) {
  console.warn("⚠️ SendGrid API key not set.");
} else {
  mailService.setApiKey(apiKey);
}

export const sendAssessmentEmail = async (to: string, subject: string, text: string, pdfBuffer: Buffer) => {
  if (!senderEmail) {
    throw new Error("Sender email not configured in EMAIL_SENDER");
  }

  const msg = {
    to,
    from: senderEmail,
    subject,
    text,
    attachments: [
      {
        content: pdfBuffer.toString("base64"),
        filename: "AssessmentReport.pdf",
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
  };

  try {
    await mailService.send(msg);
    console.log("✅ Email sent to", to);
    return { success: true };
  } catch (err) {
    console.error("❌ Email failed:", err);
    return { success: false, error: err };
  }
};