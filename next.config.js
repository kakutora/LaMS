/** @type {import('next').NextConfig} */
const nextConfig = {
    serverRuntimeConfig: {
        maxBodySize: '10mb',
    },
};

module.exports = nextConfig;
