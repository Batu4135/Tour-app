import { prisma } from "@/lib/prisma";
import { getSessionFromCookies } from "@/lib/auth";
import { isDevAuthBypassEnabled } from "@/lib/securityEnv";
import bcrypt from "bcryptjs";

export async function requireAuth() {
  const authDisabled = isDevAuthBypassEnabled();
  if (authDisabled) {
    const existingUser = await prisma.user.findFirst({
      select: { id: true }
    });
    if (existingUser) return existingUser;

    const createdUser = await prisma.user.create({
      data: { pinHash: await bcrypt.hash("000000", 12) },
      select: { id: true }
    });
    return createdUser;
  }

  const session = getSessionFromCookies();
  if (!session.valid || !session.userId) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true }
  });
  if (!user) return null;
  return user;
}
