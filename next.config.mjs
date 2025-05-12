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

};



export default nextConfig;
