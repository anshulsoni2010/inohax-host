import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"

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
                <script
                    type="text/javascript"
                    dangerouslySetInnerHTML={{
                        __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "oolt1oy5wj");
            `,
                    }}
                />
                <link rel="icon" href="/inovact.png" />
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
                <Analytics />
            </body>
        </html>
    );
}
