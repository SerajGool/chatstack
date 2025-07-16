/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    config.module.rules.push({
      test: /node_modules\/pdf-parse\/test\//,
      use: 'ignore-loader'
    });
    return config;
  }
};

module.exports = nextConfig;