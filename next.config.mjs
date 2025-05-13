/** @type {import('next').NextConfig} */

const nextConfig = {

  env: {
    "API_URL": process.env.API_URL
  },
  
  compiler: {
    styledComponents: true,
  },


  eslint: {
    ignoreDuringBuilds: true
  },



 webpack: (config) => {

      config.resolve.alias = {
          ...config.resolve.alias,
          "sharp$": false,
          "onnxruntime-node$": false,
      }
      return config;
  },

};



export default nextConfig;
