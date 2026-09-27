/**
 * Legacy donation recipients from before donations moved to user profiles.
 *
 * /donate now lists only accounts that set a PromptPay number in their
 * profile (see lib/donors.ts). These entries stay so old links like
 * /donate/blevrsq keep working.
 *
 * `userId` links an entry to its owner's account (matched by PromptPay
 * number). When that account has donations turned on, /donate/<username>
 * redirects to it instead of showing the data below.
 */
type LegacyDonor = {
  username: string;
  name: string;
  accountName: string;
  bank: string;
  phone: string;
  avatar: string;
  role: string;
  /** Owner's account id, when one exists. */
  userId?: string;
};

export const legacyDonors: Record<string, LegacyDonor> = {
  blevrsq: {
    username: "blevrsq",
    name: "blevrsq",
    accountName: "รัศมิ์ลภัส รติสุขพิมล",
    bank: "Kbank",
    phone: "0641566647",
    avatar: "/assets/img/avatar/blevrsq.jpg",
    role: "ทำชีทสรุป ม.2-3",
    // No account on the site; their sheets are under the "Freedom" account.
  },
};
