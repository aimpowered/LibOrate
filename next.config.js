// /** @type {import('next').NextConfig} */
// const nextConfig = {}

// module.exports = nextConfig

module.exports = {
  async headers() {
    return [
      {
        source: "/(.*)", // Apply these headers to all routes in your application
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self' data:; " +
              "img-src 'self' data: blob:; " +
              "style-src 'self' 'unsafe-inline'; " +
              "media-src 'self' www.youtube.com; " +
              "frame-src 'self' https://www.youtube.com *.youtube.com https://www.youtube.com/embed/ *.youtube.com/embed/; " +
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com/ https://www.youtube.com/ https://s.ytimg.com; " +
              "object-src 'self'; " +
              "child-src https://www.youtube.com/ https://s.ytimg.com",
          },

          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "no-referrer-when-downgrade" },
        ],
      },
    ];
  },
};
