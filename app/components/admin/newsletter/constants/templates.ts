import { type NewsletterTemplateOption } from "../types";

export const NEWSLETTER_TEMPLATE_OPTIONS: NewsletterTemplateOption[] = [
  {
    id: "general-update",
    name: "General Update",
    description: "Share label news, upcoming events, or highlights with every subscriber.",
    subject: "Latest from DnB Doctor",
    preview: "Hey {name}, here is what's new this week at DnB Doctor...",
    body: "Hey {name},\n\nHere is what's new this week at DnB Doctor. We have fresh releases, curated playlists, and exclusive content waiting for you.\n\nStay tuned for more updates and keep the bass rolling!\n\nDnB Doctor Team",
  },
  {
    id: "new-release-spotlight",
    name: "New Release Spotlight",
    description: "Announce a flagship track or compilation with a short call to action.",
    subject: "Fresh Neurofunk Drop Just Landed",
    preview: "Hey {name}, a brand new neurofunk release just landed on DnB Doctor...",
    body: "Hey {name},\n\nA brand new neurofunk release just landed on DnB Doctor and we think you'll love it. Dive into the full release, discover production notes, and let us know what you think.\n\nTurn it up and enjoy the ride!\n\nDnB Doctor Team",
  },
  {
    id: "showcase-official-release",
    name: "DnB Doctor Showcase Release Drop",
    description: "Promote the 26-track showcase mix with hero art, streaming buttons, and platform links.",
    subject: "DnB Doctor Showcase – Official Mix Release",
    preview: "Stream the mix on Spotify or grab the discounted bundle on Beatport.",
    body: `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#050505;padding:8px 12px;font-family:'Helvetica Neue',Arial,sans-serif;color:#E4E8FF;"><tr><td align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;"><tr><td align="center" style="padding:0 0 8px;"><img src="https://dnbdoctor.com/logo.png" alt="DnB Doctor" width="132" style="display:block;border:0;outline:none;text-decoration:none;width:132px;max-width:132px;height:auto;" /></td></tr><tr><td style="background-color:#0b0718;border:1px solid rgba(111,61,255,0.28);border-radius:14px;overflow:hidden;"><img src="https://dnbdoctor.com/newsletter/showcase.jpeg" alt="DnB Doctor Showcase Official Release" width="600" style="display:block;border:0;outline:none;text-decoration:none;width:100%;height:auto;" /><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:18px 22px 20px;"><tr><td style="text-transform:uppercase;letter-spacing:1.6px;color:#74F2CE;font-size:12px;line-height:1.4;padding:0 0 8px;">New Mix</td></tr><tr><td style="padding:0 0 12px;"><h1 style="margin:0;font-size:22px;line-height:1.35;color:#FFFFFF;font-weight:700;">DnB Doctor Showcase – Official Release</h1></td></tr><tr><td style="font-size:14px;line-height:1.6;color:#C9CCFF;padding:0 0 12px;">We made a single mix from the 26 most played tracks on the DnB Doctor label. It's the full story of our roster over the years: relentless drums, razor basslines, and cinematic energy.</td></tr><tr><td style="font-size:14px;line-height:1.6;color:#C9CCFF;padding:0 0 16px;">Stream it on Spotify or pick up every tune from the bundle on Beatport with an exclusive discount. Perfect for the dancefloor, your next podcast, or a road trip with the crew.</td></tr><tr><td align="center" style="padding:0 0 14px;"><table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 auto;"><tr><td align="center" style="padding:0 6px;"><!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://open.spotify.com/user/31l3ju5tfecan4y0uf1zjkvb3bim" style="height:42px;v-text-anchor:middle;width:200px;" arcsize="50%" strokecolor="#1DB954" fillcolor="#1DB954"><w:anchorlock/><center style="color:#050505;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;font-weight:700;">Listen on Spotify</center></v:roundrect><![endif]--><!--[if !mso]><!-- --><a href="https://open.spotify.com/user/31l3ju5tfecan4y0uf1zjkvb3bim" style="display:inline-block;padding:11px 24px;border-radius:999px;background-color:#1DB954;color:#050505;font-size:13px;font-weight:700;text-decoration:none;">Listen on Spotify</a><!--<![endif]--></td><td align="center" style="padding:0 6px;"><!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://www.beatport.com" style="height:42px;v-text-anchor:middle;width:200px;" arcsize="50%" strokecolor="#6F3DFF" fillcolor="#6F3DFF"><w:anchorlock/><center style="color:#050505;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;font-weight:700;">Grab on Beatport</center></v:roundrect><![endif]--><!--[if !mso]><!-- --><a href="https://www.beatport.com" style="display:inline-block;padding:11px 24px;border-radius:999px;background-color:#6F3DFF;color:#050505;font-size:13px;font-weight:700;text-decoration:none;">Grab on Beatport</a><!--<![endif]--></td></tr></table></td></tr><tr><td style="font-size:12px;text-transform:uppercase;color:#74F2CE;padding:4px 0 8px;">What's inside</td></tr><tr><td style="font-size:13px;line-height:1.6;color:#D7DAFF;padding:0 0 12px;">Featuring EmZee, Ventex, Warp Fa2e, Xsonsence, VIRUS & Syn:Thy, Asana, YEHOR, Gouki, and more — the artists that shaped our modern neurofunk sound.</td></tr><tr><td style="font-size:13px;line-height:1.6;color:#74F2CE;">🔊 Full story & release notes:<br /><a href="https://dnbdoctor.com/news/dnb-doctor-showcase-official-release" style="color:#74F2CE;font-weight:600;text-decoration:none;">dnbdoctor.com/news/dnb-doctor-showcase-official-release</a></td></tr></table></td></tr><tr><td align="center" style="padding:18px 0 0;color:#8B92A7;font-size:12px;"><p style="margin:0 0 8px;font-weight:600;color:#C9CCFF;">Follow DnB Doctor</p><table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 auto 4px;"><tr><td style="padding:0 5px;"><a href="https://instagram.com/dnbdoctor" style="color:#74F2CE;text-decoration:none;">Instagram</a></td><td style="padding:0 5px;"><a href="https://www.facebook.com/DnBDoctor" style="color:#74F2CE;text-decoration:none;">Facebook</a></td><td style="padding:0 5px;"><a href="https://www.youtube.com/@DnBDoctor" style="color:#74F2CE;text-decoration:none;">YouTube</a></td><td style="padding:0 5px;"><a href="https://open.spotify.com/user/31l3ju5tfecan4y0uf1zjkvb3bim" style="color:#74F2CE;text-decoration:none;">Spotify</a></td></tr></table><p style="margin:6px 0 4px;font-size:11px;color:#9aa0b8;">#DnBDoctor #ShowcaseMix #Neurofunk</p><p style="margin:0;font-size:11px;color:#6C728A;">You can <a href="{unsubscribeUrl}" style="color:#74F2CE;text-decoration:none;">unsubscribe here</a> or update your preferences.</p></td></tr></table></td></tr></table>`
  },
  {
    id: "mix-vortex-new-year",
    name: "Mix Vortex — New Year Releases",
    description: "10 vydaní od Nového roka + Mix Vortex sekcia so SoundCloud mixom všetkých skladiek.",
    subject: "10 Drops. One Vortex. No Escape.",
    preview: "Every release we dropped since New Year — collected, fused, and mixed into one relentless vortex.",
    body: `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#040410;padding:8px 12px;font-family:'Helvetica Neue',Arial,sans-serif;color:#E4E8FF;"><tr><td align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;">

<!-- LOGO -->
<tr><td align="center" style="padding:12px 0 20px;"><img src="https://dnbdoctor.com/logo.png" alt="DnB Doctor" width="132" style="display:block;border:0;outline:none;text-decoration:none;width:132px;max-width:132px;height:auto;" /></td></tr>

<!-- HERO -->
<tr><td style="background:linear-gradient(150deg,#0b0426 0%,#0d1535 55%,#08101e 100%);border:1px solid rgba(111,61,255,0.4);border-radius:16px;padding:30px 26px 26px;" align="center">
  <p style="margin:0 0 10px;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#74F2CE;font-weight:700;">2026 · Year In Bass</p>
  <h1 style="margin:0 0 14px;font-size:32px;line-height:1.15;color:#FFFFFF;font-weight:800;letter-spacing:-0.5px;">10 Drops.<br /><span style="color:#9B6BFF;">One Vortex.</span><br />No Escape.</h1>
  <p style="margin:0 0 10px;font-size:15px;line-height:1.75;color:#B8BCFF;max-width:460px;">Hey {name} — since the clock hit midnight on January 1st, the lab has been running hot. Ten transmissions pushed into the ether. Ten signals designed to crack speakers, rewire nervous systems, and leave a mark.</p>
  <p style="margin:0;font-size:14px;line-height:1.6;color:#74F2CE;font-style:italic;">Every single one is waiting for you below — and at the bottom, they collide.</p>
</td></tr>

<!-- SECTION TITLE -->
<tr><td style="padding:26px 2px 12px;">
  <p style="margin:0 0 3px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#6F3DFF;font-weight:700;">Transmissions · Jan – Mar 2026</p>
  <h2 style="margin:0;font-size:19px;color:#FFFFFF;font-weight:700;">All Releases This Year</h2>
</td></tr>

<!-- RELEASE 1: Xsonsence - Danger Zone (9 Jan) -->
<tr><td style="padding:0 0 8px;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0d0920;border:1px solid rgba(111,61,255,0.28);border-radius:12px;overflow:hidden;">
    <tr>
      <td width="84" valign="middle" style="padding:12px 0 12px 12px;">
        <img src="https://cdn.dnbdoctor.com/releases/xsonsence-danger-zone/cover-1767955076231-cover.jpg" alt="Danger Zone" width="72" height="72" style="display:block;border-radius:8px;width:72px;height:72px;" />
      </td>
      <td valign="middle" style="padding:12px 12px 12px 10px;">
        <p style="margin:0 0 2px;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#9B6BFF;">Single · Jan 9</p>
        <p style="margin:0 0 3px;font-size:15px;font-weight:700;color:#FFFFFF;">Danger Zone</p>
        <p style="margin:0 0 8px;font-size:12px;color:#7B7FAF;">Xsonsence</p>
        <a href="https://dnbdoctor.com/music/xsonsence-danger-zone" style="display:inline-block;padding:5px 13px;border-radius:999px;background-color:rgba(111,61,255,0.2);border:1px solid rgba(111,61,255,0.45);color:#C9BCFF;font-size:11px;font-weight:600;text-decoration:none;">Listen →</a>
      </td>
    </tr>
  </table>
</td></tr>

<!-- RELEASE 2: Zekjungle - Arrival EP (16 Jan) -->
<tr><td style="padding:0 0 8px;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0b1018;border:1px solid rgba(116,242,206,0.22);border-radius:12px;overflow:hidden;">
    <tr>
      <td width="84" valign="middle" style="padding:12px 0 12px 12px;">
        <img src="https://cdn.dnbdoctor.com/releases/zekjungle-arrival-ep/cover-1768673078641-cover.jpg" alt="Arrival EP" width="72" height="72" style="display:block;border-radius:8px;width:72px;height:72px;" />
      </td>
      <td valign="middle" style="padding:12px 12px 12px 10px;">
        <p style="margin:0 0 2px;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#74F2CE;">EP · Jan 16</p>
        <p style="margin:0 0 3px;font-size:15px;font-weight:700;color:#FFFFFF;">Arrival EP</p>
        <p style="margin:0 0 8px;font-size:12px;color:#7B7FAF;">Zekjungle</p>
        <a href="https://dnbdoctor.com/music/zekjungle-arrival-ep" style="display:inline-block;padding:5px 13px;border-radius:999px;background-color:rgba(116,242,206,0.12);border:1px solid rgba(116,242,206,0.35);color:#74F2CE;font-size:11px;font-weight:600;text-decoration:none;">Listen →</a>
      </td>
    </tr>
  </table>
</td></tr>

<!-- RELEASE 3: The Smell of Males - Bounce EP (23 Jan) -->
<tr><td style="padding:0 0 8px;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0d0920;border:1px solid rgba(111,61,255,0.28);border-radius:12px;overflow:hidden;">
    <tr>
      <td width="84" valign="middle" style="padding:12px 0 12px 12px;">
        <img src="https://cdn.dnbdoctor.com/releases/the-smell-of-males-bounce-ep/cover-1769191921904-cover.jpg" alt="Bounce EP" width="72" height="72" style="display:block;border-radius:8px;width:72px;height:72px;" />
      </td>
      <td valign="middle" style="padding:12px 12px 12px 10px;">
        <p style="margin:0 0 2px;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#9B6BFF;">EP · Jan 23</p>
        <p style="margin:0 0 3px;font-size:15px;font-weight:700;color:#FFFFFF;">Bounce EP</p>
        <p style="margin:0 0 8px;font-size:12px;color:#7B7FAF;">The Smell of Males</p>
        <a href="https://dnbdoctor.com/music/the-smell-of-males-bounce-ep" style="display:inline-block;padding:5px 13px;border-radius:999px;background-color:rgba(111,61,255,0.2);border:1px solid rgba(111,61,255,0.45);color:#C9BCFF;font-size:11px;font-weight:600;text-decoration:none;">Listen →</a>
      </td>
    </tr>
  </table>
</td></tr>

<!-- RELEASE 4: Lyryck - Psycho Rider (6 Feb) -->
<tr><td style="padding:0 0 8px;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0b1018;border:1px solid rgba(116,242,206,0.22);border-radius:12px;overflow:hidden;">
    <tr>
      <td width="84" valign="middle" style="padding:12px 0 12px 12px;">
        <img src="https://cdn.dnbdoctor.com/releases/lyryck-psycho-rider/cover-1770364722465-cover.jpg" alt="Psycho Rider" width="72" height="72" style="display:block;border-radius:8px;width:72px;height:72px;" />
      </td>
      <td valign="middle" style="padding:12px 12px 12px 10px;">
        <p style="margin:0 0 2px;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#74F2CE;">Single · Feb 6</p>
        <p style="margin:0 0 3px;font-size:15px;font-weight:700;color:#FFFFFF;">Psycho Rider</p>
        <p style="margin:0 0 8px;font-size:12px;color:#7B7FAF;">Lyryck</p>
        <a href="https://dnbdoctor.com/music/lyryck-psycho-rider" style="display:inline-block;padding:5px 13px;border-radius:999px;background-color:rgba(116,242,206,0.12);border:1px solid rgba(116,242,206,0.35);color:#74F2CE;font-size:11px;font-weight:600;text-decoration:none;">Listen →</a>
      </td>
    </tr>
  </table>
</td></tr>

<!-- RELEASE 5: South Of Control - Dive Into The Night (20 Feb) -->
<tr><td style="padding:0 0 8px;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0d0920;border:1px solid rgba(111,61,255,0.28);border-radius:12px;overflow:hidden;">
    <tr>
      <td width="84" valign="middle" style="padding:12px 0 12px 12px;">
        <img src="https://cdn.dnbdoctor.com/releases/south-of-control-dive-into-the-night/cover-1771588831720-Borcelle--1-.jpg" alt="Dive Into The Night" width="72" height="72" style="display:block;border-radius:8px;width:72px;height:72px;" />
      </td>
      <td valign="middle" style="padding:12px 12px 12px 10px;">
        <p style="margin:0 0 2px;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#9B6BFF;">Single · Feb 20</p>
        <p style="margin:0 0 3px;font-size:15px;font-weight:700;color:#FFFFFF;">Dive Into The Night</p>
        <p style="margin:0 0 8px;font-size:12px;color:#7B7FAF;">South Of Control</p>
        <a href="https://dnbdoctor.com/music/south-of-control-dive-into-the-night" style="display:inline-block;padding:5px 13px;border-radius:999px;background-color:rgba(111,61,255,0.2);border:1px solid rgba(111,61,255,0.45);color:#C9BCFF;font-size:11px;font-weight:600;text-decoration:none;">Listen →</a>
      </td>
    </tr>
  </table>
</td></tr>

<!-- RELEASE 6: Corbix - Karate (27 Feb) -->
<tr><td style="padding:0 0 8px;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0b1018;border:1px solid rgba(116,242,206,0.22);border-radius:12px;overflow:hidden;">
    <tr>
      <td width="84" valign="middle" style="padding:12px 0 12px 12px;">
        <img src="https://cdn.dnbdoctor.com/releases/corbix-karate/cover-1772213969210-cover.jpg" alt="Karate" width="72" height="72" style="display:block;border-radius:8px;width:72px;height:72px;" />
      </td>
      <td valign="middle" style="padding:12px 12px 12px 10px;">
        <p style="margin:0 0 2px;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#74F2CE;">Single · Feb 27</p>
        <p style="margin:0 0 3px;font-size:15px;font-weight:700;color:#FFFFFF;">Karate</p>
        <p style="margin:0 0 8px;font-size:12px;color:#7B7FAF;">Corbix</p>
        <a href="https://dnbdoctor.com/music/corbix-karate" style="display:inline-block;padding:5px 13px;border-radius:999px;background-color:rgba(116,242,206,0.12);border:1px solid rgba(116,242,206,0.35);color:#74F2CE;font-size:11px;font-weight:600;text-decoration:none;">Listen →</a>
      </td>
    </tr>
  </table>
</td></tr>

<!-- RELEASE 7: Yehor - Good Time (6 Mar) -->
<tr><td style="padding:0 0 8px;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0d0920;border:1px solid rgba(111,61,255,0.28);border-radius:12px;overflow:hidden;">
    <tr>
      <td width="84" valign="middle" style="padding:12px 0 12px 12px;">
        <img src="https://cdn.dnbdoctor.com/releases/yehor-good-time/cover-1772819265281-cover.jpg" alt="Good Time" width="72" height="72" style="display:block;border-radius:8px;width:72px;height:72px;" />
      </td>
      <td valign="middle" style="padding:12px 12px 12px 10px;">
        <p style="margin:0 0 2px;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#9B6BFF;">Single · Mar 6</p>
        <p style="margin:0 0 3px;font-size:15px;font-weight:700;color:#FFFFFF;">Good Time</p>
        <p style="margin:0 0 8px;font-size:12px;color:#7B7FAF;">Yehor</p>
        <a href="https://dnbdoctor.com/music/yehor-good-time" style="display:inline-block;padding:5px 13px;border-radius:999px;background-color:rgba(111,61,255,0.2);border:1px solid rgba(111,61,255,0.45);color:#C9BCFF;font-size:11px;font-weight:600;text-decoration:none;">Listen →</a>
      </td>
    </tr>
  </table>
</td></tr>

<!-- RELEASE 8: OTT (UK) - Fired Up (13 Mar) -->
<tr><td style="padding:0 0 8px;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0b1018;border:1px solid rgba(116,242,206,0.22);border-radius:12px;overflow:hidden;">
    <tr>
      <td width="84" valign="middle" style="padding:12px 0 12px 12px;">
        <img src="https://cdn.dnbdoctor.com/releases/ott-uk-fired-up/cover-1773404413333-cover.jpg" alt="Fired Up" width="72" height="72" style="display:block;border-radius:8px;width:72px;height:72px;" />
      </td>
      <td valign="middle" style="padding:12px 12px 12px 10px;">
        <p style="margin:0 0 2px;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#74F2CE;">Single · Mar 13</p>
        <p style="margin:0 0 3px;font-size:15px;font-weight:700;color:#FFFFFF;">Fired Up</p>
        <p style="margin:0 0 8px;font-size:12px;color:#7B7FAF;">OTT (UK)</p>
        <a href="https://dnbdoctor.com/music/ott-uk-fired-up" style="display:inline-block;padding:5px 13px;border-radius:999px;background-color:rgba(116,242,206,0.12);border:1px solid rgba(116,242,206,0.35);color:#74F2CE;font-size:11px;font-weight:600;text-decoration:none;">Listen →</a>
      </td>
    </tr>
  </table>
</td></tr>

<!-- RELEASE 9: CiDiaH - Rodio (20 Mar) -->
<tr><td style="padding:0 0 8px;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0d0920;border:1px solid rgba(111,61,255,0.28);border-radius:12px;overflow:hidden;">
    <tr>
      <td width="84" valign="middle" style="padding:12px 0 12px 12px;">
        <img src="https://cdn.dnbdoctor.com/releases/cidiah-rodio/cover-1773996632243-cover.jpg" alt="Rodio" width="72" height="72" style="display:block;border-radius:8px;width:72px;height:72px;" />
      </td>
      <td valign="middle" style="padding:12px 12px 12px 10px;">
        <p style="margin:0 0 2px;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#9B6BFF;">Single · Mar 20</p>
        <p style="margin:0 0 3px;font-size:15px;font-weight:700;color:#FFFFFF;">Rodio</p>
        <p style="margin:0 0 8px;font-size:12px;color:#7B7FAF;">CiDiaH</p>
        <a href="https://dnbdoctor.com/music/cidiah-rodio" style="display:inline-block;padding:5px 13px;border-radius:999px;background-color:rgba(111,61,255,0.2);border:1px solid rgba(111,61,255,0.45);color:#C9BCFF;font-size:11px;font-weight:600;text-decoration:none;">Listen →</a>
      </td>
    </tr>
  </table>
</td></tr>

<!-- RELEASE 10: RichArt & Franshrek - KTMN (27 Mar) -->
<tr><td style="padding:0 0 16px;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0b1018;border:1px solid rgba(116,242,206,0.22);border-radius:12px;overflow:hidden;">
    <tr>
      <td width="84" valign="middle" style="padding:12px 0 12px 12px;">
        <img src="https://cdn.dnbdoctor.com/releases/richart-franshrek-ktmn/cover-1774628795406-cover.jpg" alt="KTMN" width="72" height="72" style="display:block;border-radius:8px;width:72px;height:72px;" />
      </td>
      <td valign="middle" style="padding:12px 12px 12px 10px;">
        <p style="margin:0 0 2px;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#74F2CE;">Single · Mar 27</p>
        <p style="margin:0 0 3px;font-size:15px;font-weight:700;color:#FFFFFF;">KTMN</p>
        <p style="margin:0 0 8px;font-size:12px;color:#7B7FAF;">RichArt &amp; Franshrek</p>
        <a href="https://dnbdoctor.com/music/richart-franshrek-ktmn" style="display:inline-block;padding:5px 13px;border-radius:999px;background-color:rgba(116,242,206,0.12);border:1px solid rgba(116,242,206,0.35);color:#74F2CE;font-size:11px;font-weight:600;text-decoration:none;">Listen →</a>
      </td>
    </tr>
  </table>
</td></tr>

<!-- DIVIDER WITH LABEL -->
<tr><td style="padding:0 0 20px;" align="center">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr>
    <td style="border-top:1px solid rgba(116,242,206,0.2);width:40%;"></td>
    <td style="padding:0 14px;white-space:nowrap;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#74F2CE;font-weight:700;">Now Listen Together</td>
    <td style="border-top:1px solid rgba(116,242,206,0.2);width:40%;"></td>
  </tr></table>
</td></tr>

<!-- VORTEX MIX HERO -->
<tr><td style="border-radius:16px;overflow:hidden;border:1px solid rgba(116,242,206,0.35);">
  <img src="https://cdn.dnbdoctor.com/news/vortex/image-1774956552231-vortex.jpg" alt="VORTEX Mix" width="600" style="display:block;width:100%;height:auto;border:0;" />
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:linear-gradient(180deg,#060d1e 0%,#04050f 100%);">
    <tr><td style="padding:24px 24px 8px;" align="center">
      <p style="margin:0 0 8px;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#74F2CE;font-weight:700;">Mix Vortex · 2026</p>
      <h2 style="margin:0 0 12px;font-size:24px;line-height:1.25;color:#FFFFFF;font-weight:800;">All 10 Tracks.<br /><span style="color:#74F2CE;">One Continuous Signal.</span></h2>
      <p style="margin:0 0 18px;font-size:14px;line-height:1.7;color:#9094B8;max-width:420px;">No cuts. No filler. We fed every drop from this year into the machine and let it run. The result is 10 tracks woven into one seamless transmission — neurofunk the way it was meant to be heard.</p>
      <p style="margin:0 0 22px;font-size:13px;color:#74F2CE;font-style:italic;">"Turn it up. Don't stop it."</p>
      <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://dnbdoctor.com/music/vortex-neurofunk-pressure" style="height:50px;v-text-anchor:middle;width:240px;" arcsize="50%" strokecolor="#74F2CE" fillcolor="#74F2CE"><w:anchorlock/><center style="color:#04050f;font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;font-weight:800;">▶  Enter the Vortex</center></v:roundrect><![endif]--><!--[if !mso]><!-- --><a href="https://dnbdoctor.com/music/vortex-neurofunk-pressure" style="display:inline-block;padding:15px 36px;border-radius:999px;background-color:#74F2CE;color:#04050f;font-size:15px;font-weight:800;text-decoration:none;letter-spacing:0.3px;">&#9654;&#xfe0e;  Enter the Vortex</a><!--<![endif]-->
      <p style="margin:18px 0 0;font-size:11px;color:#4A5068;">Or read the full story at <a href="https://dnbdoctor.com/music/vortex-neurofunk-pressure" style="color:#74F2CE;text-decoration:none;font-weight:600;">dnbdoctor.com/music/vortex-neurofunk-pressure</a></p>
    </td></tr>
  </table>
</td></tr>

<!-- CLOSING -->
<tr><td style="padding:22px 2px 8px;">
  <p style="margin:0 0 6px;font-size:14px;line-height:1.75;color:#7B7FAF;">The vortex is never satisfied. More is coming. Keep your ears tuned and your bass system ready.</p>
  <p style="margin:0;font-size:14px;color:#74F2CE;font-weight:600;">— DnB Doctor Team</p>
</td></tr>

<!-- FOOTER -->
<tr><td align="center" style="padding:18px 0 8px;border-top:1px solid rgba(111,61,255,0.15);">
  <p style="margin:0 0 10px;font-weight:600;color:#C9CCFF;font-size:13px;">Follow the Signal</p>
  <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 auto 12px;"><tr>
    <td style="padding:0 5px;"><a href="https://instagram.com/dnbdoctor" style="color:#74F2CE;text-decoration:none;font-size:12px;">Instagram</a></td>
    <td style="padding:0 5px;color:#2a2e4a;font-size:12px;">·</td>
    <td style="padding:0 5px;"><a href="https://www.facebook.com/DnBDoctor" style="color:#74F2CE;text-decoration:none;font-size:12px;">Facebook</a></td>
    <td style="padding:0 5px;color:#2a2e4a;font-size:12px;">·</td>
    <td style="padding:0 5px;"><a href="https://www.youtube.com/@DnBDoctor" style="color:#74F2CE;text-decoration:none;font-size:12px;">YouTube</a></td>
    <td style="padding:0 5px;color:#2a2e4a;font-size:12px;">·</td>
    <td style="padding:0 5px;"><a href="https://open.spotify.com/user/31l3ju5tfecan4y0uf1zjkvb3bim" style="color:#74F2CE;text-decoration:none;font-size:12px;">Spotify</a></td>
    <td style="padding:0 5px;color:#2a2e4a;font-size:12px;">·</td>
    <td style="padding:0 5px;"><a href="https://soundcloud.com/dnbdoctor" style="color:#FF5500;text-decoration:none;font-size:12px;">SoundCloud</a></td>
  </tr></table>
  <p style="margin:0 0 4px;font-size:11px;color:#6C728A;">#DnBDoctor #MixVortex #Neurofunk #2026</p>
  <p style="margin:0;font-size:11px;color:#4A5068;">You can <a href="{unsubscribeUrl}" style="color:#74F2CE;text-decoration:none;">unsubscribe here</a> or update your preferences.</p>
</td></tr>

</table></td></tr></table>`,
  },
  {
    id: "upcoming-events",
    name: "Upcoming Events",
    description: "Let subscribers know about livestreams, showcases, or community events.",
    subject: "Don't Miss Our Next DnB Doctor Event",
    preview: "Hey {name}, we have an upcoming event you won't want to miss...",
    body: "Hey {name},\n\nWe have an upcoming event you won't want to miss. Expect high-octane sets, exclusive interviews, and community spotlights straight from the DnB Doctor crew.\n\nSave the date and we'll see you there!\n\nDnB Doctor Team",
  },
];
