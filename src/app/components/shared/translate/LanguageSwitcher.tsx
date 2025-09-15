'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { setCookie } from 'cookies-next';
import { useTransition } from 'react';

const locales = [
  { code: 'en', label: '🇺🇸 English' },
  { code: 'ar', label: '🇸🇦 العربية' },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleChange = (newLocale: string) => {
    if (newLocale === locale) return;

    // Get current path without locale prefix
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '');
    
    // Preserve all search parameters
    const paramsString = searchParams.toString();
    const queryString = paramsString ? `?${paramsString}` : '';

    const newPath = `/${newLocale}${pathWithoutLocale}${queryString}`;

    // Store in cookies
    setCookie('NEXT_LOCALE', newLocale, { path: '/' });

    // Navigate
    startTransition(() => {
      router.replace(newPath);
    });
  };

  return (
    <div className="relative inline-block">
      <select
        value={locale}
        onChange={(e) => handleChange(e.target.value)}
        className="appearance-none bg-white  border border-stone-300 dark:border-stone-600 rounded-lg px-4 py-2 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        disabled={isPending}
      >
        {locales.map(({ code, label }) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-stone-700 dark:text-stone-300">
        ▼
      </div>
    </div>
  );
}