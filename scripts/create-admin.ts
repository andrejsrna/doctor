import 'dotenv/config'
import { prisma } from '../lib/prisma'

async function main() {
  const baseURL = process.env.BASE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const email = process.env.ADMIN_SEED_EMAIL
  const password = process.env.ADMIN_SEED_PASSWORD
  const name = process.env.ADMIN_SEED_NAME || 'Admin'

  if (!email || !password) {
    console.error('ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD must be set in .env')
    process.exit(1)
  }

  try {
    const signUpRes = await fetch(`${baseURL}/api/auth/sign-up/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    })
    if (!signUpRes.ok) {
      const text = await signUpRes.text()
      console.warn('Sign up failed or user already exists:', text)
    } else {
      console.log('Sign up request sent')
    }
  } catch (e) {
    console.warn('Sign up request error (continuing):', e)
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    console.error('User not found after signup. If email verification is required, disable it temporarily.')
    process.exit(1)
  }

  await prisma.user.update({ where: { id: user.id }, data: { role: 'ADMIN' } })
  console.log(`User ${email} promoted to ADMIN`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


