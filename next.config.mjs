import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Increase body size limit for API routes (default is 1mb)
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  async rewrites() {
    return [
      {
        source: '/fr/scan-pdf',
        destination: '/fr/scan-pdf',
      },
      {
        source: '/fr/pdf-to-word',
        destination: '/fr/pdf-to-word',
      },
    ];
  },
}

export default withNextIntl(nextConfig)
