/** @type {import('next').NextConfig} */




const nextConfig = {
 
  images: {
    domains: ['voidback.com', 'media.voidback.com', 'api.voidback.com'],
  },


  env: {
    "API_URL": process.env.API_URL,
    "WS_NOTIFICATIONS_COUNT": process.env.WS_NOTIFICATIONS_COUNT,
    "WS_THREAD": process.env.WS_THREAD
  },
  
  compiler: {
    styledComponents: true,
  },


  eslint: {
    ignoreDuringBuilds: true
  },

  reactStrictMode: true,

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
