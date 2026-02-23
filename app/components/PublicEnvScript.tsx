// Server component: injects non-sensitive env vars for client-side analytics at runtime.
// This avoids relying purely on NEXT_PUBLIC_* which are baked at build time.

export default function PublicEnvScript() {
  const payload = {
    // Expose only values still needed client-side.
    FB_PIXEL_ID: process.env.NEXT_PUBLIC_FB_PIXEL_ID || '',
    CF_BEACON_TOKEN: process.env.NEXT_PUBLIC_CF_BEACON_TOKEN || '',
  }

  const json = JSON.stringify(payload)
    // avoid closing script tag injection
    .replace(/</g, '\\u003c')

  return (
    <script
      id="dd-public-env"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: `window.__ddPublicEnv = ${json};`,
      }}
    />
  )
}
