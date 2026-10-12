import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://stfrancis.is"),

  title: {
    default: "St. Francis of Assisi Parish | Stykkishólmur",
    template: "%s | St. Francis of Assisi Parish",
  },

  description:
    "St. Francis of Assisi Catholic Parish in Stykkishólmur, Iceland. Mass times, parish news, events, live streams, gallery and contact information.",

  applicationName: "St. Francis of Assisi Parish",

  keywords: [
    "St. Francis of Assisi",
    "Stykkishólmur",
    "Catholic Church Iceland",
    "Catholic Parish Stykkishólmur",
    "Mass Stykkishólmur",
    "Catholic Mass Iceland",
    "Snæfellsnes Catholic Church",
    "church Stykkishólmur",
  ],

  authors: [
    {
      name: "St. Francis of Assisi Parish",
    },
  ],

  creator: "St. Francis of Assisi Parish",
  publisher: "St. Francis of Assisi Parish",

  openGraph: {
    type: "website",
    url: "https://stfrancis.is",
    siteName: "St. Francis of Assisi Parish",
    title: "St. Francis of Assisi Parish | Stykkishólmur",
    description:
      "Mass times, parish news, events and live streams from St. Francis of Assisi Parish in Stykkishólmur, Iceland.",
    images: [
      {
        url: "/fransiskus-hero-v4.webp",
        width: 1200,
        height: 630,
        alt: "St. Francis of Assisi Parish in Stykkishólmur",
      },
    ],
    locale: "en_IS",
  },

  twitter: {
    card: "summary_large_image",
    title: "St. Francis of Assisi Parish | Stykkishólmur",
    description:
      "Mass times, parish news, events and live streams from St. Francis of Assisi Parish in Stykkishólmur, Iceland.",
    images: ["/fransiskus-hero-v4.webp"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/fransiskus-logo.webp",
    shortcut: "/fransiskus-logo.webp",
    apple: "/fransiskus-logo.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
