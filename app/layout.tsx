import localFont from "next/font/local";
import "./globals.css";
import {Kanit} from 'next/font/google'

export const year = "2567";

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
            </head>
            <body className={`${kanit.className} ${geistMono.variable} antialiased`}>
                {children}
            </body>
        </html>
    );
};