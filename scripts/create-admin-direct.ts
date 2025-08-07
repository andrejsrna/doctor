import 'dotenv/config'
import { auth } from '@/app/lib/auth'
import { prisma } from '../lib/prisma'

async function main() {
  const email = process.env.ADMIN_SEED_EMAIL
  const password = process.env.ADMIN_SEED_PASSWORD
  const name = process.env.ADMIN_SEED_NAME || 'Admin'

  if (!email || !password) {
    console.error('ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD must be set in .env')
    process.exit(1)
  }

  const res = await auth.api.signUpEmail({
    body: { email, password, name },
    asResponse: true,
  })

  if (!res.ok) {
    const text = await res.text()
    console.warn('Sign up failed or user already exists:', text)
  } else {
    console.log('Sign up succeeded')
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    console.error('User not found after signup. If verification is enabled, disable it temporarily.')
    process.exit(1)
  }

  await prisma.user.update({ where: { id: user.id }, data: { role: 'ADMIN' } })
  console.log(`User ${email} promoted to ADMIN`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


