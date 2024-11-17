import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import {Kanit} from 'next/font/google'

const kanit = Kanit({
    weight: [
        '100',
        '200',
        '300',
        '400',
        '500',
        '600',
        '700',
        '800',
        '900'
    ],
    subsets: ['latin']
})
const geistMono = localFont(
    {src: "./fonts/GeistMonoVF.woff", variable: "--font-geist-mono", weight: "100 900"}
);

export const metadata = {
    title: "FREEDOM | NEXT GEN",
    description: "ASSUMPTION COLLEGE THONBURI",
    icons: {
        icon: "/assets/img/poomicon.png"
    }
};

export default function RootLayout({children} : Readonly < {
    children: React.ReactNode;
} >) {
    return (
        <html lang="en">
            <head>
                <Script id="countdown-exam" strategy="afterInteractive">
                    {
                        `
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

                const days = String(Math.floor(distance / day)).padStart(2, "0"),
                  hours = String(Math.floor((distance % day) / hour)).padStart(2, "0"),
                  minutes = String(Math.floor((distance % hour) / minute)).padStart(2, "0"),
                  seconds = String(Math.floor((distance % minute) / second)).padStart(2, "0");

                document.getElementById("days").innerText = \`\${days}\`;
                document.getElementById("hours").innerText = \`\${hours}\`;
                document.getElementById("minutes").innerText = \`\${minutes}\`;
                document.getElementById("seconds").innerText = \`\${seconds}\`;

                if (distance < 0) {
                  document.getElementById("countdown").style.display = "none";
                  document.getElementById("content").style.display = "block";
                  clearInterval(x);
                }
              }, 1000);
          })();
        `
                    }</Script>
            </head>
            <body className={`${kanit.className} ${geistMono.variable} antialiased`}>
                {children}
            </body>
        </html>
    );
};