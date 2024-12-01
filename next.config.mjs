/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "standalone",
  
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
