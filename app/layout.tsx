import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import ThemeProvider from './components/providers/ThemeProvider';
import { Analytics } from '@vercel/analytics/next';


import "./globals.css";

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
    template: '%s - ICE•ICE FILM',
    default: 'ICE•ICE FILM - 冰雪世界的电影奇迹'
  },
  description: "冰雪世界中的电影奇迹，纯净如冰，精彩如影。探索无限精彩的影视宇宙，发现最新热门电影、经典佳作和明星资讯。",
  keywords: ['电影', '电视剧', '明星', 'ICE FILM', '影评', '电影数据库', '娱乐', '冰雪', '电影奇迹'],
  authors: [{ name: 'ICE•ICE FILM' }],
  creator: 'ICE•ICE FILM',
  publisher: 'ICE•ICE FILM',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://ice-film.com',
    title: 'ICE•ICE FILM - 冰雪世界的电影奇迹',
    description: '纯净如冰，精彩如影。探索无限精彩的影视宇宙，发现最新热门电影、经典佳作和明星资讯。',
    siteName: 'ICE•ICE FILM',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ICE•ICE FILM - 冰雪世界的电影奇迹',
    description: '纯净如冰，精彩如影。探索无限精彩的影视宇宙',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider>
          <ThemeProvider>
              {children}
               <Analytics />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
