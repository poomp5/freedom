import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { Kanit } from 'next/font/google'

const kanit = Kanit({
  weight: ['100','200','300','400','500','600','700','800','900'],
  subsets: ['latin'],
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "FREEDOM | NEXT GEN",
  description: "ASSUMPTION COLLEGE THONBURI",
  icons: {
    icon: "/assets/img/poomicon.png",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
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
        className={`${kanit.className} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
};