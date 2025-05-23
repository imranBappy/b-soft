/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { Oswald, Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import MainLayout from "@/layout/MainLayout";
// import logo from '@/assets/logo.png';
// import favicon from '@/assets/favicon.ico';
import Script from 'next/script';
import Head from "next/head";
import InstallPWAButton from "@/components/InstallPWAButton";


const playfairDisplay = Playfair_Display({ // for heading
    variable: "--font-playfair-display",
    subsets: ["latin", 'cyrillic', 'latin-ext', "vietnamese"],
});

const oswald = Oswald({ // for action btn
    variable: "--font-oswald",
    subsets: ["latin", "cyrillic", "cyrillic-ext", "latin-ext", "vietnamese"],
    weight: ["300", "400", "700"],
});


const lato = Lato({ // for body or text 
    variable: "--font-lato",
    subsets: ["latin", 'latin-ext'],
    weight: ["100", "300", "400", "700", "900"],
});


export const metadata = {
    title: 'Bsoft - Buy Windows, Photoshop, ChatGPT Subscription & More at Best Prices',
    description:
        'Bsoft is your one-stop shop for genuine software products, including Windows, Adobe Photoshop, ChatGPT subscriptions, and more. Get instant delivery and secure payments.',
  
    manifest: "/site.webmanifest",
    icons: [
        {
            url: "/favicon-32x32.png",
            type: "image/png",
            sizes: "32x32",
        },
        {
            url: "/android-chrome-192x192.png",
            type: "image/png",
            sizes: "192x192",
        },
    ],
    themeColor: "#FFC400",
    keywords: [
        'buy software',
        'Windows 11 key',
        'Photoshop license',
        'ChatGPT Plus',
        'software store',
        'digital products',
        'online software shop',
    ],

   
    openGraph: {
        title: 'Bsoft - Your Trusted Software Marketplace',
        description:
            'Explore a wide range of genuine software products at Bsoft. Enjoy instant delivery and secure payments.',
        url: 'https://bsoft.xyz',
        images: [
            {
                url: '/favicon-512x512.png', // or logo.src if you import it
                width: 800,
                height: 600,
                alt: 'Bsoft Logo',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@bsoft',
        title: 'Bsoft - Buy Genuine Software Online',
        description:
            'Purchase authentic software products like Windows, Photoshop, and ChatGPT subscriptions at Bsoft.',
        image: '/favicon-512x512.png', // replace with your logo image path
    },

};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <Head>
                <title>{metadata.title}</title>
                <meta name="description" content={metadata.description} />
                <meta name="keywords" content={metadata.keywords.join(', ')} />
                <meta property="og:title" content={metadata.openGraph.title} />
                <meta property="og:description" content={metadata.openGraph.description} />
                <meta property="og:url" content={metadata.openGraph.url} />
                <meta property="og:type" content="website" />
                <meta property="og:image" content={metadata.openGraph.images[0].url} />
                <meta property="og:image:width" content={metadata.openGraph.images[0].width.toString()} />
                <meta property="og:image:height" content={metadata.openGraph.images[0].height.toString()} />
                <meta name="twitter:card" content={metadata.twitter.card} />
                <meta name="twitter:site" content={metadata.twitter.site} />
                <meta name="twitter:title" content={metadata.twitter.title} />
                <meta name="twitter:description" content={metadata.twitter.description} />
                <meta name="twitter:image" content={metadata.twitter.image} />

                {/* Favicon and Icons */}
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="shortcut icon" href="/favicon.ico" />
                <link rel="manifest" href="/site.webmanifest" />

                <meta
                    name="facebook-domain-verification"
                    content="axanm867oa2gljplwh5p0vli7f4k11"
                />
            </Head>
            <body
                className={`${playfairDisplay.variable} ${oswald.variable} ${lato.variable} scroll-smooth  relative antialiased`}
            >
                <MainLayout>{children}</MainLayout>

                <Script id="facebook-pixel" strategy="afterInteractive">
                    {`
                    !function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '850323950556537');
                    fbq('track', 'PageView');
                  `}
                    <noscript>
                        <img
                            height="1"
                            width="1"
                            style={{ display: 'none' }}
                            src="https://www.facebook.com/tr?id=850323950556537&ev=PageView&noscript=1"
                        />
                    </noscript>
                </Script>
                <InstallPWAButton />
            </body>
        </html>
    );
}
