/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["s3.ap-south-1.amazonaws.com","w3-restaurant-pos.s3.ap-south-1.amazonaws.com" ,"localhost","b-soft-s3.xyz.s3.ap-south-1.amazonaws.com"]
    }
};

/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    // additional options if needed
});

module.exports = withPWA({
    // your other next.js config options here
});


export default nextConfig;
