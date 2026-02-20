import dotenv from "dotenv";
import { auth } from "../app/lib/auth";
import { prisma } from "../lib/prisma";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTransientDbStartupError(error: unknown): boolean {
  const message =
    typeof error === "string"
      ? error
      : (error as { message?: string } | null)?.message || "";
  const lower = message.toLowerCase();

  return (
    lower.includes("not yet accepting connections") ||
    lower.includes("consistent recovery state") ||
    lower.includes("recovery mode") ||
    lower.includes("can't reach database server") ||
    lower.includes("connection refused") ||
    lower.includes("econnrefused") ||
    lower.includes("terminating connection")
  );
}

async function withDbRetry<T>(fn: () => Promise<T>, attempts = 20, delayMs = 3000): Promise<T> {
  let lastError: unknown = null;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (!isTransientDbStartupError(error) || i === attempts) throw error;
      console.warn(`DB not ready (attempt ${i}/${attempts}). Retrying in ${Math.round(delayMs / 1000)}s...`);
      await sleep(delayMs);
    }
  }
  throw lastError;
}

async function main() {
  dotenv.config();

  const email = process.env.ADMIN_SEED_EMAIL;
  const password = process.env.ADMIN_SEED_PASSWORD;
  const name = process.env.ADMIN_SEED_NAME || "Admin";

  if (!email || !password) {
    console.error("ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD must be set in .env");
    process.exit(1);
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await withDbRetry(() =>
    prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, email: true },
    })
  );

  if (existingUser) {
    await withDbRetry(() => prisma.user.delete({ where: { id: existingUser.id } }));
    console.log(`Deleted existing user ${existingUser.email}`);
  }

  const signUpResponse = await auth.api.signUpEmail({
    body: {
      email: normalizedEmail,
      password,
      name,
    },
    asResponse: true,
  });

  if (!signUpResponse.ok) {
    const text = await signUpResponse.text();
    console.error("Failed to create admin user:", text);
    process.exit(1);
  }

  const createdUser = await withDbRetry(() =>
    prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, email: true },
    })
  );

  if (!createdUser) {
    console.error("User was not created successfully.");
    process.exit(1);
  }

  await withDbRetry(() =>
    prisma.user.update({
      where: { id: createdUser.id },
      data: { role: "ADMIN" },
    })
  );

  console.log(`Admin user reset successfully: ${createdUser.email}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
