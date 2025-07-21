import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import ThemeProvider from './components/providers/ThemeProvider';
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
    template: '%s - TMDB',
    default: 'TMDB - 电影数据库'
  },
  description: "探索全球最新最热门的电影、电视剧和明星信息。发现你的下一部最爱作品，获取详细的影片资料、评分和评论。",
  keywords: ['电影', '电视剧', '明星', 'TMDB', '影评', '电影数据库', '娱乐'],
  authors: [{ name: 'TMDB App' }],
  creator: 'TMDB App',
  publisher: 'TMDB App',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://tmdb-app.com',
    title: 'TMDB - 电影数据库',
    description: '探索全球最新最热门的电影、电视剧和明星信息',
    siteName: 'TMDB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TMDB - 电影数据库',
    description: '探索全球最新最热门的电影、电视剧和明星信息',
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
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
