import { NextRequest, NextResponse } from 'next/server';

// 支持的语言列表
const locales = ['en', 'zh'];
const defaultLocale = 'zh';

// 从Accept-Language头获取首选语言
function getLocaleFromAcceptLanguage(acceptLanguage: string | null): string {
  if (!acceptLanguage) return defaultLocale;

  // 解析Accept-Language头
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [code, q = '1'] = lang.trim().split(';q=');
      return {
        code: code.toLowerCase(),
        quality: parseFloat(q)
      };
    })
    .sort((a, b) => b.quality - a.quality);

  // 查找匹配的语言
  for (const lang of languages) {
    // 完全匹配
    if (locales.includes(lang.code)) {
      return lang.code;
    }
    
    // 语言前缀匹配 (例如: zh-CN -> zh)
    const prefix = lang.code.split('-')[0];
    if (locales.includes(prefix)) {
      return prefix;
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  // 获取当前路径
  const pathname = request.nextUrl.pathname;
  
  // 跳过静态文件和API路由
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // 获取当前语言设置
  let locale = request.cookies.get('locale')?.value;

  // 如果没有设置语言，从浏览器检测
  if (!locale) {
    const acceptLanguage = request.headers.get('accept-language');
    locale = getLocaleFromAcceptLanguage(acceptLanguage);
    
    // 设置cookie
    const response = NextResponse.next();
    response.cookies.set('locale', locale, {
      maxAge: 60 * 60 * 24 * 365, // 1年
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    return response;
  }

  // 验证语言是否有效
  if (!locales.includes(locale)) {
    locale = defaultLocale;
    const response = NextResponse.next();
    response.cookies.set('locale', locale);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // 匹配所有路径，除了以下：
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
};
