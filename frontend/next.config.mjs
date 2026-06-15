/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: 'export',
};

if (process.env.NODE_ENV === 'development') {
  nextConfig.rewrites = async () => {
    return [
      {
        source: '/',
        destination: '/index.html',
      },
    ];
  };
}

export default nextConfig;

