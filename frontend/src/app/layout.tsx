import { Oswald, Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import MainLayout from "@/layout/MainLayout";
import logo from '@/assets/logo.png';
import favicon from '@/assets/favicon.ico';


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
    keywords: [
        'buy software',
        'Windows 11 key',
        'Photoshop license',
        'ChatGPT Plus',
        'software store',
        'digital products',
        'online software shop',
    ],
    icons: {
        icon: favicon.src, // Path to your favicon
    },
    openGraph: {
        title: 'Bsoft - Your Trusted Software Marketplace',
        description:
            'Explore a wide range of genuine software products at Bsoft. Enjoy instant delivery and secure payments.',
        url: 'https://bsoft.xyz',
        images: [
            {
                url: logo.src,
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
        image: logo.src,
    },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfairDisplay.variable} ${oswald.variable} ${lato.variable} scroll-smooth  relative antialiased`}
      >
        <MainLayout >
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
