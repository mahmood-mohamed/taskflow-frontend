import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const handleI18nRouting = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;

  // استخراج اللغة الحالية من الـ URL أو استخدام الافتراضية
  const segments = pathname.split('/');
  const locale = routing.locales.includes(segments[1] as any) ? segments[1] : routing.defaultLocale;
  const pathWithoutLocale = pathname.replace(/^\/(ar|en)/, '') || '/';
  
  const authPages = ['/login', '/register','/forgot-password', '/reset-password', '/verify-otp'];
  const dashboardPages = ['/', '/tasks', '/archive', '/profile'];

  const isAuthPage = authPages.includes(pathWithoutLocale);
  const isDashboardPage = 
    pathWithoutLocale === '/' || 
    dashboardPages.some(page => page !== '/' && pathWithoutLocale.startsWith(page));

  // الحماية:
  // لو داخل Dashboard وهو مش مسجل، يروح للـ login بتاع نفس اللغة
  if (isDashboardPage && !isAuthPage && !token) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  // لو مسجل وحاول يروح لصفحة Auth، يروح للـ tasks
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL(`/${locale}/tasks`, request.url));
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
