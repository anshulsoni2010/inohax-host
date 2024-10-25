import type { Metadata } from "next";
import localFont from "next/font/local";
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
    title: "Inohax 1.0",
    description: "Inohax 1.0 - A 24 Hours Open Innovation Hackathon by Inovact for Students & Entrepreneurs",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/inovact.pn" />
                <title>Inohax 1.0</title>
                <meta name="description" content="Inohax 1.0 - A 24 Hours Open Innovation Hackathon by Inovact for Students & Entrepreneurs" />
                <meta property="og:url" content="https://inohax.inovact.in" />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="Inohax 1.0" />
                <meta property="og:description" content="A 24 Hours Open Innovation Hackathon by Inovact for Students & Entrepreneurs" />
                <meta property="og:title" content="Inohax 1.0 Registration Form" />
                <meta property="og:locale" content="en_IN" />
                <meta property="og:image:width" content="600" />
                <meta property="og:image:height" content="600" />
                <meta property="og:image:alt" content="Inohax 1.0 Poster" />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:url" content="https://inohax.inovact.in/poster.png" />
                <meta property="og:image:secure_url" content="https://inohax.inovact.in/poster.png" />

            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
