/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config) => {
        config.resolve.alias["@"] = require("path").resolve(__dirname);
        return config;
    },
    transpilePackages: ["chartjs-adapter-date-fns", "date-fns"],
};

module.exports = nextConfig;
