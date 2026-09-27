import "server-only";
import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { legacyDonors } from "@/app/config/donate";

/**
 * Donation recipients.
 *
 * /donate lists only accounts that set `donatePromptPay` in their profile.
 * `app/config/donate.ts` is kept as a fallback so old links such as
 * /donate/blevrsq (printed on legacy sheets) still resolve.
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
  /** Bank-account holder name; only known for legacy entries. */
  accountName?: string;
  role?: string;
  profileHref?: string;
};

export type DonorLookup = { donor: DonorPage } | { redirectTo: string } | null;

/** Resolve /donate/[slug]: an account (by username or id) first, then the legacy list. */
export async function findDonor(slug: string): Promise<DonorLookup> {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: slug }, { id: slug }],
      donatePromptPay: { not: null },
      role: { not: "suspended" },
    },
    select: { id: true, name: true, username: true, image: true, donatePromptPay: true },
  });
  if (user) {
    return {
      donor: {
        name: user.name,
        username: user.username,
        image: user.image,
        seed: user.id,
        promptPay: user.donatePromptPay!,
        profileHref: `/u/${user.username ?? user.id}`,
      },
    };
  }

  const legacy = legacyDonors[slug as keyof typeof legacyDonors];
  if (!legacy) return null;

  // A legacy entry whose owner now has an account with donations on → send them there.
  if (legacy.userId) {
    const owner = await prisma.user.findFirst({
      where: { id: legacy.userId, donatePromptPay: { not: null } },
      select: { id: true, username: true },
    });
    if (owner) return { redirectTo: `/donate/${encodeURIComponent(owner.username ?? owner.id)}` };
  }

  return {
    donor: {
      name: legacy.name,
      username: legacy.username,
      image: legacy.avatar,
      seed: legacy.username,
      promptPay: legacy.phone,
      accountName: legacy.accountName,
      role: legacy.role,
    },
  };
}

export function invalidateDonors() {
  revalidateTag(DONORS_CACHE_TAG, { expire: 0 });
}
