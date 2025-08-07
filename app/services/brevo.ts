export async function sendFreeTrackEmail(params: {
  toEmail: string;
  toName?: string;
  downloadUrl: string;
}) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'no-reply@dnbdoctor.com';
  const senderName = process.env.BREVO_SENDER_NAME || 'DNB Doctor';

  if (!apiKey) {
    throw new Error('Email service not configured');
  }

  const html = `
  <div style="background:#0b0b0f;margin:0;padding:0">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#0b0b0f">
      <tr>
        <td align="center" style="padding:32px 16px">
          <table role="presentation" cellpadding="0" cellspacing="0" width="640" style="max-width:640px;background:linear-gradient(180deg,#0b0b0f 0%,#14121a 100%);border:1px solid rgba(124,58,237,0.25);border-radius:16px;overflow:hidden">
            <tr>
              <td style="padding:28px 28px 0 28px;text-align:center">
                <img src="https://dnbdoctor.com/logo.png" alt="DNB Doctor" width="64" height="64" style="display:block;margin:0 auto 8px" />
                <h1 style="margin:0;color:#fff;font-family:Inter,Arial,sans-serif;font-size:24px;letter-spacing:.5px">Your Free Track</h1>
                <p style="margin:8px 0 0;color:#c4b5fd;font-family:Inter,Arial,sans-serif;font-size:14px">Welcome to the infection.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px 0 28px">
                <div style="background:rgba(124,58,237,0.08);border:1px solid rgba(124,58,237,0.25);border-radius:12px;padding:18px">
                  <p style="margin:0 0 10px;color:#e5e7eb;font-family:Inter,Arial,sans-serif;font-size:15px">Click below to download your WAV:</p>
                  <a href="${params.downloadUrl}" style="display:inline-block;background:#7c3aed;color:#fff;text-decoration:none;padding:12px 18px;border-radius:10px;font-family:Inter,Arial,sans-serif;font-weight:600">Download “Hold Me”</a>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px 0 28px">
                <p style="margin:0;color:#9ca3af;font-family:Inter,Arial,sans-serif;font-size:13px;line-height:1.6">If the button doesn’t work, copy this link:</p>
                <p style="margin:8px 0 0;color:#a78bfa;font-family:Inter,Arial,sans-serif;font-size:12px;word-break:break-all">${params.downloadUrl}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px 0 28px">
                <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px">
                  <h2 style="margin:0 0 10px;color:#fff;font-family:Inter,Arial,sans-serif;font-size:18px">Next up</h2>
                  <ul style="margin:0;padding-left:18px;color:#d1d5db;font-family:Inter,Arial,sans-serif;font-size:14px;line-height:1.8">
                    <li>Follow our Starter Playlist for essentials</li>
                    <li>Stay subscribed for early promos and exclusives</li>
                    <li>Reply with your feedback — we read everything</li>
                  </ul>
                  <div style="margin-top:12px">
                    <a href="https://open.spotify.com/playlist/2GD72ly17HcWc9OAEtdUBP?si=dbd0eaf2c4984e1f" style="display:inline-block;background:#14b8a6;color:#0b0b0f;text-decoration:none;padding:10px 14px;border-radius:10px;font-family:Inter,Arial,sans-serif;font-weight:600">Follow Starter Playlist</a>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px 0 28px">
                <h3 style="margin:0 0 8px;color:#fff;font-family:Inter,Arial,sans-serif;font-size:16px">Essentials</h3>
                <p style="margin:0 0 8px;color:#9ca3af;font-family:Inter,Arial,sans-serif;font-size:13px">Start with these and explore more on our site:</p>
                <ul style="margin:0;padding-left:18px;color:#c7d2fe;font-family:Inter,Arial,sans-serif;font-size:13px;line-height:1.9">
                  <li><a href="https://dnbdoctor.com/news" style="color:#a78bfa;text-decoration:none">Latest News</a></li>
                  <li><a href="https://dnbdoctor.com/music" style="color:#a78bfa;text-decoration:none">Latest Releases</a></li>
                  <li><a href="https://dnbdoctor.com/sample-packs" style="color:#a78bfa;text-decoration:none">Sample Packs</a></li>
                </ul>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px 28px 28px;text-align:center">
                <p style="margin:0 0 12px;color:#9ca3af;font-family:Inter,Arial,sans-serif;font-size:12px">Follow for more drops</p>
                <div>
                  <a href="https://instagram.com/dnbdoctor" style="color:#c4b5fd;text-decoration:none;margin-right:10px">Instagram</a>
                  <a href="https://open.spotify.com/playlist/2GD72ly17HcWc9OAEtdUBP?si=dbd0eaf2c4984e1f" style="color:#c4b5fd;text-decoration:none;margin-right:10px">Spotify</a>
                  <a href="https://youtube.com/@dnbdoctor1" style="color:#c4b5fd;text-decoration:none">YouTube</a>
                </div>
              </td>
            </tr>
          </table>
          <p style="margin:16px 0 0;color:#6b7280;font-family:Inter,Arial,sans-serif;font-size:11px">© DNB Doctor • You received this because you subscribed. Unsubscribe anytime.</p>
        </td>
      </tr>
    </table>
  </div>`;

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      sender: { email: senderEmail, name: senderName },
      to: [{ email: params.toEmail, name: params.toName || undefined }],
      subject: 'Your free track – DNB Doctor',
      htmlContent: html,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Brevo send failed: ${res.status} ${text}`);
  }
}


