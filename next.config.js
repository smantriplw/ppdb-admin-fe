/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://ppdb.api.sman3palu.sch.id/api/:path*',
            },
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ppdb.sman3palu.sch.id',
                port: '',
            }
        ]
    }
}

module.exports = nextConfig
