import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";

const notoSans = Noto_Sans({ variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CreaDart",
    template: "%s • CreaDart",
  },
  description: "Tournois de fléchette des CreaTechs",
  applicationName: "CreaDart",
  keywords: [
    "fléchettes",
    "dart",
    "tournoi",
    "score",
    "CreaTech",
    "Next.js",
    "Neon",
  ],
  authors: [{ name: "Julien Fernandes" }],
  creator: "Julien Fernandes",
  publisher: "CreaDart",
  metadataBase: new URL("https://creadart.vercel.app"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://creadart.vercel.app",
    title: "CreaDart",
    description: "Tournois de fléchette des CreaTechs",
    siteName: "CreaDart",
  },
  twitter: {
    card: "summary_large_image",
    title: "CreaDart",
    description: "Tournois de fléchette des CreaTechs",
    creator: "@julien_7518",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={notoSans.variable} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Analytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
