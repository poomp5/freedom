import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "FREEEDOM NEXT GEN",
  description: "เว็บไซต์แจกชีทสรุปโรงเรียนอัสสัมชัญธนบุรี",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"></link>
        <Script id="countdown-exam" strategy="afterInteractive">
          {`
            (function () {
              const second = 1000,
                minute = second * 60,
                hour = minute * 60,
                day = hour * 24;
              let today = new Date(),
                dd = String(today.getDate()).padStart(2, "0"),
                mm = String(today.getMonth() + 1).padStart(2, "0"),
                yyyy = today.getFullYear(),
                nextYear = yyyy + 1,
                dayMonth = "12/18/",
                birthday = dayMonth + yyyy;
              today = mm + "/" + dd + "/" + yyyy;
              if (today > birthday) {
                birthday = dayMonth + nextYear;
              }
              const countDown = new Date(birthday).getTime(),
                x = setInterval(function () {
                  const now = new Date().getTime(),
                    distance = countDown - now;

                  document.getElementById("days").innerText = Math.floor(distance / day);
                  document.getElementById("hours").innerText = Math.floor((distance % day) / hour);
                  document.getElementById("minutes").innerText = Math.floor((distance % hour) / minute);
                  document.getElementById("seconds").innerText = Math.floor((distance % minute) / second);

                  if (distance < 0) {
                    document.getElementById("countdown").style.display = "none";
                    document.getElementById("content").style.display = "block";
                    clearInterval(x);
                  }
                }, 0);
            })();
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
