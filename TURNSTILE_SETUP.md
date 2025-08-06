# Cloudflare Turnstile Setup

## 1. Cloudflare Dashboard Setup

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Security** → **Turnstile**
3. Click **Add Site**
4. Choose **Managed** challenge type
5. Select domains where you want to use Turnstile
6. Copy the **Site Key** and **Secret Key**

## 2. Environment Variables

Add these variables to your `.env.local` file:

```env
# Turnstile Configuration
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key_here
TURNSTILE_SECRET_KEY=your_secret_key_here
```

## 3. Features Implemented

### Security Enhancements:
- ✅ **CAPTCHA Protection** - Prevents automated attacks
- ✅ **Token Validation** - Server-side verification
- ✅ **Rate Limiting** - 5 attempts before 15-minute lockout
- ✅ **Session Security** - 30-minute inactivity timeout
- ✅ **Security Headers** - XSS, CSRF protection

### UI/UX Features:
- ✅ **Dark Theme** - Matches your site's design
- ✅ **Responsive Design** - Works on all devices
- ✅ **Loading States** - Visual feedback during verification
- ✅ **Error Handling** - Clear error messages
- ✅ **Animations** - Smooth transitions with Framer Motion

## 4. How It Works

1. **User visits admin login** → Turnstile widget loads
2. **User completes challenge** → Token generated
3. **User submits form** → Token sent to server
4. **Server verifies token** → Cloudflare validates
5. **If valid** → User authenticated
6. **If invalid** → Access denied

## 5. Testing

### Development:
- Use Cloudflare's test keys for development
- Test both success and failure scenarios

### Production:
- Use real Cloudflare keys
- Monitor Turnstile analytics in Cloudflare dashboard

## 6. Troubleshooting

### Common Issues:

1. **"Site key not found"**
   - Check `NEXT_PUBLIC_TURNSTILE_SITE_KEY` in `.env.local`
   - Ensure key is correct in Cloudflare dashboard

2. **"Verification failed"**
   - Check `TURNSTILE_SECRET_KEY` in `.env.local`
   - Verify domain is added to Turnstile in Cloudflare

3. **Widget not loading**
   - Check browser console for errors
   - Ensure no ad blockers are interfering

## 7. Security Best Practices

- ✅ **Never expose secret key** in client-side code
- ✅ **Always verify tokens** server-side
- ✅ **Use HTTPS** in production
- ✅ **Monitor for abuse** in Cloudflare dashboard
- ✅ **Regular key rotation** for enhanced security

## 8. Customization

The Turnstile widget is styled to match your site's theme:
- Dark background
- Purple/Green color scheme
- Responsive design
- Smooth animations

For custom styling, modify the Turnstile component in `app/admin/login/page.tsx`. 