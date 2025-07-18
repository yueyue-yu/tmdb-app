'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const supportedLocales = ['en', 'zh'];

export async function setLocale(locale: string) {
  // Validate locale
  if (!supportedLocales.includes(locale)) {
    console.error(`Unsupported locale: ${locale}`);
    return;
  }

  const cookieStore = await cookies();
  cookieStore.set('locale', locale, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });

  redirect('/');
}
