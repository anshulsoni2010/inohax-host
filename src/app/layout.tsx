import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

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
    title: "Inohax 2.0 - Open Innovation Hackathon for Students & Entrepreneurs",
    description: "Join Inohax 2.0, a 24-hour online open innovation hackathon by Inovact, taking place on May 23-24, 2025. Designed for students and entrepreneurs to showcase their skills and creativity.",
    keywords: "Inohax, hackathon, innovation, students, entrepreneurs, Inovact",
    authors: [{ name: "Inovact Team" }],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
              <Script id="microsoft-clarity" strategy="afterInteractive">
                {`
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "rhrj0hrue1");
                `}
              </Script>

              
                <link rel="icon" href="/inovact.png" />
                <meta name="description" content="Inohax 2.0 - A 24 Hours Online Open Innovation Hackathon by Inovact for Students & Entrepreneurs, May 23-24, 2025" />
                <meta property="og:url" content="https://inohax.inovact.in" />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="Inohax 2.0" />
                <meta property="og:description" content="A 24 Hours Online Open Innovation Hackathon by Inovact for Students & Entrepreneurs, taking place on May 23-24, 2025" />
                <meta property="og:title" content="Inohax 2.0 - Open Innovation Hackathon | May 23-24, 2025" />
                <meta property="og:locale" content="en_IN" />
                <meta property="og:image" content="https://inohax.inovact.in/poster.png" />
                <meta property="og:image:width" content="600" />
                <meta property="og:image:height" content="600" />
                <meta property="og:image:alt" content="Inohax 2.0 Poster" />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:url" content="https://inohax.inovact.in/poster.png" />
                <meta property="og:image:secure_url" content="https://inohax.inovact.in/poster.png" />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Event",
                        "name": "Inohax 2.0",
                        "startDate": "2025-05-23T12:00",
                        "endDate": "2025-05-24T15:00",
                        "registrationEndDate": "2025-05-20T23:59:00",
                        "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
                        "location": {
                            "@type": "Place",
                            "name": "Inovact Headquarters",
                            "address": {
                                "@type": "PostalAddress",
                                "streetAddress": "123 Innovation Drive",
                                "addressLocality": "City",
                                "addressRegion": "State",
                                "postalCode": "123456",
                                "addressCountry": "Country"
                            }
                        },
                        "image": "https://inohax.inovact.in/poster.png",
                        "description": "A 24-hour online open innovation hackathon by Inovact for students and entrepreneurs, taking place on May 23-24, 2025. Register by May 20th to participate!",
                        "offers": {
                            "@type": "Offer",
                            "url": "https://inohax.inovact.in/registration",
                            "price": "0",
                            "priceCurrency": "INR",
                            "itemOffered": {
                                "@type": "EducationalOrganization",
                                "name": "Inovact"
                            }
                        }
                    })}
                </script>
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} font-geist antialiased bg-black text-white`}
            >
                {children}
                <Analytics />
            </body>
        </html>
    );
}
