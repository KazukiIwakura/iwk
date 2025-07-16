import type { Metadata } from "next";
import { Noto_Sans_JP, Open_Sans } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "kazukiiwakura",
  description: "My portfolio site",
  icons: {
    icon: '/favicon.png',
  },
};

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Define the className outside of the JSX to ensure consistent rendering
  const bodyClasses = `${notoSansJP.variable} ${openSans.variable} antialiased min-h-screen w-full overflow-x-hidden`;
  
  return (
    <html lang="en">
      <body className={bodyClasses}>
        {children}
      </body>
    </html>
  );
}
