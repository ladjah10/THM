// Uses SendGrid to send PDF results

import sgMail from "@sendgrid/mail";

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendAssessmentEmail = async (
  to: string,
  pdfBuffer: Buffer,
  result: any
) => {
  const msg = {
    to,
    from: "hello@wgodw.com",
    subject: "Your Simulated 100 Marriage Assessment",
    text: "Attached is your full PDF results from the simulated test.",
    html: `
      <h2>Simulated Assessment Results</h2>
      <p><strong>Overall Score:</strong> ${result.scores?.overallPercentage?.toFixed(1)}%</p>
      <p><strong>Primary Profile:</strong> ${result.profile?.name || 'Not determined'}</p>
      <p>Please find the complete assessment report attached.</p>
    `,
    attachments: [
      {
        content: pdfBuffer.toString("base64"),
        filename: "simulated-assessment.pdf",
        type: "application/pdf",
        disposition: "attachment"
      }
    ]
  };

  await sgMail.send(msg);
};