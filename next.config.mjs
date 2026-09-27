// Old per-grade pages (/m2/midterm1 ...) now live in /sheets with filters.
// PDFs under /m2/midterm1/*.pdf are still served from /public.
// Params stay ASCII: Thai in a redirect destination breaks the Location header.
const EXAMS = {
  midterm1: { exam: "midterm", term: "1" },
  midterm2: { exam: "midterm", term: "2" },
  final1: { exam: "final", term: "1" },
  final2: { exam: "final", term: "2" },
};

const legacySheetRedirects = [1, 2, 3, 4, 5, 6].flatMap((grade) => [
  { source: `/m${grade}`, destination: `/sheets?level=m${grade}`, permanent: true },
  ...Object.entries(EXAMS).map(([slug, { exam, term }]) => ({
    source: `/m${grade}/${slug}`,
    destination: `/sheets?${new URLSearchParams({ level: `m${grade}`, exam, term })}`,
    permanent: true,
  })),
]);

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/select", destination: "/sheets", permanent: true },
      ...legacySheetRedirects,
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "promptpay.io" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "**.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "**.r2.dev" },
      { protocol: "https", hostname: "cdn.pranakorn.dev", pathname: "/freedom/**" },
      ...(process.env.R2_PUBLIC_URL
        ? [{ protocol: "https", hostname: new URL(process.env.R2_PUBLIC_URL).hostname }]
        : []),
    ],
  },
  serverExternalPackages: ['@prisma/client'],
};


export default nextConfig;
