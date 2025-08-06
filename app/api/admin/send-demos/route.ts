import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { readFile } from "fs/promises";
import { join } from "path";
import { prisma } from "@/lib/prisma";

interface DemoFile {
  id: string;
  name: string;
  size: number;
  type: string;
  path: string;
  uploadedAt: string;
}

interface EmailData {
  subject: string;
  message: string;
  recipients: string;
  newsletterCategory?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { files, emailData }: { files: DemoFile[], emailData: EmailData } = await request.json();

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    if (!emailData.subject || !emailData.message) {
      return NextResponse.json(
        { error: "Subject and message are required" },
        { status: 400 }
      );
    }

    let recipients: string[] = [];

    // Determine recipients based on distribution method
    if (emailData.newsletterCategory) {
      // Get subscribers from newsletter category
      const categorySubscribers = await prisma.subscriber.findMany({
        where: {
          categoryId: emailData.newsletterCategory,
          status: "ACTIVE"
        }
      });
      recipients = categorySubscribers.map(sub => sub.email);
    } else if (emailData.recipients) {
      // Use manual email list
      recipients = emailData.recipients
        .split(',')
        .map(email => email.trim())
        .filter(email => email.length > 0);
    }

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: "No valid recipients provided" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const emailPromises = recipients.map(async (recipient) => {
      try {
        const attachments = [];
        
        for (const file of files) {
          if (file.path) {
            try {
              const filePath = join(process.cwd(), "public", file.path);
              const fileBuffer = await readFile(filePath);
              
              attachments.push({
                filename: file.name,
                content: fileBuffer,
                contentType: file.type
              });
            } catch (error) {
              console.error(`Failed to read file ${file.path}:`, error);
            }
          }
        }

        // Personalize message for newsletter subscribers
        let personalizedSubject = emailData.subject;
        let personalizedMessage = emailData.message;

        if (emailData.newsletterCategory) {
          const subscriber = await prisma.subscriber.findFirst({
            where: { email: recipient }
          });
          if (subscriber?.name) {
            personalizedSubject = personalizedSubject.replace(/{name}/g, subscriber.name);
            personalizedMessage = personalizedMessage.replace(/{name}/g, subscriber.name);
          }
        }

        const mailOptions = {
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: recipient,
          subject: personalizedSubject,
          text: personalizedMessage,
          html: personalizedMessage.replace(/\n/g, '<br>'),
          attachments
        };

        await transporter.sendMail(mailOptions);
        return { recipient, success: true };
      } catch (error) {
        console.error(`Failed to send email to ${recipient}:`, error);
        return { 
          recipient, 
          success: false, 
          error: (typeof error === 'object' && error && 'message' in error) ? (error as { message?: string }).message : String(error)
        };
      }
    });

    const results = await Promise.all(emailPromises);
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    return NextResponse.json({
      success: true,
      message: `Demos sent to ${successful.length} recipients successfully`,
      results: {
        successful: successful.length,
        failed: failed.length,
        total: recipients.length,
        details: results
      }
    });

  } catch (error) {
    console.error("Error sending demos:", error);
    return NextResponse.json(
      { error: "Failed to send demos" },
      { status: 500 }
    );
  }
} 