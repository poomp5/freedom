import "server-only";
import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";

/**
 * Donation recipients.
 *
 * /donate lists only accounts that set `donatePromptPay` in their profile.
 * Old hard-coded links (/donate/blevrsq ...) are redirected in next.config.mjs.
 */
export const DONORS_CACHE_TAG = "donors";

const readDonorAccounts = unstable_cache(
  async () =>
    prisma.user.findMany({
      where: { donatePromptPay: { not: null }, role: { not: "suspended" } },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: { select: { sheets: true } },
      },
      orderBy: { sheets: { _count: "desc" } },
    }),
  ["donor-accounts-v1"],
  { tags: [DONORS_CACHE_TAG], revalidate: 300 }
);

export async function getDonorAccounts() {
  const users = await readDonorAccounts();
  return users.map((u) => ({
    id: u.id,
    name: u.name,
    username: u.username,
    image: u.image,
    sheetCount: u._count.sheets,
    href: `/donate/${encodeURIComponent(u.username ?? u.id)}`,
  }));
}

export type DonorPage = {
  name: string;
  username: string | null;
  image: string | null;
  seed: string;
  promptPay: string;
  profileHref: string;
};

/** Resolve /donate/[slug] to an account (by username or id) with donations turned on. */
export async function findDonor(slug: string): Promise<DonorPage | null> {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: slug }, { id: slug }],
      donatePromptPay: { not: null },
      role: { not: "suspended" },
    },
    select: { id: true, name: true, username: true, image: true, donatePromptPay: true },
  });
  if (!user) return null;

  return {
    name: user.name,
    username: user.username,
    image: user.image,
    seed: user.id,
    promptPay: user.donatePromptPay!,
    profileHref: `/u/${user.username ?? user.id}`,
  };
}

export function invalidateDonors() {
  revalidateTag(DONORS_CACHE_TAG, { expire: 0 });
}
