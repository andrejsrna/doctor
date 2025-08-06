import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

interface EmailData {
  subject: string;
  message: string;
  template?: string;
}

interface Subscriber {
  id: string;
  email: string;
  name?: string;
  status: string;
  categoryId?: string;
  tags?: string[];
  notes?: string;
  emailCount?: number;
  lastEmailSent?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { subscribers, emailData }: { subscribers: Subscriber[], emailData: EmailData } = await request.json();

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json(
        { error: "No subscribers provided" },
        { status: 400 }
      );
    }

    if (!emailData.subject || !emailData.message) {
      return NextResponse.json(
        { error: "Subject and message are required" },
        { status: 400 }
      );
    }

    // Create email campaign record
    const campaign = await prisma.emailCampaign.create({
      data: {
        name: `Newsletter - ${new Date().toLocaleDateString()}`,
        subject: emailData.subject,
        body: emailData.message,
        sentAt: new Date(),
        sentCount: subscribers.length
      }
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const emailPromises = subscribers.map(async (subscriber) => {
      try {
        // Personalize message for each subscriber
        let personalizedSubject = emailData.subject;
        let personalizedMessage = emailData.message;

        // Replace placeholders with subscriber data
        if (subscriber.name) {
          personalizedSubject = personalizedSubject.replace(/{name}/g, subscriber.name);
          personalizedMessage = personalizedMessage.replace(/{name}/g, subscriber.name);
        }
        
        personalizedSubject = personalizedSubject.replace(/{email}/g, subscriber.email);
        personalizedMessage = personalizedMessage.replace(/{email}/g, subscriber.email);

        const mailOptions = {
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: subscriber.email,
          subject: personalizedSubject,
          text: personalizedMessage,
          html: personalizedMessage.replace(/\n/g, '<br>'),
        };

        await transporter.sendMail(mailOptions);

        // Create email log record
        await prisma.emailLog.create({
          data: {
            campaignId: campaign.id,
            subscriberId: subscriber.id,
            email: subscriber.email,
            status: "SENT",
            sentAt: new Date()
          }
        });

        // Update subscriber's email count and last sent date
        await prisma.subscriber.update({
          where: { id: subscriber.id },
          data: {
            emailCount: { increment: 1 },
            lastEmailSent: new Date()
          }
        });

        return { subscriber: subscriber.email, success: true };
      } catch (error) {
        console.error(`Failed to send email to ${subscriber.email}:`, error);
        
        // Create email log record for failed email
        await prisma.emailLog.create({
          data: {
            campaignId: campaign.id,
            subscriberId: subscriber.id,
            email: subscriber.email,
            status: "FAILED",
            error: (typeof error === 'object' && error && 'message' in error) ? (error as { message?: string }).message : String(error)
          }
        });

        return { 
          subscriber: subscriber.email, 
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
      message: `Newsletter sent to ${successful.length} subscribers successfully`,
      campaignId: campaign.id,
      results: {
        successful: successful.length,
        failed: failed.length,
        total: subscribers.length,
        details: results
      }
    });

  } catch (error) {
    console.error("Error sending newsletter:", error);
    return NextResponse.json(
      { error: "Failed to send newsletter" },
      { status: 500 }
    );
  }
} 