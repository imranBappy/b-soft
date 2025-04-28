/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            's3.ap-south-1.amazonaws.com',
            'localhost',
            'b-soft-s3.xyz.s3.ap-south-1.amazonaws.com',
        ],
    },
};

export default nextConfig;
