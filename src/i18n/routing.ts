import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'ar'],
  localeDetection: false, // we'll do manual detection from cookie
  // Used when no locale matches
  defaultLocale: 'ar'
});