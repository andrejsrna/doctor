import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/lib/auth";

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
  wpPostId?: number;
}

// helper not needed anymore; paths normalized inline

  const renderDemoEmailHTML = ({
    subject,
    body,
    feedbackLink,
    baseUrl,
    fileNames = [] as string[],
    fileLinks = [] as Array<{ name: string; url: string }>,
    releaseLink,
  }: { subject: string; body: string; feedbackLink: string; baseUrl: string; fileNames?: string[]; fileLinks?: Array<{ name: string; url: string }>; releaseLink?: { title: string; url: string } | null; }) => {
    const logo = `${baseUrl.replace(/\/$/, '')}/logo.png`;
    const safeBody = (body || '').split('\n').map(p => `<p style="margin:0 0 16px;">${p.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</p>`).join('');
    const filesList = (fileLinks.length > 0)
      ? `<ul style="padding-left:18px;margin:0 0 16px;">${fileLinks.map(f => {
            const safeName = (f.name || '').replace(/</g,'&lt;').replace(/>/g,'&gt;')
            const safeUrl = (f.url || '').replace(/"/g,'%22')
            return `<li style=\"color:#a855f7;\"><a href="${safeUrl}" style="color:#a855f7;text-decoration:underline;">${safeName}</a></li>`
          }).join('')}</ul>`
      : (fileNames.length
        ? `<ul style="padding-left:18px;margin:0 0 16px;">${fileNames.map(n => `<li style=\"color:#a855f7;\">${n.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</li>`).join('')}</ul>`
        : '');
    const releaseBlock = releaseLink && releaseLink.url
      ? `<div style="margin:16px 0;padding:12px;border:1px solid #3b0764;border-radius:10px;background:#0b0b0b;">
           <div style="font-family:Arial, Helvetica, sans-serif;font-size:14px;color:#e5e7eb;margin-bottom:8px;">Related Release</div>
           <a href="${releaseLink.url}" style="color:#60a5fa;text-decoration:underline;font-family:Arial, Helvetica, sans-serif;">${(releaseLink.title||'View release').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</a>
         </div>`
      : '';

    return `<!doctype html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${subject}</title>
    <style>
      .preheader { display: none !important; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0; overflow: hidden; }
      @media (prefers-color-scheme: dark) { .bg { background:#000!important; } .card { background:#0b0b0b!important; } }
    </style>
  </head>
  <body class="bg" style="margin:0;padding:0;background:#000;color:#fff;">
    <span class="preheader">New demo from DnB Doctor – we’d love your feedback.</span>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#000;">
      <tr>
        <td align="center" style="padding:24px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;">
            <tr>
              <td align="center" style="padding:8px 0 24px;">
                <img src="${logo}" width="96" height="auto" alt="DnB Doctor" style="display:block;border:0;outline:none;text-decoration:none;" />
              </td>
            </tr>
            <tr>
              <td class="card" style="background:#0d0d0d;border:1px solid #3b0764;border-radius:12px;padding:24px;">
                <h1 style="margin:0 0 12px;font-size:22px;line-height:28px;color:#a855f7;font-family:Arial, Helvetica, sans-serif;">${subject}</h1>
                <div style="font-family:Arial, Helvetica, sans-serif;font-size:14px;line-height:22px;color:#e5e7eb;">
                  ${safeBody}
                  ${filesList}
                  ${releaseBlock}
                </div>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 8px;">
                  <tr>
                    <td align="center" bgcolor="#16a34a" style="border-radius:10px;">
                      <a href="${feedbackLink}" target="_blank" style="display:inline-block;padding:12px 18px;font-family:Arial, Helvetica, sans-serif;font-size:14px;color:#000;background:#22c55e;text-decoration:none;border-radius:10px;font-weight:bold;">
                        Review & Give Feedback
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:18px;color:#9ca3af;">If the button doesn’t work, copy & paste this link:</p>
                <p style="margin:6px 0 0;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:18px;color:#60a5fa;word-break:break-all;">
                  <a href="${feedbackLink}" style="color:#60a5fa;text-decoration:underline;">${feedbackLink}</a>
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:16px 8px;color:#6b7280;font-family:Arial, Helvetica, sans-serif;font-size:12px;">
                © ${new Date().getFullYear()} DnB Doctor
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
 </html>`;
  }

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
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

    const siteBase = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || process.env.NEXTAUTH_URL || ''

    const toAbsoluteUrl = (p: string) => {
      const base = siteBase.replace(/\/$/, '')
      if (!p) return p
      if (p.startsWith('http://') || p.startsWith('https://')) return p
      if (p.startsWith('/')) return `${base}${p}`
      return `${base}/${p}`
    }

    const emailPromises = recipients.map(async (recipient) => {
      try {
        // We no longer send attachments or direct file links in email
        
        // No file processing here; links will be available on the feedback page only

        const subscriber = await prisma.subscriber.findFirst({ where: { email: recipient }, select: { name: true } });
        const displayName: string | undefined = subscriber?.name || undefined;
        let personalizedSubject = emailData.subject.replace(/{name}/g, displayName || "");
        let personalizedMessage = emailData.message.replace(/{name}/g, displayName || "");
        if (!displayName) {
          personalizedMessage = personalizedMessage
            .replace(/(^|\n)\s*Hi\s*,\s*(\n|$)/i, "$1$2")
            .replace(/(^|\n)\s*Hello\s*,\s*(\n|$)/i, "$1$2");
          personalizedSubject = personalizedSubject.replace(/\s*-\s*$/, "").replace(/\s{2,}/g, " ").trim();
        }

        // Create unique feedback token per recipient batch
        const feedbackToken = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
        await prisma.demoFeedback.create({
          data: {
            token: feedbackToken,
            recipientEmail: recipient,
            subject: personalizedSubject,
            message: personalizedMessage,
            files: files.map(f => ({ id: f.id, name: f.name, path: toAbsoluteUrl(f.path) })),
            wpPostId: typeof emailData.wpPostId === 'number' ? emailData.wpPostId : null,
          }
        })

        const feedbackLink = `${siteBase.replace(/\/$/, '')}/demo-feedback?token=${feedbackToken}`

        const base = siteBase
        let releaseLink: { title: string; url: string } | null = null
        if (typeof emailData.wpPostId === 'number' && emailData.wpPostId > 0) {
          try {
            const rel = await prisma.release.findFirst({ where: { wpId: emailData.wpPostId }, select: { title: true, slug: true } })
            if (rel) releaseLink = { title: rel.title, url: `${siteBase.replace(/\/$/, '')}/music/${rel.slug}` }
          } catch {}
        }

        const html = renderDemoEmailHTML({
          subject: personalizedSubject,
          body: personalizedMessage,
          feedbackLink,
          baseUrl: base,
          fileNames: files.map(f => f.name),
          fileLinks: files.map(f => ({ name: f.name, url: toAbsoluteUrl(f.path) })),
          releaseLink
        })

        const firstLink = (files && files.length > 0) ? toAbsoluteUrl(files[0].path) : ''
        const textFiles = files && files.length > 0 ? `\n\nListen/Download: ${firstLink}` : ''
        const textRelease = releaseLink ? `\nRelated Release: ${releaseLink.url}` : ''
        const mailOptions = {
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: recipient,
          subject: personalizedSubject,
          text: `${personalizedMessage}${textFiles}${textRelease}\n\nReview & Give Feedback: ${feedbackLink}`,
          html,
          // No attachments
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