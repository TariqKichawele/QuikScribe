/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
            },
            {
                hostname: 'oaidalleapiprodscus.blob.core.windows.net'
            }
        ]
    }
};

export default nextConfig;
