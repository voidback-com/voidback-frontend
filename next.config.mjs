/** @type {import('next').NextConfig} */

const nextConfig = {

  transpilePackages: ["highlight.js"],
  env: {
    "API_URL": process.env.API_URL,
    "WS_NOTIFICATIONS_COUNT":  process.env.WS_NOTIFICATIONS_COUNT,
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
