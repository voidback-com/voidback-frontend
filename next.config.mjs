/** @type {import('next').NextConfig} */

const nextConfig = {

  transpilePackages: ["highlight.js"],
  env: {
    "API_URL": process.env.API_URL,
    "WS_NOTIFICATIONS_COUNT":  process.env.WS_NOTIFICATIONS_COUNT,
    "WS_ANALYTICS":  process.env.WS_ANALYTICS,
    "GFETCH_URL": process.env.GFETCH_URL,
    "WS_DMS": process.env.WS_DMS
  },
  
  compiler: {
    styledComponents: true,
  },

   webpack: (config) => {

        config.module.rules.push({
          test: /\.svg$/,
          use: ["@svgr/webpack"]
        });

        config.resolve.alias = {
            ...config.resolve.alias,
            "sharp$": false,
            "onnxruntime-node$": false,
        }
        return config;
    },


};



export default nextConfig;
