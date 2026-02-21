import localFont from "next/font/local";
import "./globals.css";
import { Kanit } from "next/font/google";
import { TRPCReactProvider } from "@/trpc/client";

const kanit = Kanit({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "thai"],
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "FREEDOM | NEXT GEN",
  description: "รวมชีทสรุปทุกวิชา ม.1-ม.6 โรงเรียนอัสสัมชัญธนบุรี",
  icons: {
    icon: "/assets/img/poomicon.png",
  },
  openGraph: {
    title: "FREEDOM | NEXT GEN",
    description: "รวมชีทสรุปทุกวิชา ม.1-ม.6 โรงเรียนอัสสัมชัญธนบุรี",
    images: [
      {
        url: "/assets/img/cover.png",
        width: 1200,
        height: 630,
        alt: "Freedom - ชีทสรุป",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FREEDOM | NEXT GEN",
    description: "รวมชีทสรุปทุกวิชา ม.1-ม.6 โรงเรียนอัสสัมชัญธนบุรี",
    images: ["/assets/img/cover.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body className={`${kanit.className} ${geistMono.variable} antialiased`}>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
