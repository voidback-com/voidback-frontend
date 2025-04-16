const Config = require('./lib/config');
const siteUrl = Config.url;

module.exports = {
   siteUrl,
   generateRobotsTxt: true,
   robotsTxtOptions: {
      policies: [
         {userAgent: "*", allow: "/"},
      ],
   },
};

