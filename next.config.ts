import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  typescript: {
    // ✅ Ignore build errors caused by TypeScript
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['assets.wego.com', "api.tbotechnology.in"],
  },

};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);


