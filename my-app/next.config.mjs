/** @type {import('next').NextConfig} */
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    distDir: "dist",
    output:"standalone",
    // trailingSlash: true,
    images: {
      unoptimized: true,
    },
  };
export default nextConfig;


  