import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fransiskus Stykkishólmi",
  description: "Mass times, news, events and live streams from the parish of Saint Francis of Assisi in Stykkishólmur.",
  icons: { icon: "/fransiskus-logo.webp", shortcut: "/fransiskus-logo.webp" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
