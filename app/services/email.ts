import nodemailer from 'nodemailer';

interface EmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // Use true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (params: EmailParams) => {
  const fromName = process.env.SMTP_FROM_NAME;
  const fromEmail = process.env.SMTP_FROM_EMAIL;

  if (!fromName || !fromEmail) {
    console.error('Missing SMTP_FROM_NAME or SMTP_FROM_EMAIL environment variables.');
    throw new Error('Email service is not configured.');
  }

  try {
    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      ...params,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Email sending failed.');
  }
};

const acceptedDemoTemplate = (artistName: string) => ({
  subject: `Congratulations! Your demo has been accepted!`,
  html: `
    <p>Hi ${artistName},</p>
    <p>We are thrilled to inform you that your demo has been accepted by DnB Doctor.</p>
    <p>We were very impressed with your work and we believe it has great potential.</p>
    <p>We will be in touch with you shortly to discuss the next steps.</p>
    <p>Best regards,</p>
    <p>The DnB Doctor Team</p>
  `,
  text: `Hi ${artistName},\n\nWe are thrilled to inform you that your demo has been accepted by DnB Doctor.\n\nWe were very impressed with your work and we believe it has great potential.\n\nWe will be in touch with you shortly to discuss the next steps.\n\nBest regards,\nThe DnB Doctor Team`,
});

const rejectedDemoTemplate = (artistName: string, notes?: string) => ({
    subject: `Update on your DnB Doctor Demo Submission`,
    html: `
      <p>Hi ${artistName},</p>
      <p>Thank you for submitting your demo to DnB Doctor. We appreciate you taking the time to share your music with us.</p>
      <p>After careful consideration, we have decided not to move forward with your submission at this time.</p>
      ${notes ? `<p><strong>Feedback from our A&R team:</strong></p><p><em>${notes}</em></p>` : ''}
      <p>Music is subjective, and this decision doesn't diminish your talent. We receive many submissions, and our selection process is very competitive. Please don't be discouraged.</p>
      <p>We encourage you to continue honing your craft and wish you the best of luck in your musical journey.</p>
      <p>Best regards,</p>
      <p>The DnB Doctor Team</p>
    `,
    text: `Hi ${artistName},\n\nThank you for submitting your demo to DnB Doctor. We appreciate you taking the time to share your music with us.\n\nAfter careful consideration, we have decided not to move forward with your submission at this time.\n\n${notes ? `Feedback from our A&R team:\n${notes}\n\n` : ''}Music is subjective, and this decision doesn't diminish your talent. We receive many submissions, and our selection process is very competitive. Please don't be discouraged.\n\nWe encourage you to continue honing your craft and wish you the best of luck in your musical journey.\n\nBest regards,\nThe DnB Doctor Team`,
  });

interface DemoSubmissionDetails {
    email: string;
    artistName: string;
    status: 'APPROVED' | 'REJECTED';
    notes?: string;
}

export const sendDemoStatusUpdateEmail = async (submission: DemoSubmissionDetails) => {
    const { email, artistName, status, notes } = submission;
    let template;

    if (status === 'APPROVED') {
        template = acceptedDemoTemplate(artistName);
    } else if (status === 'REJECTED') {
        template = rejectedDemoTemplate(artistName, notes);
    } else {
        return; 
    }

    await sendEmail({
        to: email,
        ...template,
    });
};
