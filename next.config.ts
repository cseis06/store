// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',  // Para cuando uses Supabase Storage
      },
      {
        protocol: 'https',
        hostname: 'ydndaulltwtihrrjhvdbp.supabase.co',  // Tu proyecto específico
      },
    ],
  },
};

export default nextConfig;