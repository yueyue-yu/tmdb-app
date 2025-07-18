import {getRequestConfig} from 'next-intl/server';
import {cookies} from 'next/headers';

export default getRequestConfig(async () => {
  // Get locale from cookies, or default to 'zh' (Chinese)
  const cookieStore = await cookies();
  const locale = cookieStore.get('locale')?.value || 'zh';

  // Validate locale
  const supportedLocales = ['en', 'zh'];
  const validLocale = supportedLocales.includes(locale) ? locale : 'zh';

  return {
    locale: validLocale,
    messages: (await import(`../messages/${validLocale}.json`)).default
  };
});
